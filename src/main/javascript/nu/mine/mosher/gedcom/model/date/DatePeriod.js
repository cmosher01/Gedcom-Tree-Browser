/**
 * @fileoverview
 * Defines the {@link DatePeriod} class.
 */


(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gedcom.model.date.DatePeriod";

	$.provide(CLASS);

	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;
	$.require("nu.mine.mosher.gedcom.model.date.DateRange");
	var DateRange = nu.mine.mosher.gedcom.model.date.DateRange;
	$.require("nu.mine.mosher.gedcom.model.date.YMD");
	var YMD = nu.mine.mosher.gedcom.model.date.YMD;

	var DatePeriod = $.declare(CLASS, null, {

		/**
		 * @class
		 * Represents a period of time.
		 * @requires Util
		 * @requires DateRange
		 * 
		 * @constructor
		 * @param {DateRange} dateStart null/undefined gets converted to DateRange.UNKNOWN
		 * @param {DateRange} dateEnd null/undefined gets converted to DateRange.UNKNOWN
		 * @return new {@link DatePeriod}
		 * @type DatePeriod
		 */
		constructor: function(dateStart, dateEnd) {
			this.dateStart = dateStart;
			if (!this.dateStart) {
				this.dateStart = DateRange.UNKNOWN;
			}
			this.dateEnd = dateEnd;
			if (!this.dateEnd) {
				this.dateEnd = DateRange.UNKNOWN;
			}
		},
		
		/**
		 * @return the start date
		 * @type DateRange
		 */
		getStartDate: function() {
			return this.dateStart;
		},
		
		/**
		 * @return the end date
		 * @type DateRange
		 */
		getEndDate: function() {
			return this.dateEnd;
		},
		
		/**
		 * @return if start == end
		 * @type Boolean
		 */
		isSingle: function() {
			return DateRange.equal(this.dateStart,this.dateEnd);
		},
		
		/**
		 * @return date period string
		 * @type String
		 */
		toString: function() {
			if (this.isSingle()) {
				return this.dateStart.toString();
			}
			return Util.safeStr(this.dateStart)+"\u2014"+Util.safeStr(this.dateEnd);
		}
	});

	/**
	 * Checks two {@link DatePeriod}s for equality.
	 * @param {DatePeriod} a
	 * @param {DatePeriod} b
	 * @return if a and b are equal
	 * @type Boolean
	 */
	DatePeriod.equal = function(a,b) {
		return DateRange.equal(a.getStartDate(),b.getStartDate()) && DateRange.equal(a.getEndDate(),b.getEndDate());
	};
	
	/**
	 * Compares two {@link DatePeriod}s, for sorting.
	 * @param {DatePeriod} a
	 * @param {DatePeriod} b
	 * @return negative for a&lt;b, positive for b&lt;a, zero for a=b
	 * @type Number
	 */
	DatePeriod.order = function(a,b) {
		// TODO figure out how to handle unknown dates so they sort like this:
		//    2001-03-12
		//    [unknown] -- 2011-03-13
		//    2011-03-13
		//    2011-03-13 -- [unknown]
		//    2001-03-14
		var c;
		c = DateRange.order(a.getStartDate(),b.getStartDate());
		if (!c || DateRange.equal(a.getStartDate(), DateRange.UNKNOWN)) {
			c = DateRange.order(a.getEndDate(),b.getEndDate());
		}
		return c;
	};
	
	/**
	 * Checks if two {@link DatePeriod}s overlap.
	 * @param {DatePeriod} a
	 * @param {DatePeriod} b
	 * @return if they overlap
	 * @type Boolean
	 */
	DatePeriod.overlap = function(a,b) {
		return DateRange.order(a.getStartDate(),b.getEndDate()) < 0 && DateRange.order(b.getStartDate(),a.getEndDate()) < 0;
	};
	
	/**
	 * 
	 * @param {Object} r
	 * @return if parser result is a DatePeriod type
	 * @type Boolean
	 */
	DatePeriod.isParsedDatePeriod = function(r) {
		if (!r) {
			return false;
		}
		return r.hasOwnProperty("from") || r.hasOwnProperty("to");
	};
	
	/**
	 * 
	 * @param {Object} r result from parser
	 * @return new {@link YMD}
	 * @type DatePeriod
	 */
	DatePeriod.fromParserResult = function(r) {
		var ymdFrom = YMD.fromParserResult(r.from);
		var ymdTo = YMD.fromParserResult(r.to);
		return new DatePeriod(new DateRange(ymdFrom,ymdFrom),new DateRange(ymdTo,ymdTo));
	};
	
	/**
	 * A {@link DatePeriod} constant that represents an unknown date.
	 * @constant
	 * @type DatePeriod
	 */
	DatePeriod.UNKNOWN = new DatePeriod();
})(window.dojo);
