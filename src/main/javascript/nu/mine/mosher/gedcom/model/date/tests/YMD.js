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
	"../YMD"],

function(
	tests,
	YMD) {

	"use strict";

	tests.register("YMD",[

		function nominal(doh) {
			var ymd;
			ymd = new YMD(1966,7,3);
			doh.is(ymd.getYear(),1966);
			doh.is(ymd.getMonth(),7);
			doh.is(ymd.getDay(),3);
			doh.t(ymd.isExact());
		},

		function unknownDay(doh) {
			var ymd;
			ymd = new YMD(1966,7);
			doh.is(ymd.getYear(),1966);
			doh.is(ymd.getMonth(),7);
			doh.is(ymd.getDay(),0);
			doh.t(!ymd.isExact());
		},

		function nominalToString(doh) {
			var ymd;
			ymd = new YMD(1966,7,3);
			doh.is(""+ymd,"1966-07-03");
		},

		function nominalAsDate(doh) {
			var ymd, d;
			ymd = new YMD(1966,7,3);
			d = ymd.getExactDate();
			doh.is(d.toUTCString(),"Sun, 03 Jul 1966 00:00:00 GMT");
		}

	]);

});
