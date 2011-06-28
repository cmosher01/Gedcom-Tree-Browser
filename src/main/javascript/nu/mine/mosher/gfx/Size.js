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
(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gfx.Size";

	$.provide(CLASS);

	var Size = $.declare(CLASS, null, {

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

})(window.dojo);
