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
	"../GedcomDateParser"],

function(
	tests,
	GedcomDateParser) {

	"use strict";

	tests.register("GedcomDateParser",[

	function nominal(doh) {
		doh.is(GedcomDateParser.parse(
			"3 JUL 1966"),
			{year:1966,month:7,day:3});
	},

	function nominalRange(doh) {
		doh.is(GedcomDateParser.parse(
			"BET 3 JUL 1966 AND 3 AUG 1966"), 
			{after:{year:1966,month:7,day:3},before:{year:1966,month:8,day:3}});
	},

	function nominalPeriod(doh) {
		doh.is(GedcomDateParser.parse(
			"FROM 3 JUL 1966 TO 3 AUG 1966"), 
			{from:{year:1966,month:7,day:3},to:{year:1966,month:8,day:3}});
	},

	function nominalCirca(doh) {
		doh.is(GedcomDateParser.parse(
			"ABT 1400"), 
			{year:1400,month:0,day:0,approx:true});
	},

	function nominalOnlyYear(doh) {
		doh.is(GedcomDateParser.parse(
			"1492"), 
			{year:1492,month:0,day:0});
	},

	function nominalOnlyMonthAndYear(doh) {
		doh.is(GedcomDateParser.parse(
			"DEC 1941"), 
			{year:1941,month:12,day:0});
	},

	function nominalInterpreted(doh) {
		doh.is(GedcomDateParser.parse(
			"INT 31 MAR 1850     (Easter 1850)"), 
			{year:1850,month:3,day:31});
	},

	function nominalBCE(doh) {
		doh.is(GedcomDateParser.parse(
			"32 BC"), 
			{year:-32,month:0,day:0});
	},

	function nominalAD(doh) {
		doh.is(GedcomDateParser.parse(
			"1860 AD"), 
			{year:1860,month:0,day:0});
	},

	function nominalOS(doh) {
		doh.is(GedcomDateParser.parse(
			"@#DJULIAN@ 11 FEB 1731/2"), 
			{year:1732,month:2,day:11,julian:true});
	},

	function leadingZero(doh) {
		doh.is(GedcomDateParser.parse(
			"09 DEC 2000"),
			{year:2000,month:12,day:9});
	},

	function zeroYear(doh) {
		doh.e(Error,null,"nu.mine.mosher.gedcom.model.date.GedcomDateParser.parse",["1 JAN 0"]);
	},

	function unknownCalendar(doh) {
		doh.is(GedcomDateParser.parse(
			"@#DNEPALI@ 25 FALGUN 2067"),
			"NEPALI: 25 FALGUN 2067");
	},

	function onlyDayAndMonth(doh) {
		doh.e(Error,null,"nu.mine.mosher.gedcom.model.date.GedcomDateParser.parse",["25 JUL"]);
	},

	function unlabeledDateWithSlashedYearDetectedAsJulian(doh) {
		doh.is(GedcomDateParser.parse(
			"11 FEB 1731/2"), 
			{year:1732,month:2,day:11,julian:true});
	},

	function slashedYearCannotBeGregorian(doh) {
		doh.e(Error,null,"nu.mine.mosher.gedcom.model.date.GedcomDateParser.parse",["@#DGREGORIAN@ 11 FEB 1731/2"]);
	},

	function omittedSpaceAfterCalendarEscapeIsOK(doh) {
		doh.is(GedcomDateParser.parse(
			"@#DGREGORIAN@2 FEB 2222"), 
			{year:2222,month:2,day:2});
	},

	function nominalHebrew(doh) {
		doh.is(GedcomDateParser.parse(
			"@#DHEBREW@ 1 TSH 5771"), 
			{year:5771,month:7,day:1,hebrew:true});
	}

	]);

});
