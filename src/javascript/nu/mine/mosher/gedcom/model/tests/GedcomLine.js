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
	"../GedcomLine"],

function(
	tests,
	GedcomLine) {

	"use strict";

	tests.register("GedcomLine",[

	function asPointerNominal(doh) {
		doh.is("abc",GedcomLine.asPointer("@abc@"));
	},

	function asPointerNominalFalse(doh) {
		doh.is("",GedcomLine.asPointer("abc"));
	},

	function asPointerNominalFalseBeginAt(doh) {
		doh.is("",GedcomLine.asPointer("@abc"));
	},

	function asPointerNominalFalseEndAt(doh) {
		doh.is("",GedcomLine.asPointer("abc@"));
	},

	function asPointerNominalFalseMidAt(doh) {
		doh.is("",GedcomLine.asPointer("@ab@c@"));
	},

	function asPointerOneAt(doh) {
		doh.is("",GedcomLine.asPointer("@"));
	},

	function asPointerTwoAts(doh) {
		doh.is("",GedcomLine.asPointer("@@"));
	},

	function asPointerThreeAts(doh) {
		doh.is("",GedcomLine.asPointer("@@@"));
	},

	function asPointerFourAts(doh) {
		doh.is("",GedcomLine.asPointer("@@@@"));
	},

	function asPointerEmptyString(doh) {
		doh.is("",GedcomLine.asPointer(""));
	},

	function asPointerLeadingSpace(doh) {
		doh.is("",GedcomLine.asPointer(" @abc@"));
	},

	function asPointerTrailingSpace(doh) {
		doh.is("",GedcomLine.asPointer("@abc@ "));
	},

	function asPointerNull(doh) {
		doh.is("",GedcomLine.asPointer(null));
	},

	function asPointerNoArgs(doh) {
		doh.is("",GedcomLine.asPointer());
	},

	function replaceNominal(doh) {
		doh.is("abc@def",GedcomLine.replaceAts("abc@@def"));
	},

	function replaceNominalGlobal(doh) {
		doh.is("abc@def@ghi",GedcomLine.replaceAts("abc@@def@@ghi"));
	},

	function replaceNoOp(doh) {
		doh.is("abcdef",GedcomLine.replaceAts("abcdef"));
	},

	function replaceSingleAt(doh) {
		doh.is("abc@def",GedcomLine.replaceAts("abc@def"));
	},

	function replaceThreeAts(doh) {
		doh.is("abc@@def",GedcomLine.replaceAts("abc@@@def"));
	},

	function replaceEmptyString(doh) {
		doh.is("",GedcomLine.replaceAts(""));
	},

	function replaceNull(doh) {
		doh.is(null,GedcomLine.replaceAts(null));
	},

	function replaceUndefined(doh) {
		doh.is(undefined,GedcomLine.replaceAts());
	},

	function replaceBadType0(doh) {
		doh.is(0,GedcomLine.replaceAts(0));
	},

	function replaceBadType1(doh) {
		doh.is(1,GedcomLine.replaceAts(1));
	},

	function replaceBadTypeObj(doh) {
		var obj = {};
		doh.is(obj,GedcomLine.replaceAts(obj));
	},

	function replaceBadTypeTrue(doh) {
		doh.is(true,GedcomLine.replaceAts(true));
	},

	function replaceBadTypeFalse(doh) {
		doh.is(false,GedcomLine.replaceAts(false));
	},

	function nominalNoValue(doh) {
		var g = new GedcomLine(0, undefined, "HEAD", "");
		doh.is(0,g.getLevel());
		doh.is("",g.getID());
		doh.is("HEAD",g.getTag());
		doh.is("",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalObject(doh) {
		var g = new GedcomLine(1, undefined, "SOUR", "GRO");
		doh.is(1,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is("GRO",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalObjectWithID(doh) {
		var g = new GedcomLine(0, "@I0@", "INDI", "");
		doh.is(0,g.getLevel());
		doh.is("I0",g.getID());
		doh.is("INDI",g.getTag());
		doh.is("",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalObjectWithIDAndValueWithAts(doh) {
		var g = new GedcomLine(0, "@T7@", "NOTE", "This is the text @@ the note.");
		doh.is(0,g.getLevel());
		doh.is("T7",g.getID());
		doh.is("NOTE",g.getTag());
		doh.is("This is the text @ the note.",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalObjectWithPointerValue(doh) {
		var g = new GedcomLine(2, "", "SOUR", "@S0@");
		doh.is(2,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is("",g.getVal());
		doh.is("S0",g.getPointer());
		doh.f(g.hasID());
		doh.t(g.isPointer());
	},

	function nominalConc(doh) {
		var g = new GedcomLine(0, "@T7@", "NOTE", "This is a lon");
		var c = new GedcomLine(1, "", "CONC", "g note split @@ conc.");
		g.concat(c);
		doh.is(0,g.getLevel());
		doh.is("T7",g.getID());
		doh.is("NOTE",g.getTag());
		doh.is("This is a long note split @ conc.",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalCont(doh) {
		var g = new GedcomLine(0, "@T7@", "NOTE", "This is a note.");
		var c = new GedcomLine(1, "", "CONT", "It is split @@ cont.");
		g.concat(c);
		doh.is(0,g.getLevel());
		doh.is("T7",g.getID());
		doh.is("NOTE",g.getTag());
		doh.is("This is a note.\nIt is split @ cont.",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalNoValue(doh) {
		var g = GedcomLine.parse("0 HEAD");
		doh.is(0,g.getLevel());
		doh.is("",g.getID());
		doh.is("HEAD",g.getTag());
		doh.is("",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalObject(doh) {
		var g = GedcomLine.parse("1 SOUR GRO");
		doh.is(1,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is("GRO",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalObjectWithID(doh) {
		var g = GedcomLine.parse("0 @I0@ INDI");
		doh.is(0,g.getLevel());
		doh.is("I0",g.getID());
		doh.is("INDI",g.getTag());
		doh.is("",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalObjectWithIDAndValueWithAts(doh) {
		var g = GedcomLine.parse("0 @T7@ NOTE This is the text @@ the note.");
		doh.is(0,g.getLevel());
		doh.is("T7",g.getID());
		doh.is("NOTE",g.getTag());
		doh.is("This is the text @ the note.",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalObjectWithPointerValue(doh) {
		var g = GedcomLine.parse("2 SOUR @S0@");
		doh.is(2,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is("",g.getVal());
		doh.is("S0",g.getPointer());
		doh.f(g.hasID());
		doh.t(g.isPointer());
	},

	function parseOnlySkipsOneSpace(doh) {
		var g = GedcomLine.parse("1 SOUR  GRO");
		doh.is(1,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is(" GRO",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	}

	]);

});
