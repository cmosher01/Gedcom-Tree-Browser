(function($,doh) {
	"use strict";

	$.provide("nu.mine.mosher.gedcom.model.tests.tests");

	try {
		$.require("nu.mine.mosher.gedcom.model.tests.GedcomLine");
		$.require("nu.mine.mosher.gedcom.model.tests.GedcomTree");
	} catch(e) {
		doh.debug(e);
	}

})(window.dojo, window.doh);
