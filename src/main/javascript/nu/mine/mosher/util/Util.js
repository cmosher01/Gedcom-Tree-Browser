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

/**
 * @fileoverview
 * Defines the {@link Util} class.
 */

/**
 * @class Contains static utilities.
 * @constructor
 * @return never returns
 * @type Util
 * @throws always throws an error
 */

define(["dojo/_base/declare"], function(declare) {

	"use strict";

	var Util = declare(null, {
		constructor: function() {
			throw new Error("cannot instantiate");
		}
	});







	/**
	 * A function that is guaranteed to return undefined, even if the
	 * global property "undefined" has been (maliciously) assigned a value.
	 * @type undefined
	 */
	Util["undefined"] = function() {
		var x;
		return x;
	};

	/**
	 * guaranteed to return NaN
	 * @returns NaN
	 * @type Number
	 */
	Util.NaN = function() {
		return 0/0;
	};

	/**
	 * guaranteed to return Infinity
	 * @returns Infinity
	 * @type Number
	 */
	Util.Infinity = function() {
		return 1/0;
	};

	/**
	 * Returns the datatype of any given object, primitive, null, or undefined.
	 * @param {any} x any object or primitive
	 * @return type-name of x
	 * @type String
	 */
	Util.getTypeName = function(x) {
		var n, m, clnam;

		if (typeof x == "undefined") {
			return "undefined";
		}
		if (x === null) {
			return "null";
		}

		clnam = Object.prototype.toString;
		n = clnam.apply(x);
		m = /\[object\s*(\w+)\s*\]/.exec(n);
		if (m !== null) {
			n = m[1];
		}

		if (n === "global") {
			return "Window";
		}

		if (n !== "Object") {
			return n;
		}

		n = x.constructor;
		if (n == null) {
			return "Object";
		}

		n = n.name;
		if (n == null) {
			n = x.constructor.toString();
			m = /^\s*function\s*(\w+)/.exec(n);
			if (m == null) {
				m = /\[object\s*(\w+)\s*\]/.exec(n);
				if (m == null) {
					return "Object";
				}
			}
			return m[1];
		}

		return n;
	};

	/**
	 * Calls fn for each (non-undefined) element in r.
	 * @param {Object} r Array
	 * @param {Function} fn function to call
	 */
	Util.forEach = function(r,fn) {
		r.forEach(fn);
	};

	/**
	 *
	 * Creates a new non-sparse array from r.
	 * @param {Array} r any array
	 * @return non-sparse version of r
	 * @type Array
	 */
	Util.consolodate = function(r) {
		return r.filter(function() { return true; });
	};

	/**
	 * Splits the given string into line. Allows these line
	 * terminators: CR/LF, CR, and/or LF.
	 * @param {String} s
	 * @return array of String lines from s
	 * @type Array
	 */
	Util.getLines = function(s) {
		// unify line terminators
		s = s.replace(/\r\n/g,"\n");
		s = s.replace(/\r/g,"\n");

		// split string into lines
		return s.match(/^.*$/mg);
	};

	/**
	 * Returns a new copy of the given string, or an empty string if
	 * given null or undefined.
	 * @param {String} s string, or null, or undefined
	 * @return new string (never null or undefined)
	 * @type String
	 */
	Util.safeStr = function(s) {
		if (!s) {
			s = "";
		}
		return s.toString();
	};

	/**
	 * Ensures that a given object is of a specified type.
	 * Throws an exception otherwise.
	 * @param {any} obj object or primitive to check
	 * @param {String} clsName name of type
	 * @throws TypeError if wrong type
	 */
	Util.verifyType = function(obj,clsName) {
		if (Util.getTypeName(obj) !== clsName) {
			throw new TypeError(Util.getTypeName(obj)+" must be of class "+clsName);
		}
	};

	/**
	 * Returns a new array copy of a given array with the given element removed.
	 * @param {any} e element to remove
	 * @param {Array} r array to copy
	 * @return new copy of r without e
	 * @type Array
	 */
	Util.remove = function(e,r) {
		return r.filter(function(v) { return v !== e; });
	};


	/**
	 * Returns a string suitable for specifying a CSS pixel value
	 * for the given number. For example, Util.px(7.3) return "7px".
	 * Rounds any fractional number to the nearest integer.
	 * @param {Number} num number of pixels
	 * @return pixel value string
	 * @type String
	 */
	Util.px = function(num) {
		return Math.round(num).toString(10)+"px";
	};

	/**
	 * Creates a new HTMLElement with the given tag name.
	 * @param {String} tag
	 * @return a new HTMLElement
	 * @type HTMLElement
	 */
	Util.createHtmlElement = function(tag) {
		return $.doc.createElement(tag);
	};

	/**
	 * Returns a string of n of c characters
	 * @param n number of character
	 * @param c character to repeat (defaults to space)
	 * @return string
	 * @type String
	 */
	Util.repstr = function(n,c) {
		if (n <= 0) {
			return "";
		}
		if (typeof c == "undefined") {
			c = " ";
		}
		return new Array(n+1).join(c);
	};

	/**
	 * Pads number n to width d with leading zeroes. Number is rounded to int first.
	 * @param n
	 * @param d
	 * @return number with leading zeroes
	 * @type String
	 */
	Util.digint = function(n,d) {
		var s, neg;
		n = Math.round(n);
		neg = (n < 0);
		if (neg) {
			n = -n;
		}
		s = ""+n;
		return (neg ? "-": "")+Util.repstr(d-s.length,"0")+s;
	};

	/**
	 * Ordering function (intended to be passed to Array.sort) that
	 * compares Numbers.
	 * @param {Number} a
	 * @param {Number} b
	 * @return negative for a&lt;b, positive for b&lt;a, zero for a=b
	 * @type Number
	 */
	Util.numberOrder = function(a,b) {
		return a-b;
	};

	/**
	 * Ordering function (intended to be passed to Array.sort) that
	 * compares Strings in a locale-specific way.
	 * @param {String} a
	 * @param {String} b
	 * @return negative for a&lt;b, positive for b&lt;a, zero for a=b
	 * @type Number
	 */
	Util.localeOrder = function(a,b) {
		return a.localeCompare(b);
	};

	/**
	 * Ordering function (intended to be passed to Array.sort) that
	 * compares Dates.
	 * @param {Date} a
	 * @param {Date} b
	 * @return negative for a&lt;b, positive for b&lt;a, zero for a=b
	 * @type Number
	 */
	Util.dateOrder = function(a,b) {
		return Util.numberOrder(a.getTime(),b.getTime());
	};

	Util.leftClick = function(e) {
		if (e.which == null) {
			return (e.button < 2);
		} else {
			return (e.which < 2);
		}
	};



	return Util;
});
