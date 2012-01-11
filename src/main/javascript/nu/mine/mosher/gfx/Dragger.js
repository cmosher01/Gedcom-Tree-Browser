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
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/on",
	"dojo/_base/event",
	"./Point",
	"./Size",
	"nu/mine/mosher/util/Util"],

function(
	declare,
	lang,
	win,
	on,
	event,
	Point,
	Size,
	Util) {

	"use strict";

	return declare(null, {

		constructor: function(dragee, dragHandler, userArg) {
			this.dragHandler = dragHandler;
			this.userArg = userArg;

			on(dragee,"mousedown",lang.hitch(this,"beginDrag"));

			this.origin = new Point(0,0);
		},


		beginDrag: function(e) {
			if (!Util.leftClick(e)) {
				return true;
			}

			this.upConnection = on(win.doc,"mouseup",lang.hitch(this,"upHandler"));
			this.moveConnection = on(win.doc,"mousemove",lang.hitch(this,"moveHandler"));

			this.origin = Point.fromBrowserEvent(e);

			this.dragHandler.onBeginDrag(this.userArg);

			event.stop(e);
		},

		/**
		 * This is the handler that captures mousemove events when an element
		 * is being dragged. It is responsible for moving the element.
		 * @param {Event} e event (but not for IE)
		 * @return <code>false</code> to not propagate event for IE
		 * @type Boolean
		 **/
		moveHandler: function(e) {
			var p = Point.fromBrowserEvent(e);

			this.dragHandler.onDrag(new Size(p.getX()-this.origin.getX(),p.getY()-this.origin.getY()));

			event.stop(e);
		},

		/**
		 * This is the handler that captures the final mouseup event that
		 * occurs at the end of a drag
		 * @param {Event} e event (but not for IE)
		 * @return <code>false</code> to not propagate event for IE
		 * @type Boolean
		 **/
		upHandler: function(e) {
			this.moveConnection.remove();
			this.upConnection.remove();

			this.dragHandler.onEndDrag();

			this.origin = new Point(0,0);

			event.stop(e);
		}
	});

});
