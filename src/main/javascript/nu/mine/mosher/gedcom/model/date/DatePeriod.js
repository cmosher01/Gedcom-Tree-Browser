/*
 * @licstart  The following is the entire license notice for the JavaScript code in this page.
 *
 * Copyright (C) 2012, by Christopher Alan Mosher, Shelton, CT.
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice for the JavaScript code in this page.
 */

/**
 * @fileoverview
 * Defines the {@link DatePeriod} class.
 */

define(["dojo/_base/declare","nu/mine/mosher/util/Util","./YMD","./DateRange"],
function(declare,Util,YMD,DateRange) {

	"use strict";

	var DatePeriod = declare(null, {

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

	return DatePeriod;

});
