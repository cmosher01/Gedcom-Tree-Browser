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
(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gedcom.model.date.Calendar";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gedcom.model.date.YMD");
	var YMD = nu.mine.mosher.gedcom.model.date.YMD;
	$.require("nu.mine.mosher.extern.ch.fourmilab.calendar.calendar");
	var cal = nu.mine.mosher.extern.ch.fourmilab.calendar.calendar;

	var Calendar = $.declare(CLASS, null, {

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
})(window.dojo);
