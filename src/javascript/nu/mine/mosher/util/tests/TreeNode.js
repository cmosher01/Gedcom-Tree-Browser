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
	"../TreeNode"],

function(
	tests,
	TreeNode) {

	"use strict";

	tests.register("TreeNode",[

		function nominalChild(doh) {
			var a, b, r, i, c;

			a = new TreeNode();
			a.obj = "a";
			b = new TreeNode();
			b.obj = "b";

			a.addChild(b);
			r = a.getChildren();

			i = 0;
			r.forEach(function() {i++;});
			doh.is(1,i);

			r.forEach(function(v) {
				doh.is("b",v.obj);
			});

			doh.is("a",b.getParent().obj);
		},

		function nominalRemoveChild(doh) {
			var a, b, r, i, c;

			a = new TreeNode();
			a.obj = "a";
			b = new TreeNode();
			b.obj = "b";

			a.addChild(b);
			a.removeChild(b);
			r = a.getChildren();

			i = 0;
			r.forEach(function() {i++;});
			doh.is(0,i);

			doh.is(null,b.getParent());
		},

		function nominalRemoveFromParent(doh) {
			var a, b, r, i;

			a = new TreeNode();
			a.obj = "a";
			b = new TreeNode();
			b.obj = "b";

			a.addChild(b);
			b.removeFromParent();

			r = a.getChildren();

			i = 0;
			r.forEach(function() {i++;});
			doh.is(0,i);

			doh.is(null,b.getParent());
		},

		function addChildOfOtherExistingParent(doh) {
			var a, b, r, i, x;

			a = new TreeNode();
			a.obj = "a";
			b = new TreeNode();
			b.obj = "b";
			a.addChild(b);

			x = new TreeNode();
			x.obj = "x";
			x.addChild(b);



			r = a.getChildren();
			i = 0;
			r.forEach(function() {i++;});
			doh.is(0,i);



			r = x.getChildren();

			i = 0;
			r.forEach(function() {i++;});
			doh.is(1,i);

			r.forEach(function(v) {
				doh.is("b",v.obj);
			});



			doh.is("x",b.getParent().obj);
		},

		function threeChildren(doh) {
			var p, c1, c2, c3, r, i, c;

			p = new TreeNode();
			p.obj = "p";
			c1 = new TreeNode();
			c1.obj = "c1";
			p.addChild(c1);
			c2 = new TreeNode();
			c2.obj = "c2";
			p.addChild(c2);
			c3 = new TreeNode();
			c3.obj = "c3";
			p.addChild(c3);

			r = p.getChildren();

			i = 0;
			r.forEach(function() {i++;});
			doh.is(3,i);

			doh.is("c1",r[0].obj);
			doh.is("c2",r[1].obj);
			doh.is("c3",r[2].obj);

			doh.is("p",c1.getParent().obj);
			doh.is("p",c2.getParent().obj);
			doh.is("p",c3.getParent().obj);
		},

		function removeMiddleChild(doh) {
			var p, c1, c2, c3, r, i, c;

			p = new TreeNode();
			p.obj = "p";
			c1 = new TreeNode();
			c1.obj = "c1";
			p.addChild(c1);
			c2 = new TreeNode();
			c2.obj = "c2";
			p.addChild(c2);
			c3 = new TreeNode();
			c3.obj = "c3";
			p.addChild(c3);

			p.removeChild(c2);

			r = p.getChildren();

			doh.is(2,r.length);
			i = 0;
			r.forEach(function() {i++;});
			doh.is(2,i);

			doh.is("c1",r[0].obj);
			doh.is("c3",r[1].obj);

			doh.is("p",c1.getParent().obj);
			doh.is(null,c2.getParent());
			doh.is("p",c3.getParent().obj);
		},

		function addUndefinedChildShouldRaise(doh) {
			var n;
			n = new TreeNode();
			doh.e(Error,n,"addChild",[undefined]);
		},

		function addNullChildShouldRaise(doh) {
			var n;
			n = new TreeNode();
			doh.e(Error,n,"addChild",[null]);
		},

		function removeUndefinedChildShouldRaise(doh) {
			var n;
			n = new TreeNode();
			doh.e(Error,n,"removeChild",[undefined]);
		},

		function removeNullChildShouldRaise(doh) {
			var n;
			n = new TreeNode();
			doh.e(Error,n,"removeChild",[null]);
		}

	]);

});
