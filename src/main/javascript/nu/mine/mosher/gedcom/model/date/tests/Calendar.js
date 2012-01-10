(function($,doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.gedcom.model.date.tests.Calendar";

	$.provide(SUITE);

	$.require("nu.mine.mosher.gedcom.model.date.Calendar");
	var Calendar = nu.mine.mosher.gedcom.model.date.Calendar;
	$.require("nu.mine.mosher.gedcom.model.date.YMD");
	var YMD = nu.mine.mosher.gedcom.model.date.YMD;

	doh.register(SUITE,[

	function nominalGeorgeWashingtonsBirthdayJulianToGregorian() {
		var ymdJulian;
		var ymdGregorian;
		ymdJulian = new YMD(1732,2,11,false,true);
		ymdGregorian = Calendar.jd_to_gregorian(Calendar.julian_to_jd(ymdJulian));

		doh.is(new YMD(1732,2,22,false,false),ymdGregorian);
	},

	function nominalGregorianToJulian() {
		var ymdGregorian;
		var ymdJulian;
		ymdGregorian = new YMD(1752,9,14,false,false);
		ymdJulian = Calendar.jd_to_julian(Calendar.gregorian_to_jd(ymdGregorian));

		doh.is(new YMD(1752,9,3,false,true),ymdJulian);
	},

	function nominalHebrewToGregorian() {
		var ymdHebrew;
		var ymdGregorian;
		ymdHebrew = new YMD(5771,7,1);
		ymdGregorian = Calendar.jd_to_gregorian(Calendar.hebrew_to_jd(ymdHebrew));
		doh.is(new YMD(2010,9,9),ymdGregorian);
	},

	function nominalGregorianToHebrew() {
		var ymdGregorian;
		var ymdHebrew;
		ymdGregorian = new YMD(2010,9,9);
		ymdHebrew = Calendar.jd_to_hebrew(Calendar.gregorian_to_jd(ymdGregorian));
		doh.is(new YMD(5771,7,1),ymdHebrew);
	},

	function nominalFrenchRevToGregorian() {
		var ymdFrench;
		var ymdGregorian;
		ymdFrench = new YMD(2,11,9);
		ymdGregorian = Calendar.jd_to_gregorian(Calendar.french_revolutionary_to_jd(ymdFrench));
		doh.is(new YMD(1794,7,27),ymdGregorian);
	},

	function nominalGregorianToFrenchRev() {
		var ymdGregorian;
		var ymdFrench;
		ymdGregorian = new YMD(1794,7,27);
		ymdFrench = Calendar.jd_to_french_revolutionary(Calendar.gregorian_to_jd(ymdGregorian));
		doh.is(new YMD(2,11,9),ymdFrench);
	}
	]);

})(window.dojo,window.doh);
