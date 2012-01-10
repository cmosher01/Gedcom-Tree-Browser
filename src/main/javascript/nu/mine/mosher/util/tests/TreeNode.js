(function($,doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.util.tests.TreeNode";

	$.provide(SUITE);

	$.require("nu.mine.mosher.util.TreeNode");
	var TreeNode = nu.mine.mosher.util.TreeNode;
	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	doh.register(SUITE,[

	function nominalChild() {
		var a, b, r, i, c;

		a = new TreeNode();
		a.obj = "a";
		b = new TreeNode();
		b.obj = "b";

		a.addChild(b);
		r = a.getChildren();

		i = 0;
		Util.forEach(r,function() {i++;});
		doh.is(1,i);

		Util.forEach(r,function(v) {
			doh.is("b",v.obj);
		});

		doh.is("a",b.getParent().obj);
	},

	function nominalRemoveChild() {
		var a, b, r, i, c;

		a = new TreeNode();
		a.obj = "a";
		b = new TreeNode();
		b.obj = "b";

		a.addChild(b);
		a.removeChild(b);
		r = a.getChildren();

		i = 0;
		Util.forEach(r,function() {i++;});
		doh.is(0,i);

		doh.is(null,b.getParent());
	},

	function nominalRemoveFromParent() {
		var a, b, r, i;

		a = new TreeNode();
		a.obj = "a";
		b = new TreeNode();
		b.obj = "b";

		a.addChild(b);
		b.removeFromParent();

		r = a.getChildren();

		i = 0;
		Util.forEach(r,function() {i++;});
		doh.is(0,i);

		doh.is(null,b.getParent());
	},

	function addChildOfOtherExistingParent() {
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
		Util.forEach(r,function() {i++;});
		doh.is(0,i);



		r = x.getChildren();

		i = 0;
		Util.forEach(r,function() {i++;});
		doh.is(1,i);

		Util.forEach(r,function(v) {
			doh.is("b",v.obj);
		});



		doh.is("x",b.getParent().obj);
	},

	function threeChildren() {
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
		Util.forEach(r,function() {i++;});
		doh.is(3,i);

		doh.is("c1",r[0].obj);
		doh.is("c2",r[1].obj);
		doh.is("c3",r[2].obj);

		doh.is("p",c1.getParent().obj);
		doh.is("p",c2.getParent().obj);
		doh.is("p",c3.getParent().obj);
	},

	function removeMiddleChild() {
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
		Util.forEach(r,function() {i++;});
		doh.is(2,i);

		doh.is("c1",r[0].obj);
		doh.is("c3",r[1].obj);

		doh.is("p",c1.getParent().obj);
		doh.is(null,c2.getParent());
		doh.is("p",c3.getParent().obj);
	},

	function addUndefinedChildShouldRaise() {
		var n;
		n = new TreeNode();
		doh.e(Error,n,"addChild",[undefined]);
	},

	function addNullChildShouldRaise() {
		var n;
		n = new TreeNode();
		doh.e(Error,n,"addChild",[null]);
	},

	function removeUndefinedChildShouldRaise() {
		var n;
		n = new TreeNode();
		doh.e(Error,n,"removeChild",[undefined]);
	},

	function removeNullChildShouldRaise() {
		var n;
		n = new TreeNode();
		doh.e(Error,n,"removeChild",[null]);
	}

	]);

})(window.dojo,window.doh);
