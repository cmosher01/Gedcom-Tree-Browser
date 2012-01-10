(function($,doh) {
	"use strict";

	$.provide("nu.mine.mosher.util.tests.tests");

	try {
		$.require("nu.mine.mosher.util.tests.Util");
		$.require("nu.mine.mosher.util.tests.TreeNode");
	} catch(e) {
		doh.debug(e);
	}

})(window.dojo, window.doh);
