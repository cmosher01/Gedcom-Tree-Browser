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
 * Defines the {@link GedcomLine} class.
 */

define(["dojo/_base/declare","nu/mine/mosher/util/Util"],
function(declare,Util) {

	"use strict";

	var GedcomLine = declare(null, {

		/**
		 * @class Represents one line of a GEDCOM file.
		 * @requires Util
		 * 
		 * @constructor
		 * @param {Number} level the level of this {@link GedcomLine}.
		 * @param {String} gid the ID of this {@link GedcomLine}. Optional.
		 * @param {String} tag the tag of this {@link GedcomLine}.
		 * @param {String} val the value of this {@link GedcomLine}. Optional
		 * @return new {@link GedcomLine}
		 * @type GedcomLine
		 */
		constructor: function(level, gid, tag, val) {
			/**
			 * Level number. Greater than or equal to zero.
			 * @private
			 * @type Number
			 */
			this.level = parseInt(level,10);
		
			/**
			 * ID of this line, if it has one, otherwise empty string.
			 * @private
			 * @type String
			 */
			this.gid = GedcomLine.asPointer(gid);
		
			/**
			 * GEDCOM tag of this line (not validated).
			 * @private
			 * @type String
			 */
			this.tag = Util.safeStr(tag).toUpperCase();
		
			/**
			 * ID of other line if value is a pointer, otherwise empty string.
			 * @private
			 * @type String
			 */
			this.pointer = GedcomLine.asPointer(val);
		
			if (this.pointer) {
				/**
				 * Value of this line, or empty string.
				 * @private
				 * @type String
				 */
				this.val = Util.safeStr();
			} else {
				this.val = GedcomLine.replaceAts(Util.safeStr(val));
			}

			this.ref = null;
		},
		
		/**
		 * Gets the level number of this {@link GedcomLine}.
		 * @return level
		 * @type Number
		 */
		getLevel: function() {
			return this.level;
		},
		
		/**
		 * Gets the ID of this {@link GedcomLine}, or empty string if this
		 * line doesn't have an ID.
		 * @return ID
		 * @type String
		 */
		getID: function() {
			return this.gid;
		},
		
		/**
		 * Gets the GECOM tag of this {@link GedcomLine}.
		 * @return tag
		 * @type String
		 */
		getTag: function() {
			return this.tag;
		},
		
		/**
		 * Gets the value of this {@link GedcomLine}. May be empty.
		 * @return value
		 * @type String
		 */
		getVal: function() {
			return this.val;
		},
		
		/**
		 * If the value of this {@link GedcomLine} is just a pointer to
		 * another line, then this method gets the ID of that other line.
		 * Otherwise, returns an empty string.
		 * @return pointer
		 * @type String
		 */
		getPointer: function() {
			return this.pointer;
		},

		setRef: function(ref) {
			this.ref = ref;
		},
		getRef: function() {
			return this.ref;
		},

		/**
		 * Returns <code>true</code> if this {@link GedcomLine} has an ID.
		 * @return if this {@link GedcomLine} has an ID
		 * @type Boolean
		 */
		hasID: function() {
			return !!this.getID();
		},
		
		/**
		 * Returns <code>true</code> if this {@link GedcomLine}'s value
		 * is just a pointer to another line.
		 * @return if this {@link GedcomLine} is a pointer
		 * @type Boolean
		 */
		isPointer: function() {
			return !!this.getPointer();
		},
		
		/**
		 * Joins a CONC or CONT {@link GedcomLine} to this {@link GedcomLine}.
		 * If the given {@link GedcomLine} is not a CONC or CONT line, then do nothing.
		 * @param {GedcomLine} c the CONC or CONT line
		 */
		concat: function(c) {
			switch (c.getTag()) {
				case "CONC": this.val += c.getVal(); break;
				case "CONT": this.val += "\n"+c.getVal(); break;
			}
		}
	});
	
	/**
	 * Creates a {@link GedcomLine} from parsing the given GEDCOM line string.
	 * @param {String} s the GEDCOM line to be parsed.
	 * @returns new {@link GedcomLine} from parsing s
	 * @type GedcomLine
	 */
	GedcomLine.parse = function(s) {
		var r = /^\s*(\d+)\s+(?:(@[^@]+@)\s+)?(\S+)(?:\s(.*))?$/.exec(s);
		if (r == null) {
			throw new Error("Gedcom line has invalid syntax: "+s);
		}
		return new GedcomLine(r[1],r[2],r[3],r[4]);
	};
	
	/**
	 * Parses the given string to see if it is a GEDCOM pointer (that is, if
	 * it starts and ends with an at sign and does not contain any other at signs).
	 * If so, returns the value inside the at signs (the ID). If not, returns the
	 * empty string.
	 * @private
	 * @param {String} s the value to check for being a GEDCOM pointer
	 * @return the pointed to ID, or empty string
	 * @type String 
	 */
	GedcomLine.asPointer = function(s) {
		var r;
		r = /^@([^@]+)@$/.exec(s);
		if (r == null) {
			return "";
		}
		return r[1];
	};
	
	/**
	 * Replaces double at signs with single at signs in the given string.
	 * @private
	 * @param {String} s string containing double at-signs
	 * @return string s with double at-signs replaced with single at-signs
	 * @type String
	 */
	GedcomLine.replaceAts = function(s) {
		if (!s || !s.replace) {
			return s;
		}
		return s.replace(/@@/g,"@");
	};

	return GedcomLine;

});
