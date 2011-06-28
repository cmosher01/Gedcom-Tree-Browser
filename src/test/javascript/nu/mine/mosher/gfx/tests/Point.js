(function($, doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.gfx.tests.Point";

	$.provide(SUITE);

	$.require("nu.mine.mosher.gfx.Point");
	var Point = nu.mine.mosher.gfx.Point;

	doh.register(SUITE, [

		function nominal() {
			var pt;
			pt = new Point(77,99);
			doh.is(77,pt.getX());
			doh.is(99,pt.getY());
		}

	]);

})(window.dojo, window.doh);
