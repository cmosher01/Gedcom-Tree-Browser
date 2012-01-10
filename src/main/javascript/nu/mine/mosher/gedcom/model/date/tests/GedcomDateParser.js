(function($,doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.gedcom.model.date.tests.GedcomDateParser";

	$.provide(SUITE);

	$.require("nu.mine.mosher.gedcom.model.date.GedcomDateParser");
	var GedcomDateParser = nu.mine.mosher.gedcom.model.date.GedcomDateParser;

	doh.register(SUITE,[

	function nominal() {
		doh.is(GedcomDateParser.parse(
			"3 JUL 1966"),
			{year:1966,month:7,day:3});
	},

	function nominalRange() {
		doh.is(GedcomDateParser.parse(
			"BET 3 JUL 1966 AND 3 AUG 1966"), 
			{after:{year:1966,month:7,day:3},before:{year:1966,month:8,day:3}});
	},

	function nominalPeriod() {
		doh.is(GedcomDateParser.parse(
			"FROM 3 JUL 1966 TO 3 AUG 1966"), 
			{from:{year:1966,month:7,day:3},to:{year:1966,month:8,day:3}});
	},

	function nominalCirca() {
		doh.is(GedcomDateParser.parse(
			"ABT 1400"), 
			{year:1400,month:0,day:0,approx:true});
	},

	function nominalOnlyYear() {
		doh.is(GedcomDateParser.parse(
			"1492"), 
			{year:1492,month:0,day:0});
	},

	function nominalOnlyMonthAndYear() {
		doh.is(GedcomDateParser.parse(
			"DEC 1941"), 
			{year:1941,month:12,day:0});
	},

	function nominalInterpreted() {
		doh.is(GedcomDateParser.parse(
			"INT 31 MAR 1850     (Easter 1850)"), 
			{year:1850,month:3,day:31});
	},

	function nominalBCE() {
		doh.is(GedcomDateParser.parse(
			"32 BC"), 
			{year:-32,month:0,day:0});
	},

	function nominalAD() {
		doh.is(GedcomDateParser.parse(
			"1860 AD"), 
			{year:1860,month:0,day:0});
	},

	function nominalOS() {
		doh.is(GedcomDateParser.parse(
			"@#DJULIAN@ 11 FEB 1731/2"), 
			{year:1732,month:2,day:11,julian:true});
	},

	function leadingZero() {
		doh.is(GedcomDateParser.parse(
			"09 DEC 2000"),
			{year:2000,month:12,day:9});
	},

	function zeroYear() {
		doh.e(Error,null,"nu.mine.mosher.gedcom.model.date.GedcomDateParser.parse",["1 JAN 0"]);
	},

	function unknownCalendar() {
		doh.is(GedcomDateParser.parse(
			"@#DNEPALI@ 25 FALGUN 2067"),
			"NEPALI: 25 FALGUN 2067");
	},

	function onlyDayAndMonth() {
		doh.e(Error,null,"nu.mine.mosher.gedcom.model.date.GedcomDateParser.parse",["25 JUL"]);
	},

	function unlabeledDateWithSlashedYearDetectedAsJulian() {
		doh.is(GedcomDateParser.parse(
			"11 FEB 1731/2"), 
			{year:1732,month:2,day:11,julian:true});
	},

	function slashedYearCannotBeGregorian() {
		doh.e(Error,null,"nu.mine.mosher.gedcom.model.date.GedcomDateParser.parse",["@#DGREGORIAN@ 11 FEB 1731/2"]);
	},

	function omittedSpaceAfterCalendarEscapeIsOK() {
		doh.is(GedcomDateParser.parse(
			"@#DGREGORIAN@2 FEB 2222"), 
			{year:2222,month:2,day:2});
	},

	function nominalHebrew() {
		doh.is(GedcomDateParser.parse(
			"@#DHEBREW@ 1 TSH 5771"), 
			{year:5771,month:7,day:1,hebrew:true});
	}

	]);

})(window.dojo,window.doh);
