(function($,doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.gedcom.model.tests.GedcomLine";

	$.provide(SUITE);

	$.require("nu.mine.mosher.gedcom.model.GedcomLine");
	var GedcomLine = nu.mine.mosher.gedcom.model.GedcomLine;

	doh.register(SUITE,[

	function asPointerNominal() {
		doh.is("abc",GedcomLine.asPointer("@abc@"));
	},

	function asPointerNominalFalse() {
		doh.is("",GedcomLine.asPointer("abc"));
	},

	function asPointerNominalFalseBeginAt() {
		doh.is("",GedcomLine.asPointer("@abc"));
	},

	function asPointerNominalFalseEndAt() {
		doh.is("",GedcomLine.asPointer("abc@"));
	},

	function asPointerNominalFalseMidAt() {
		doh.is("",GedcomLine.asPointer("@ab@c@"));
	},

	function asPointerOneAt() {
		doh.is("",GedcomLine.asPointer("@"));
	},

	function asPointerTwoAts() {
		doh.is("",GedcomLine.asPointer("@@"));
	},

	function asPointerThreeAts() {
		doh.is("",GedcomLine.asPointer("@@@"));
	},

	function asPointerFourAts() {
		doh.is("",GedcomLine.asPointer("@@@@"));
	},

	function asPointerEmptyString() {
		doh.is("",GedcomLine.asPointer(""));
	},

	function asPointerLeadingSpace() {
		doh.is("",GedcomLine.asPointer(" @abc@"));
	},

	function asPointerTrailingSpace() {
		doh.is("",GedcomLine.asPointer("@abc@ "));
	},

	function asPointerNull() {
		doh.is("",GedcomLine.asPointer(null));
	},

	function asPointerNoArgs() {
		doh.is("",GedcomLine.asPointer());
	},

	function replaceNominal() {
		doh.is("abc@def",GedcomLine.replaceAts("abc@@def"));
	},

	function replaceNominalGlobal() {
		doh.is("abc@def@ghi",GedcomLine.replaceAts("abc@@def@@ghi"));
	},

	function replaceNoOp() {
		doh.is("abcdef",GedcomLine.replaceAts("abcdef"));
	},

	function replaceSingleAt() {
		doh.is("abc@def",GedcomLine.replaceAts("abc@def"));
	},

	function replaceThreeAts() {
		doh.is("abc@@def",GedcomLine.replaceAts("abc@@@def"));
	},

	function replaceEmptyString() {
		doh.is("",GedcomLine.replaceAts(""));
	},

	function replaceNull() {
		doh.is(null,GedcomLine.replaceAts(null));
	},

	function replaceUndefined() {
		doh.is(undefined,GedcomLine.replaceAts());
	},

	function replaceBadType0() {
		doh.is(0,GedcomLine.replaceAts(0));
	},

	function replaceBadType1() {
		doh.is(1,GedcomLine.replaceAts(1));
	},

	function replaceBadTypeObj() {
		var obj = {};
		doh.is(obj,GedcomLine.replaceAts(obj));
	},

	function replaceBadTypeTrue() {
		doh.is(true,GedcomLine.replaceAts(true));
	},

	function replaceBadTypeFalse() {
		doh.is(false,GedcomLine.replaceAts(false));
	},

	function nominalNoValue() {
		var g = new GedcomLine(0, undefined, "HEAD", "");
		doh.is(0,g.getLevel());
		doh.is("",g.getID());
		doh.is("HEAD",g.getTag());
		doh.is("",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalObject() {
		var g = new GedcomLine(1, undefined, "SOUR", "GRO");
		doh.is(1,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is("GRO",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalObjectWithID() {
		var g = new GedcomLine(0, "@I0@", "INDI", "");
		doh.is(0,g.getLevel());
		doh.is("I0",g.getID());
		doh.is("INDI",g.getTag());
		doh.is("",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalObjectWithIDAndValueWithAts() {
		var g = new GedcomLine(0, "@T7@", "NOTE", "This is the text @@ the note.");
		doh.is(0,g.getLevel());
		doh.is("T7",g.getID());
		doh.is("NOTE",g.getTag());
		doh.is("This is the text @ the note.",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function nominalObjectWithPointerValue() {
		var g = new GedcomLine(2, "", "SOUR", "@S0@");
		doh.is(2,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is("",g.getVal());
		doh.is("S0",g.getPointer());
		doh.f(g.hasID());
		doh.t(g.isPointer());
	},

	function nominalConc() {
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

	function nominalCont() {
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

	function parseNominalNoValue() {
		var g = GedcomLine.parse("0 HEAD");
		doh.is(0,g.getLevel());
		doh.is("",g.getID());
		doh.is("HEAD",g.getTag());
		doh.is("",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalObject() {
		var g = GedcomLine.parse("1 SOUR GRO");
		doh.is(1,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is("GRO",g.getVal());
		doh.is("",g.getPointer());
		doh.f(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalObjectWithID() {
		var g = GedcomLine.parse("0 @I0@ INDI");
		doh.is(0,g.getLevel());
		doh.is("I0",g.getID());
		doh.is("INDI",g.getTag());
		doh.is("",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalObjectWithIDAndValueWithAts() {
		var g = GedcomLine.parse("0 @T7@ NOTE This is the text @@ the note.");
		doh.is(0,g.getLevel());
		doh.is("T7",g.getID());
		doh.is("NOTE",g.getTag());
		doh.is("This is the text @ the note.",g.getVal());
		doh.is("",g.getPointer());
		doh.t(g.hasID());
		doh.f(g.isPointer());
	},

	function parseNominalObjectWithPointerValue() {
		var g = GedcomLine.parse("2 SOUR @S0@");
		doh.is(2,g.getLevel());
		doh.is("",g.getID());
		doh.is("SOUR",g.getTag());
		doh.is("",g.getVal());
		doh.is("S0",g.getPointer());
		doh.f(g.hasID());
		doh.t(g.isPointer());
	},

	function parseOnlySkipsOneSpace() {
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

})(window.dojo,window.doh);
