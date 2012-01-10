(function($,doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.gedcom.model.date.tests.YMD";

	$.provide(SUITE);

	$.require("nu.mine.mosher.gedcom.model.date.YMD");
	var YMD = nu.mine.mosher.gedcom.model.date.YMD;

	doh.register(SUITE,[

		function nominal() {
			var ymd;
			ymd = new YMD(1966,7,3);
			doh.is(ymd.getYear(),1966);
			doh.is(ymd.getMonth(),7);
			doh.is(ymd.getDay(),3);
			doh.t(ymd.isExact());
		},
		
		function unknownDay() {
			var ymd;
			ymd = new YMD(1966,7);
			doh.is(ymd.getYear(),1966);
			doh.is(ymd.getMonth(),7);
			doh.is(ymd.getDay(),0);
			doh.t(!ymd.isExact());
		},
		
		function nominalToString() {
			var ymd;
			ymd = new YMD(1966,7,3);
			doh.is(""+ymd,"1966-07-03");
		},
		
		function nominalAsDate() {
			var ymd, d;
			ymd = new YMD(1966,7,3);
			d = ymd.getExactDate();
			doh.is(d.toUTCString(),"Sun, 03 Jul 1966 00:00:00 GMT");
		}
	]);

})(window.dojo,window.doh);
