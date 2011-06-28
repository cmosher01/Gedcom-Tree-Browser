/**
 * @fileoverview
 * Defines the {@link Rect} class.
 */

/**
 * @class Represents a graphical rectangle in 2D space.
 * @requires Point
 * @requires Size
 * @requires Util
 * 
 * @constructor
 * @param {Point} pos the location of the top-left corner of this {@link Rect}
 * @param {Size} siz the width and height of this {@link Rect}
 * @return new {@link Rect}
 * @type Rect
 */
(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gfx.Rect";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gfx.Point");
	var Point = nu.mine.mosher.gfx.Point;
	$.require("nu.mine.mosher.gfx.Size");
	var Size = nu.mine.mosher.gfx.Size;
	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	var Rect = $.declare(CLASS, null, {

		constructor: function(pos,siz) {
			/**
			 * position of top-left corner
			 * @private
			 * @type Point
			 */
			this.pos = pos;
		
			/**
			 * width and height
			 * @private
			 * @type Size
			 */
			this.siz = siz;
		},
		
		/**
		 * Gets the location of the top-left corner of this {@link Rect}
		 * @return top-left
		 * @type Point
		 */
		getPos: function() {
			return this.pos;
		},
		
		/**
		 * Gets the width and height of this {@link Rect}
		 * @return width and height
		 * @type Size
		 */
		getSize: function() {
			return this.siz;
		},
		
		/**
		 * Gets the x coordinate of the left of this {@link Rect}.
		 * @return left
		 * @type Number
		 */
		getLeft: function() {
			return this.pos.getX();
		},
		
		/**
		 * Gets the width of this {@link Rect}
		 * @return width
		 * @type Number
		 */
		getWidth: function() {
			return this.siz.getWidth();
		},
		
		/**
		 * Gets the y coordinate of the top of this {@link Rect}.
		 * @return top
		 * @type Number
		 */
		getTop: function() {
			return this.pos.getY();
		},
		
		/**
		 * Gets the height of this {@link Rect}
		 * @return height
		 * @type Number
		 */
		getHeight: function() {
			return this.siz.getHeight();
		},
		
		/**
		 * Gets the x coordinate of the right of this {@link Rect}.
		 * @return right
		 * @type Number
		 */
		getRight: function() {
			return this.getLeft()+this.getWidth();
		},
		
		/**
		 * Gets the y coordinate of the bottom of this {@link Rect}.
		 * @return bottom
		 * @type Number
		 */
		getBottom: function() {
			return this.getTop()+this.getHeight();
		},
		
		/**
		 * Gets the x coordinate of the middle of this {@link Rect}.
		 * @return mid-x
		 * @type Number
		 */
		getMidX: function() {
			return Math.round((this.getLeft()+this.getRight())/2);
		},
		
		/**
		 * Gets the y coordinate of the middle of this {@link Rect}.
		 * @return mid-y
		 * @type Number
		 */
		getMidY: function() {
			return Math.round((this.getTop()+this.getBottom())/2);
		}
	});

		
	/**
	 * Gets the given HTMLElement's location (offset).
	 * @param {HTMLElement} e element to get the location of
	 * @return new {@link Rect} describing the given HTMLElement's location.
	 * @type Rect
	 */
	Rect.ofDiv = function(e) {
		return new Rect(new Point(e.offsetLeft,e.offsetTop),new Size(e.offsetWidth,e.offsetHeight));
	};
	
	/**
	 * Checks if two rectangles intersect.
	 * @param {Rect} r1
	 * @param {Rect} r2
	 * @return true if the two rectangles intersect
	 * @type Boolean
	 */
	Rect.intersect = function(r1,r2) {
		return r1.getTop() <= r2.getBottom() && r2.getTop() <= r1.getBottom() && r1.getLeft() <= r2.getRight() && r2.getLeft() <= r1.getRight();
	};

})(window.dojo);
