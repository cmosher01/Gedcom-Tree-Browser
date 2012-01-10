(function($,doh) {
	"use strict";

	$.provide("nu.mine.mosher.gfx.tests.tests");

	try {
		$.require("nu.mine.mosher.gfx.tests.Point");
		$.require("nu.mine.mosher.gfx.tests.Size");
		//$.require("nu.mine.mosher.gfx.tests.Rect");
	} catch(e) {
		doh.debug(e);
	}

})(window.dojo, window.doh);
