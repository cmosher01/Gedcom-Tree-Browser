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
	"../Rect",
	"../Point",
	"../Size"],

function(
	tests,
	Rect,
	Point,
	Size) {

	"use strict";

	tests.register("Rect",[

		function nominal(doh) {
			var r;
			r = new Rect(new Point(43,67), new Size(83,61));
			doh.is(r.getLeft(), 43);
			doh.is(r.getTop(), 67);
			doh.is(r.getWidth(), 83);
			doh.is(r.getHeight(), 61);
		},

		function nominalRightBottom(doh) {
			var r;
			r = new Rect(new Point(43,67), new Size(83,61));
			doh.is(r.getRight(), 43+83);
			doh.is(r.getBottom(), 67+61);
		}

	]);

});
