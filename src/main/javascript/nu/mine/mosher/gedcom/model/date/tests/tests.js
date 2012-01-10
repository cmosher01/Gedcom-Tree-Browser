(function($,doh) {
	"use strict";

	$.provide("nu.mine.mosher.gedcom.model.date.tests.tests");

	try {
		$.require("nu.mine.mosher.gedcom.model.date.tests.Calendar");
		$.require("nu.mine.mosher.gedcom.model.date.tests.YMD");
		$.require("nu.mine.mosher.gedcom.model.date.tests.GedcomDateParser");
	} catch(e) {
		doh.debug(e);
	}

})(window.dojo, window.doh);
