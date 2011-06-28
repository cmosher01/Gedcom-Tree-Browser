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
(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gfx.Point";

	$.provide(CLASS);

	var Point = $.declare(CLASS, null, {

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

	Point.fromBrowserEvent = function(e) {
		var x, y;
		x = y = 0;
		if (e.pageX) {
			x = e.pageX;
		} else if (e.clientX) {
		   x = e.clientX + (
				   $.doc.documentElement.scrollLeft ?
				   $.doc.documentElement.scrollLeft :
				   $.doc.body.scrollLeft
		   );
		}
		if (e.pageY) {
			y = e.pageY;
		} else if (e.clientY) {
		   y = e.clientY + (
				   $.doc.documentElement.scrollTop ?
				   $.doc.documentElement.scrollTop :
				   $.doc.body.scrollTop
		   );
		}
		return new Point(x,y);
	};

})(window.dojo);
