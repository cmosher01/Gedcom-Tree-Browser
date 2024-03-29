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
 * Defines the {@link Point} class.
 */

/**
 * @class Represents a graphical point in 2D space.
 * @requires Util
 * @constructor
 * @param {Number} x x-coordinate of this {@link Point}
 * @param {Number} y y-coordinate of this {@link Point}
 * @return new {@link Point}
 * @type Point
 */
define(["dojo/_base/declare"], function(declare) {

	"use strict";

	var Point = declare(null, {

		constructor: function(x,y) {
			/**
			 * x-coordinate
			 * @private
			 * @type Number
			 */
			this.x = parseInt(x,10);
		
			/**
			 * y-coordinate
			 * @private
			 * @type Number
			 */
			this.y = parseInt(y,10);
		},
		
		/**
		 * Gets the x coordinate of this {@link Point}
		 * @return the x coordinate
		 * @type Number
		 */
		getX: function() {
			return this.x;
		},
		
		/**
		 * Gets the y coordinate of this {@link Point}
		 * @return the y coordinate
		 * @type Number
		 */
		getY: function() {
			return this.y;
		},
		
		/**
		 * Gets a debug string for this {@link Point}
		 * @return {String} debug string
		 * @type String
		 */
		toString: function() {
			return "("+this.getX()+","+this.getY()+")";
		}

	});

	return Point;

});
