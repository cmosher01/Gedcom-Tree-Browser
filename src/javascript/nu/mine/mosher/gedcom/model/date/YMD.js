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
 * Defines the {@link YMD} (year/month/day) class.
 */

/**
 * @class
 * Represents a date, specified as a year, month, and day, allowing
 * for unknown month and/or day. An unknown day or month is specified as zero.
 * @requires Util
 * 
 * @constructor
 * @param {Number} y year -9999 to -1 (for BC), or 1 to 9999 (for AD)
 * @param {Number} m month 1-12 (0 or omitted means unknown)
 * @param {Number} d day 1-31 (0 or omitted means unknown)
 * @param {Boolean} circa
 * @param {Boolean} julian
 * @return new {@link YMD}
 * @type YMD
 */
define(["dojo/_base/declare","./Calendar","nu/mine/mosher/util/Util"],
function(declare,Calendar,Util) {

	"use strict";

	var YMD = declare(null, {

		constructor: function(y,m,d,circa,julian) {

			/**
			 * year (-9999 to -1, or 1 to 9999)
			 * @private
			 * @type Number
			 */
			this.year = parseInt(y,10);
			if (this.year <= -10000 || this.year == 0 || 10000 <= this.year) {
				throw new Error("invalid year: "+this.year);
			}
		
			/**
			 * month (1 = Jan) (0 = unknown)
			 * @private
			 * @type Number
			 */
			this.month = !m ? 0 : parseInt(m,10);
			if (this.month < 0 || 12 < this.month) {
				throw new Error("invalid month: "+this.month);
			}
		
			/**
			 * day of month (1-31) (0 = unknown)
			 * @private
			 * @type Number
			 */
			this.day = !d ? 0 : parseInt(d,10);
			if (this.day < 0 || 31 < this.day) {
				throw new Error("invalid day: "+this.day);
			}
		
			/**
			 * if this date is an approximation
			 * @private
			 * @type Boolean
			 */
			this.circa = !!circa;
		
			/**
			 * if this date SHOULD be DISPLAYED in Julian Calendar
			 * @private
			 * @type Boolean
			 */
			this.julian = !!julian;
		
			/**
			 * @private
			 * @type Date
			 */
			this.approx = this.calcApprox();
		},
		
		/**
		 * Gets the day
		 * @return the day, or zero if unknown
		 * @type Number
		 */
		getDay: function() {
		    return this.day;
		},
		
		/**
		 * Gets the month
		 * @return the month (1 means January), or zero if unknown
		 * @type Number
		 */
		getMonth: function() {
		    return this.month;
		},
		
		/**
		 * Gets the year
		 * @return the year, or zero if unknown. (negative means BC)
		 * @type Number
		 */
		getYear: function() {
		    return this.year;
		},
		
		/**
		 * @return if this date should be show using the Julian calendar
		 * (if so, the caller is responsible for converting it).
		 * @type Boolean
		 */
		isJulian: function() {
			return this.julian;
		},
		
		/**
		 * @return if this is an approximate date
		 * @type Boolean
		 */
		isCirca: function() {
			return this.circa;
		},
		
		/**
		 * Gets the exact <code>Date</code> represented by this {@link YMD},
		 * assuming it is exact. Throws otherwise.
		 * @return the <code>Date</code> representing this exact {@link YMD} (at noon, local time).
		 * @type Date
		 * @throws if this {@link YMD} is missing day or month
		 */
		getExactDate: function() {
			if (!this.isExact()) {
				throw new Error("missing month or day on date that was presumed to be exact");
			}
		
			return this.approx;
		},
		
		/**
		 * Gets a <code>Date</code> that can be used as an approximation
		 * of this {@link YMD} for computation purposes.
		 * Never display this value to the user!
		 * @return an approximate <code>Date</code> for this {@link YMD}
		 * @type Date
		 */
		getApproxDate: function() {
			return this.approx;
		},
		
		/**
		 * Gets if this {@link YMD} is exact.
		 * @return <code>true</code> if exact
		 * @type Boolean
		 */
		isExact: function() {
			return YMD.valid(this.month) && YMD.valid(this.day);
		},
		
		/**
		 * @return date in yyyy-mm-dd format
		 * @type String
		 */
		toString: function() {
			var s;
			s = "";
		
			if (this.circa) {
				s += "c. ";
			}
		
			if (this.year == 9999 || this.year == -9999) {
				if (YMD.equal(this,YMD.getMaximum())) {
					return "[after]";
				}
				if (YMD.equal(this,YMD.getMinimum())) {
					return "[before]";
				}
			}
			s += Util.digint(this.year,4);
			if (this.month > 0) {
				s += "-"+Util.digint(this.month,2);
				if (this.day > 0) {
					s += "-"+Util.digint(this.day,2);
				}
			}
			return s;
		},
		
		/**
		 * Approximate date. Never display this to the user; only use
		 * it for approximation in calculations (for example, for sorting).
		 * @private
		 * @return approximate date (useful if month or day are unknown)
		 * @type Date
		 */
		calcApprox: function() {
			var dt;
			var m = this.month;
			var d = this.day;
		
			// if month and day are missing, assume mid-year (July 3).
			if (m == 0 && d == 0) {
				m = 7;
				d = 3;
			}
			// if just day is missing, assume mid-month (the 15th).
			else if (d == 0) {
				d = 15;
			}
		
			dt = new Date(0);
			dt.setUTCFullYear(this.year);
			dt.setUTCMonth(m-1);
			dt.setUTCDate(d);
			return dt;
		}
	});
		
	/**
	 * Returns a new {@link YMD} representing January 1, 9999 BC.
	 * @return Jan. 1, 9999 BC
	 * @type YMD
	 */
	YMD.getMinimum = function() {
		return new YMD(-9999,1,1);
	};
	
	/**
	 * Returns a new {@link YMD} representing December 31, AD 9999.
	 * @return Dec. 31, AD 9999
	 * @type YMD
	 */
	YMD.getMaximum = function() {
		return new YMD(9999,12,31);
	};
	
	
	
	/**
	 * @private
	 * @param {Number} i
	 * @return if given number is not zero (not unknown)
	 * @type Boolean
	 */
	YMD.valid = function(i) {
		return i != 0;
	};
	
	/**
	 * Checks two {@link YMD}s for equality.
	 * @param {YMD} a not null/undefined
	 * @param {YMD} b not null/undefined
	 * @return if a and b are equal
	 * @type Boolean
	 */
	YMD.equal = function(a,b) {
		return a.year==b.year && a.month==b.month && a.day==b.day;
	};
	
	
	/**
	 * Compares two {@link YMD}s, for sorting.
	 * @param {YMD} a not null/undefined
	 * @param {YMD} b not null/undefined
	 * @return -1:a&lt;b, 0:a=b, +1:a&gt;b
	 * @type Number
	 */
	YMD.order = function(a,b) {
		return Util.dateOrder(a.getApproxDate(),b.getApproxDate());
	};
	
	/**
	 * 
	 * @param {Object} r
	 * @return if parser result is a YMD type
	 * @type Boolean
	 */
	YMD.isParsedYMD = function(r) {
		if (!r) {
			return false;
		}
		return r.hasOwnProperty("year") && r.hasOwnProperty("month") && r.hasOwnProperty("day");
	};
	
	/**
	 * 
	 * @param {Object} r result from parser
	 * @return new {@link YMD} (or null if !r)
	 * @type YMD
	 */
	YMD.fromParserResult = function(r) {
		if (!r) {
			return null;
		}
		if (r.julian) {
			return Calendar.jd_to_gregorian(Calendar.julian_to_jd(new YMD(r.year,r.month,r.day)));
		}
		if (r.hebrew) {
			return Calendar.jd_to_gregorian(Calendar.hebrew_to_jd(new YMD(r.year,r.month,r.day)));
		}
		if (r.french) {
			return Calendar.jd_to_gregorian(Calendar.french_revolutionary_to_jd(new YMD(r.year,r.month,r.day)));
		}
		return new YMD(r.year,r.month,r.day,r.approx,r.julian);
	};

	return YMD;
});
