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
 * Defines the {@link Rect} class.
 */

/**
 * @class Represents a graphical rectangle in 2D space.
 * @requires Point
 * @requires Size
 *
 * @constructor
 * @param {Point} pos the location of the top-left corner of this {@link Rect}
 * @param {Size} siz the width and height of this {@link Rect}
 * @return new {@link Rect}
 * @type Rect
 */
define([
	"dojo/_base/declare",
	"./Point",
	"./Size"],

function(
	declare,
	Point,
	Size) {

	"use strict";

	var Rect = declare(null, {

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

	return Rect;

});
