(function($,doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.gedcom.model.tests.GedcomTree";

	$.provide(SUITE);

	$.require("nu.mine.mosher.gedcom.model.GedcomTree");
	var GedcomTree = nu.mine.mosher.gedcom.model.GedcomTree;

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

	doh.register(SUITE,[

	function nominalTopLevel() {
		var r = TREE.getRoot().getChildren();
		doh.is("HEAD",r[0].line.getTag());
		doh.is("I0",r[1].line.getID()); doh.is("INDI",r[1].line.getTag());
		doh.is("S0",r[2].line.getID()); doh.is("SOUR",r[2].line.getTag());
		doh.is("S1",r[3].line.getID()); doh.is("SOUR",r[3].line.getTag());
	},

	function nominalLevel1() {
		var rhead = TREE.getRoot().getChildren()[0].getChildren();
		doh.is("SOUR",rhead[0].line.getTag()); doh.is("GRO",rhead[0].line.getVal());
		doh.is("GEDC",rhead[1].line.getTag()); doh.is("",rhead[1].line.getVal());
	},

	function nominalCont() {
		var addr = TREE.getRoot().getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0].line;
		doh.is("ADDR",addr.getTag()); doh.is("41 Brook Pine Drive\nShelton, CT 06484-5912",addr.getVal());
	},

	function nominalConcPlusCont() {
		var note = TREE.getRoot().getChildren()[0].getChildren()[2].line;
		doh.is("NOTE",note.getTag()); doh.is("This tree contains the Mosher family.\n\nThe name Mosher was originally Moger.",note.getVal());
	},

	function nominalXref() {
		var sour_xref = TREE.getRoot().getChildren()[1].getChildren()[1].getChildren()[0].line;
		doh.is("SOUR",sour_xref.getTag()); doh.is("S0",sour_xref.getPointer());
	},

	function nominalLookUpXref() {
		var s1 = TREE.getNode("S1");
		doh.is("S1",s1.line.getID());
		doh.is("Ancestral File",s1.getChildren()[1].line.getVal());
	}
	]);
})(window.dojo,window.doh);




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
