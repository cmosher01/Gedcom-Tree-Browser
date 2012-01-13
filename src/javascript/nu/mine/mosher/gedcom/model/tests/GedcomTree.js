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
	"../GedcomTree"],

function(
	tests,
	GedcomTree) {

	"use strict";

	var gc =
		"0 HEAD\n"+
		"1 SOUR GRO\n"+
		"2 NAME Genealogy Research Organizer\n"+
		"2 CORP Christopher Alan Mosher\n"+
		"3 ADDR 41 Brook Pine Drive\n"+
		"4 CONT Shelton, CT 06484-5912\n"+
		"1 GEDC\n"+
		"2 VERS 5.5\n"+
		"1 NOTE This tree contains th\n"+
		"2 CONC e Mosher family.\n"+
		"2 CONT\n"+
		"2 CONT The name Mosher was originally Moger.\n"+
		"\n"+
		"0 @I0@ INDI\n"+
		"1 _XY 195 30\n"+
		"1 NAME John /Moger/\n"+
		"2 SOUR @S0@\n"+
		"\n"+
		"0 @S0@ SOUR\n"+
		"1 AUTH LDS\n"+
		"1 TITL International Genealogical Index (IGI)\n"+
		"1 PUBL http://www.familysearch.org\n"+
		"\n"+
		"0 @S1@ SOUR\n"+
		"1 AUTH LDS\n"+
		"1 TITL Ancestral File\n"+
		"1 PUBL http://www.familysearch.org";

	var TREE = GedcomTree.parse(gc);


	tests.register("GedcomTree",[

	function nominalTopLevel(doh) {
		var r = TREE.getRoot().getChildren();
		doh.is("HEAD",r[0].line.getTag());
		doh.is("I0",r[1].line.getID()); doh.is("INDI",r[1].line.getTag());
		doh.is("S0",r[2].line.getID()); doh.is("SOUR",r[2].line.getTag());
		doh.is("S1",r[3].line.getID()); doh.is("SOUR",r[3].line.getTag());
	},

	function nominalLevel1(doh) {
		var rhead = TREE.getRoot().getChildren()[0].getChildren();
		doh.is("SOUR",rhead[0].line.getTag()); doh.is("GRO",rhead[0].line.getVal());
		doh.is("GEDC",rhead[1].line.getTag()); doh.is("",rhead[1].line.getVal());
	},

	function nominalCont(doh) {
		var addr = TREE.getRoot().getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0].line;
		doh.is("ADDR",addr.getTag()); doh.is("41 Brook Pine Drive\nShelton, CT 06484-5912",addr.getVal());
	},

	function nominalConcPlusCont(doh) {
		var note = TREE.getRoot().getChildren()[0].getChildren()[2].line;
		doh.is("NOTE",note.getTag()); doh.is("This tree contains the Mosher family.\n\nThe name Mosher was originally Moger.",note.getVal());
	},

	function nominalXref(doh) {
		var sour_xref = TREE.getRoot().getChildren()[1].getChildren()[1].getChildren()[0].line;
		doh.is("SOUR",sour_xref.getTag()); doh.is("S0",sour_xref.getPointer());
	}/*,

	function nominalLookUpXref(doh) {
		var s1 = TREE.getNode("S1"); NOT YET IMPLEMENTED???
		doh.is("S1",s1.line.getID());
		doh.is("Ancestral File",s1.getChildren()[1].line.getVal());
	}*/

	]);

});




//	module("GedcomTreeFile", {
//		setup: function() {
//			var qu = this;
//			$.ajaxSetup({
//				dataType: "text"
//			});
//			stop(); // wait for ged file to load (or fail)
//			$.get("lib/testged/TGC55C.ged")
//				.success(function(gc) {
//					qu.gtree = GedcomTree.parse(gc);
//					start();
//				})
//				.error(function(s,m,e) {
//					qu.gtree = null;
//					ok(false,"Error reading file "+this.url+": "+e);
//					start();
//				});
//		}
//	});
//
//	test("nominal read", function() {
//		if (this.gtree === null) {
//			return;
//		}
//		var subm = this.gtree.getNode("SUBMISSION");
//		equal(subm.line.getID(),"SUBMISSION");
//		equal(subm.getChildren()[1].line.getTag(),"FAMF");
//	});
