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
 * Defines the {@link DateRange} class.
 */

/**
 * @class
 * Represents a range of possible dates.
 * @requires Util
 * @requires YMD
 *
 * @constructor
 * @param {YMD} earliest
 * @param {YMD} latest
 * @return new {@link DateRange}
 * @type DateRange
 */
define(["dojo/_base/declare","nu/mine/mosher/util/Util","./YMD"],
function(declare,Util,YMD) {

	"use strict";

	var DateRange = declare(null, {

		constructor: function(earliest, latest) {
			this.earliest = earliest;
			if (!this.earliest) {
				this.earliest = YMD.getMinimum();
			}

			this.latest = latest;
			if (!this.latest) {
				this.latest = YMD.getMaximum();
			}

			/**
			 * @private
			 * @type Date
			 */
			this.approx = this.calcApprox();
		},



		/**
		 * @return earliest possible date
		 * @type YMD
		 */
		getEarliest: function() {
			return this.earliest;
		},

		/**
		 * @return latest possible date
		 * @type YMD
		 */
		getLatest: function() {
			return this.latest;
		},

		/**
		 * @return if this represents an exact date
		 * @type Boolean
		 */
		isExact: function() {
			if (this.earliest === this.latest) { // optimization: same object
				return true;
			}
			return YMD.equal(this.earliest,this.latest);
		},

		/**
		 * @return an approximation of this range
		 * @type Date
		 */
		getApproxDate: function() {
			return this.approx;
		},

		/**
		 * @return date string
		 * @type String
		 */
		toString: function() {
			if (this.isExact()) {
				return this.earliest.toString();
			}
			if (DateRange.equal(this,DateRange.UNKNOWN)) {
				return "[unknown]";
			}
			return this.earliest.toString()+"?"+this.latest.toString();
		},

		/**
		 * @private
		 * @return an approximation of this range
		 * @type Date
		 */
		calcApprox: function() {
			if (YMD.equal(this.earliest,YMD.getMinimum())) {
				return this.latest.getApproxDate();
			}

			if (YMD.equal(this.latest,YMD.getMaximum())) {
				return this.earliest.getApproxDate();
			}

			/* optimization: don't bother making a new Date object if this.isExact */
			if (this.isExact()) {
				return this.earliest.getApproxDate();
			}

			return new Date((this.earliest.getApproxDate().getTime()+this.latest.getApproxDate().getTime())/2);
		}
	});

	/**
	 * Checks two {@link DateRange}s for equality.
	 * @param {DateRange} a
	 * @param {DateRange} b
	 * @return if a and b are equal
	 * @type Boolean
	 */
	DateRange.equal = function(a,b) {
		return YMD.equal(a.getEarliest(),b.getEarliest()) && YMD.equal(a.getLatest(),b.getLatest());
	};

	/**
	 * Compares two {@link DateRange}s, for sorting.
	 * @param {DateRange} a not null/undefined
	 * @param {DateRange} b not null/undefined
	 * @return negative for a&lt;b, positive for b&lt;a, zero for a=b
	 * @type Number
	 */
	DateRange.order = function(a,b) {
		return Util.dateOrder(a.getApproxDate(),b.getApproxDate());
	};

	/**
	 *
	 * @param {Object} r
	 * @return if parser result is a DateRange type
	 * @type Boolean
	 */
	DateRange.isParsedDateRange = function(r) {
		if (!r) {
			return false;
		}
		return r.hasOwnProperty("after") || r.hasOwnProperty("before");
	};

	/**
	 *
	 * @param {Object} r result from parser
	 * @return new {@link YMD}
	 * @type DateRange
	 */
	DateRange.fromParserResult = function(r) {
		return new DateRange(YMD.fromParserResult(r.after),YMD.fromParserResult(r.before));
	};

	/**
	 * A {@link DateRange} constant that represents an unknown date.
	 * @constant
	 * @type DateRange
	 */
	DateRange.UNKNOWN = new DateRange();

	return DateRange;

});
