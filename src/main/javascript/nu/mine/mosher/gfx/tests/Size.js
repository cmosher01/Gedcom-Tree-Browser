(function($, doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.gfx.tests.Size";

	$.provide(SUITE);

	$.require("nu.mine.mosher.gfx.Size");
	var Size = nu.mine.mosher.gfx.Size;

	doh.register(SUITE, [

		function nominal() {
			var s;
			s = new Size(23, 45);
			doh.is(s.getWidth(), 23);
			doh.is(s.getHeight(), 45);
		}

	]);

})(window.dojo, window.doh);
