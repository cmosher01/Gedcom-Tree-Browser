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
 * Defines the {@link Calendar} class.
 */

/**
 * @class This class is a wrapper for some of the Fourmilab calendar functions.
 * @requires YMD
 *
 * @constructor
 * @return never returns
 * @throws
 * @type Calendar
 */
define(["dojo/_base/declare","nu/mine/mosher/extern/ch/fourmilab/calendar/calendar","./YMD"],
function(declare,cal,YMD) {

	"use strict";

	var Calendar = declare(null, {
		constructor: function() {
			throw new Error("cannot instantiate");
		}
	});

	/**
	 * Converts Gregorian date to JD
	 * @param {YMD} ymd
	 * @return JD of given Gregorian date
	 * @type Number
	 */
	Calendar.gregorian_to_jd = function(ymd) {
		return cal.gregorian_to_jd(ymd.getYear(),ymd.getMonth(),ymd.getDay());
	};

	/**
	 * Converts JD to Gregorian date
	 * @param {Number} jd JD
	 * @return date in Gregorian calendar
	 * @type YMD
	 */
	Calendar.jd_to_gregorian = function(jd) {
		var r = cal.jd_to_gregorian(jd);
	    return new YMD(r[0],r[1],r[2]);
	};

	/**
	 * Converts Julian date to JD
	 * @param {YMD} ymd
	 * @return JD of given Julian date
	 * @type Number
	 */
	Calendar.julian_to_jd = function(ymd) {
		return cal.julian_to_jd(ymd.getYear(),ymd.getMonth(),ymd.getDay());
	};

	/**
	 * Converts JD to Julian date
	 * @param {Number} jd JD
	 * @return date in Julian calendar
	 * @type YMD
	 */
	Calendar.jd_to_julian = function(jd) {
		var r = cal.jd_to_julian(jd);
	    return new YMD(r[0],r[1],r[2],false,true);
	};

	/**
	 * Converts Hebrew date to JD
	 * @param {YMD} ymd
	 * @return JD of given Hebrew date
	 * @type Number
	 */
	Calendar.hebrew_to_jd = function(ymd)
	{
		return cal.hebrew_to_jd(ymd.getYear(),ymd.getMonth(),ymd.getDay());
	};

	/**
	 * Converts JD to Hebrew date
	 * @param {Number} jd JD
	 * @return date in Hebrew calendar
	 * @type YMD
	 */
	Calendar.jd_to_hebrew = function(jd)
	{
		var r = cal.jd_to_hebrew(jd);
	    return new YMD(r[0],r[1],r[2],false,false,true);
	};

	/**
	 * Converts French Revolutionary date to JD
	 * @param {YMD} ymd
	 * @return JD of given French Revolutionary date
	 * @type Number
	 */
	Calendar.french_revolutionary_to_jd = function(ymd)
	{
		var d, dec, jou;
		d = ymd.getDay()-1;
		dec = Math.floor(d/10);
		jou = d%10;
		return cal.french_revolutionary_to_jd(ymd.getYear(),ymd.getMonth(),dec+1,jou+1);
	};

	/**
	 * Converts JD to French Revolutionary date
	 * @param {Number} jd JD
	 * @return date in French Revolutionary calendar
	 * @type YMD
	 */
	Calendar.jd_to_french_revolutionary = function(jd)
	{
		var r, d, dec, jou;
		r= cal.jd_to_french_revolutionary(jd);
		dec = r[2];
		jou = r[3];
		d = (dec-1)*10+jou;
	    return new YMD(r[0],r[1],d,false,false,false,true);
	};

	return Calendar;
});
