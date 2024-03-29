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

define([
	"doh/runner",
	"nu/mine/mosher/extern/ch/fourmilab/calendar/calendar",
	"../Calendar",
	"../YMD",],

function(
	tests,
	cal,
	Calendar,
	YMD) {

	"use strict";

	tests.register("Calendar",[

	function nominalGeorgeWashingtonsBirthdayJulianToGregorian(doh) {
		var ymdJulian;
		var ymdGregorian;
		ymdJulian = new YMD(1732,2,11,false,true);
		var r = cal.jd_to_gregorian(Calendar.julian_to_jd(ymdJulian));
		ymdGregorian = new YMD(r[0],r[1],r[2]);
		doh.is(new YMD(1732,2,22,false,false),ymdGregorian);
	},

	function nominalGregorianToJulian(doh) {
		var ymdGregorian;
		var ymdJulian;
		ymdGregorian = new YMD(1752,9,14,false,false);
		var r = cal.jd_to_julian(Calendar.gregorian_to_jd(ymdGregorian));
	  ymdJulian = new YMD(r[0],r[1],r[2],false,true);
		doh.is(new YMD(1752,9,3,false,true),ymdJulian);
	},

	function nominalHebrewToGregorian(doh) {
		var ymdHebrew;
		var ymdGregorian;
		ymdHebrew = new YMD(5771,7,1);
		var r = cal.jd_to_gregorian(Calendar.hebrew_to_jd(ymdHebrew));
		ymdGregorian = new YMD(r[0],r[1],r[2]);
		doh.is(new YMD(2010,9,9),ymdGregorian);
	},

	function nominalGregorianToHebrew(doh) {
		var ymdGregorian;
		var ymdHebrew;
		ymdGregorian = new YMD(2010,9,9);
		var r = cal.jd_to_hebrew(Calendar.gregorian_to_jd(ymdGregorian));
	  ymdHebrew = new YMD(r[0],r[1],r[2],false,false,true);
		doh.is(new YMD(5771,7,1),ymdHebrew);
	},

	function nominalFrenchRevToGregorian(doh) {
		var ymdFrench;
		var ymdGregorian;
		ymdFrench = new YMD(2,11,9);
		var r = cal.jd_to_gregorian(Calendar.french_revolutionary_to_jd(ymdFrench));
		ymdGregorian = new YMD(r[0],r[1],r[2]);
		doh.is(new YMD(1794,7,27),ymdGregorian);
	},

	function nominalGregorianToFrenchRev(doh) {
		var ymdGregorian;
		var ymdFrench;
		var r, d, dec, jou;
		ymdGregorian = new YMD(1794,7,27);
		r= cal.jd_to_french_revolutionary(Calendar.gregorian_to_jd(ymdGregorian));
		dec = r[2];
		jou = r[3];
		d = (dec-1)*10+jou;
	  ymdFrench = new YMD(r[0],r[1],d,false,false,false,true);
		doh.is(new YMD(2,11,9),ymdFrench);
	}

	]);

});
