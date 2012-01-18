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
	"../Util"],

function(
	tests,
	Util) {

	"use strict";

	function ChrisMosherUtilInternalTestClass() { /*do nothing*/ }



	tests.register("Util",[

		function consolodateNominal(doh) {
			var r, rr;

			r = ["a","b","c"];
			delete r[1];

			rr = Util.consolodate(r);
			doh.is(["a","c"],rr);
		},





		function removeNominal(doh) {
			var r;

			r = ["a","b","c"];
			delete r[1];
			doh.isNot(["a","c"],r);
			doh.is(["a",undefined,"c"],r);

			r = ["a","b","c"];
			r = Util.remove("b",r);
			doh.is(["a","c"],r);
			doh.isNot(["a",undefined,"c"],r);
		},




		function classNameOfClassicOOObject(doh) {
			doh.is("ChrisMosherUtilInternalTestClass",Util.getTypeName(new ChrisMosherUtilInternalTestClass()));
		},

		function classNameOfObject(doh) {
			doh.is("Object",Util.getTypeName(new Object()));
		},

		function classNameOfString(doh) {
			doh.is("String",Util.getTypeName(new String("testing")));
		},

		function classNameOfStringLiteral(doh) {
			doh.is("String",Util.getTypeName("testing"));
		},

		function classNameOfArray(doh) {
			doh.is("Array",Util.getTypeName(new Array(1,2,3)));
		},

		function classNameOfArrayLiteral(doh) {
			doh.is("Array",Util.getTypeName([1,2,3]));
		},

		function classNameOfnumber(doh) {
			doh.is("Number",Util.getTypeName(new Number(3.14)));
		},

		function classNameOfnumber(doh) {
			doh.is("Number",Util.getTypeName(3.14));
		},

		function classNameOfnumberProperty(doh) {
			doh.is("Number",Util.getTypeName(window.length));
		},

		function classNameOfBoolean(doh) {
			doh.is("Boolean",Util.getTypeName(new Boolean(true)));
		},

		function classNameOfBooleanLiteral(doh) {
			doh.is("Boolean",Util.getTypeName(true));
		},

		function classNameOfNull(doh) {
			doh.is("null",Util.getTypeName(null));
		},

		function classNameOfUndefined(doh) {
			doh.is("undefined",Util.getTypeName(Util.undefined()));
		},

		function classNameOfOmittedArgument(doh) {
			doh.is("undefined",Util.getTypeName());
		},

		function classNameOfCastratedObject(doh) {
			var x;
			x = new ChrisMosherUtilInternalTestClass();
			x.constructor = null;
			doh.is("Object",Util.getTypeName(x));
		},

		function classNameOfCorruptedObject(doh) {
			var x;
			x = new ChrisMosherUtilInternalTestClass();
			x.constructor = {foo:"bar"};
			doh.is("Object",Util.getTypeName(x));
		},

		function classNameOfCorruptedObject2(doh) {
			var x;
			x = new ChrisMosherUtilInternalTestClass();
			x.constructor = [1,2,3];
			doh.is("Object",Util.getTypeName(x));
		},

		function classNameOfDate(doh) {
			doh.is("Date",Util.getTypeName(new Date()));
		},

		function classNameOfRegExpObject(doh) {
			doh.is("RegExp",Util.getTypeName(new RegExp(/.*/g)));
		},

		function classNameOfRegExpLiteral(doh) {
			doh.is("RegExp",Util.getTypeName(/.*/g));
		},

		function classNameOfFunctionObject(doh) {
			doh.is("Function",Util.getTypeName(function(){/*do nothing*/}));
		},

		function classNameOfCastratedFunctionObject(doh) {
			var x = function(){/*do nothing*/};
			x.constructor = null;
			doh.is("Function",Util.getTypeName(x));
		},

		function classNameOfCastratedRegExp(doh) {
			var x = /.*/g;
			x.constructor = null;
			doh.is("RegExp",Util.getTypeName(x));
		},

		function classNameOfObjectType(doh) {
			doh.is("Function",Util.getTypeName(Object));
		},

		function classNameOfMathType(doh) {
			doh.is("Math",Util.getTypeName(Math));
		},

		function classNameOfDateType(doh) {
			doh.is("Function",Util.getTypeName(Date));
		},

	//  May not always be Window?
	//	function classNameOfWindow(doh) {
	//		doh.is("Window",Util.getTypeName(window));
	//	},

		function classNameOfMaliciousCorruption(doh) {
			var x = new ChrisMosherUtilInternalTestClass();
			x.constructor = {name:"Foo"};
			doh.is("Foo",Util.getTypeName(x)); // can't fix this?
		},

	//  Is sometimes Arguments, sometimes Object
	//	function classNameOfArguments(doh) {
	//		doh.is("Arguments",Util.getTypeName(arguments));
	//	},

	//  Can't use callee in strict mode. (Good.)
	//	function classNameOfCallee(doh) {
	//		doh.is("Function",Util.getTypeName(arguments.callee));
	//	},

		function safestrNominal(doh) {
			doh.is("Chris",Util.safeStr("Chris"));
		},

		function safestrUndefined(doh) {
			doh.is("",Util.safeStr(undefined));
		},

		function safestrMissing(doh) {
			doh.is("",Util.safeStr());
		},

		function safestrNull(doh) {
			doh.is("",Util.safeStr(null));
		},


		function undefinedFunction(doh) {
			doh.is("undefined",typeof Util.undefined());
		},

		function NaNFUnction(doh) {
			doh.is("number",typeof Util.NaN());
			doh.t(isNaN(Util.NaN()));
		},

		function InfinityFunction(doh) {
			doh.is("number",typeof Util.Infinity());
			doh.is(1/0,Util.Infinity());
		},

		function getLinesNominalLF()
		{
			var s = "a\nb\nc";
			var r = Util.getLines(s);
			doh.is(3,r.length);
			doh.is("a",r[0]);
			doh.is("b",r[1]);
			doh.is("c",r[2]);
		},

		function getLinesNominalCRLF()
		{
			var s = "a\r\nb\r\nc";
			var r = Util.getLines(s);
			doh.is(3,r.length);
			doh.is("a",r[0]);
			doh.is("b",r[1]);
			doh.is("c",r[2]);
		},

		function getLinesNominalCR()
		{
			var s = "a\rb\rc";
			var r = Util.getLines(s);
			doh.is(3,r.length);
			doh.is("a",r[0]);
			doh.is("b",r[1]);
			doh.is("c",r[2]);
		}
	]);

});
