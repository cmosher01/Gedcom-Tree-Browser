(function($,doh) {
	"use strict";

	var SUITE = "nu.mine.mosher.util.tests.Util";

	$.provide(SUITE);

	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;



	function ChrisMosherUtilInternalTestClass() { /*do nothing*/ }



	doh.register(SUITE,[

	function forEachNominal() {
		var r, rr;

		r = ["a","b","c"];

		rr = [];
		Util.forEach(r,function(v) {
			rr.push(v);
		});

		doh.is(r,rr);
	},

	function forEachNull() {
		var r, rr;

		r = ["a",null,"c"];

		rr = [];
		Util.forEach(r,function(v) {
			rr.push(v);
		});

		doh.is(r,rr);
	},

	function forEachDeleted() {
		var r, rr;

		r = ["a","b","c"];
		delete r[1];

		rr = [];
		Util.forEach(r,function(v) {
			rr.push(v);
		});

		doh.is(["a","c"],rr);
	},

	function forEachSparse() {
		var r, rr;

		r = [];
		r[0] = "a";
		r[10000] = "b";

		rr = [];
		Util.forEach(r,function(v) {
			rr.push(v);
		});

		doh.is(["a","b"],rr);
	},


	function forEachObjectProperty() {
		var obj, rr;
		obj = {
			a: "a",
			b: "b"
		};
		rr = [];
		Util.forEach(obj,function(v) {
			rr.push(v);
		});

		doh.t((rr[0]=="a"&&rr[1]=="b") || (rr[0]=="b"&&rr[1]=="a"));
	},




	function consolodateNominal() {
		var r, rr;

		r = ["a","b","c"];
		delete r[1];

		rr = Util.consolodate(r);
		doh.is(["a","c"],rr);
	},





	function removeNominal() {
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




	function classNameOfClassicOOObject() {
		doh.is("ChrisMosherUtilInternalTestClass",Util.getTypeName(new ChrisMosherUtilInternalTestClass()));
	},

	function classNameOfObject() {
		doh.is("Object",Util.getTypeName(new Object()));
	},

	function classNameOfString() {
		doh.is("String",Util.getTypeName(new String("testing")));
	},

	function classNameOfStringLiteral() {
		doh.is("String",Util.getTypeName("testing"));
	},

	function classNameOfArray() {
		doh.is("Array",Util.getTypeName(new Array(1,2,3)));
	},

	function classNameOfArrayLiteral() {
		doh.is("Array",Util.getTypeName([1,2,3]));
	},

	function classNameOfnumber() {
		doh.is("Number",Util.getTypeName(new Number(3.14)));
	},

	function classNameOfnumber() {
		doh.is("Number",Util.getTypeName(3.14));
	},

	function classNameOfnumberProperty() {
		doh.is("Number",Util.getTypeName(window.length));
	},

	function classNameOfBoolean() {
		doh.is("Boolean",Util.getTypeName(new Boolean(true)));
	},

	function classNameOfBooleanLiteral() {
		doh.is("Boolean",Util.getTypeName(true));
	},

	function classNameOfNull() {
		doh.is("null",Util.getTypeName(null));
	},

	function classNameOfUndefined() {
		doh.is("undefined",Util.getTypeName(Util.undefined()));
	},

	function classNameOfOmittedArgument() {
		doh.is("undefined",Util.getTypeName());
	},

	function classNameOfCastratedObject() {
		var x;
		x = new ChrisMosherUtilInternalTestClass();
		x.constructor = null;
		doh.is("Object",Util.getTypeName(x));
	},

	function classNameOfCorruptedObject() {
		var x;
		x = new ChrisMosherUtilInternalTestClass();
		x.constructor = {foo:"bar"};
		doh.is("Object",Util.getTypeName(x));
	},

	function classNameOfCorruptedObject2() {
		var x;
		x = new ChrisMosherUtilInternalTestClass();
		x.constructor = [1,2,3];
		doh.is("Object",Util.getTypeName(x));
	},

	function classNameOfDate() {
		doh.is("Date",Util.getTypeName(new Date()));
	},

	function classNameOfRegExpObject() {
		doh.is("RegExp",Util.getTypeName(new RegExp(/.*/g)));
	},

	function classNameOfRegExpLiteral() {
		doh.is("RegExp",Util.getTypeName(/.*/g));
	},

	function classNameOfFunctionObject() {
		doh.is("Function",Util.getTypeName(function(){/*do nothing*/}));
	},

	function classNameOfCastratedFunctionObject() {
		var x = function(){/*do nothing*/};
		x.constructor = null;
		doh.is("Function",Util.getTypeName(x));
	},

	function classNameOfCastratedRegExp() {
		var x = /.*/g;
		x.constructor = null;
		doh.is("RegExp",Util.getTypeName(x));
	},

	function classNameOfObjectType() {
		doh.is("Function",Util.getTypeName(Object));
	},

	function classNameOfMathType() {
		doh.is("Math",Util.getTypeName(Math));
	},

	function classNameOfDateType() {
		doh.is("Function",Util.getTypeName(Date));
	},

//  May not always be Window?
//	function classNameOfWindow() {
//		doh.is("Window",Util.getTypeName(window));
//	},

	function classNameOfMaliciousCorruption() {
		var x = new ChrisMosherUtilInternalTestClass();
		x.constructor = {name:"Foo"};
		doh.is("Foo",Util.getTypeName(x)); // can't fix this?
	},

//  Is sometimes Arguments, sometimes Object
//	function classNameOfArguments() {
//		doh.is("Arguments",Util.getTypeName(arguments));
//	},

//  Can't use callee in strict mode. (Good.)
//	function classNameOfCallee() {
//		doh.is("Function",Util.getTypeName(arguments.callee));
//	},

	function safestrNominal() {
		doh.is("Chris",Util.safeStr("Chris"));
	},

	function safestrUndefined() {
		doh.is("",Util.safeStr(undefined));
	},

	function safestrMissing() {
		doh.is("",Util.safeStr());
	},

	function safestrNull() {
		doh.is("",Util.safeStr(null));
	},


	function digintNominal() {
		doh.is("068",Util.digint(68,3));
	},

	function digintNoneAdded() {
		doh.is("68",Util.digint(68,2));
	},

	function digintTooBig() {
		doh.is("68",Util.digint(68,1));
	},

	function digintMultiDigitZero() {
		doh.is("0000000",Util.digint(0,7));
	},

	function digintZero() {
		doh.is("0",Util.digint(0,1));
	},

	function digintNegativeNominal() {
		doh.is("-00027",Util.digint(-27,5));
	},

	function digintFractional() {
		doh.is("-00027",Util.digint(-27.47,5));
	},

	function digintFractionalRoundUp() {
		doh.is("-00028",Util.digint(-27.58,5));
	},

	function undefinedFunction() {
		doh.is("undefined",typeof Util.undefined());
	},

	function NaNFUnction() {
		doh.is("number",typeof Util.NaN());
		doh.t(isNaN(Util.NaN()));
	},

	function InfinityFunction() {
		doh.is("number",typeof Util.Infinity());
		doh.is(1/0,Util.Infinity());
	}
]);

})(window.dojo,window.doh);
