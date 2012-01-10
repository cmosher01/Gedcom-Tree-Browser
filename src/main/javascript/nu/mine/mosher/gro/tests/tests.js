(function($,doh) {
	"use strict";

	$.provide("nu.mine.mosher.gro.tests.tests");

	try {
		$.require("nu.mine.mosher.gro.tests.Person");
		$.require("nu.mine.mosher.gro.tests.Partnership");
		$.require("nu.mine.mosher.gro.tests.GedcomExtractor");
	} catch(e) {
		doh.debug(e);
	}

})(window.dojo, window.doh);
