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
 * Defines the {@link Size} class.
 */

/**
 * @class
 * Represents the size of a graphical object in 2D space.
 * @requires Util
 * @constructor
 * @param {Number} w width
 * @param {Number} h height
 * @return new {@link Size}
 * @type Size
 */
define(["dojo/_base/declare"], function(declare) {

	"use strict";

	return declare(null, {

		constructor: function(w,h) {
			/**
			 * width
			 * @private
			 * @type Number
			 */
			this.w = parseInt(w,10);
			/**
			 * height
			 * @private
			 * @type Number
			 */
			this.h = parseInt(h,10);
		},
		
		/**
		 * Gets the width of this {@link Size}.
		 * @returns width
		 * @type Number
		 */
		getWidth: function() {
			return this.w;
		},
		
		/**
		 * Gets the height of this {@link Size}.
		 * @returns width
		 * @type Number
		 */
		getHeight: function() {
			return this.h;
		},
		
		/**
		 * Gets a debug string for this {@link Size}.
		 * @return debug string
		 * @type String
		 */
		toString: function() {
			return "WxH="+this.getWidth()+"x"+this.getHeight();
		}

	});

});
