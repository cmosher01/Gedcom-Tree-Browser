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
	"dojo/dom-construct",
	"./Point",
	"./Size",
	"./Rect",
	"nu/mine/mosher/util/Util"],

function(
	declare,
	lang,
	win,
	on,
	event,
	domConstruct,
	Point,
	Size,
	Rect,
	Util) {

	"use strict";

	return declare(null, {

		constructor: function(element,onselect,onselectfinished) {
			on(element,"mousedown",lang.hitch(this,"beginDrag"));
			this.div = null;
			this.start = new Point(0,0);
			this.onselect = onselect;
			this.onselectfinished = onselectfinished;
			this.rect = new Rect(new Point(0,0), new Size(0,0));
		},

		setDiv: function() {
			this.rect = new Rect(
					new Point(
						Math.min(this.start.getX(),this.pos.getX()),
						Math.min(this.start.getY(),this.pos.getY())
					),
					new Size(
						Math.abs(this.pos.getX()-this.start.getX()),
						Math.abs(this.pos.getY()-this.start.getY())
					)
				);
			this.div.style.left = Util.px(this.rect.getPos().getX());
			this.div.style.top = Util.px(this.rect.getPos().getY());
			this.div.style.width = Util.px(this.rect.getSize().getWidth());
			this.div.style.height = Util.px(this.rect.getSize().getHeight());
		},

		beginDrag: function(e) {
			if (!Util.leftClick(e)) {
				return true;
			}
			if (e.clientX >= win.doc.documentElement.clientWidth || e.clientY >= win.doc.documentElement.clientHeight) {
				return true;
			}

			this.start = this.pos = new Point(e.pageX,e.pageY);

			this.div = domConstruct.create("div");
			this.div.className = "selector";
			this.div.style.position = "absolute";
			win.doc.body.appendChild(this.div);

			this.setDiv();

			this.onselect(this.rect);

			this.moveConnection = on(win.doc,"mousemove",lang.hitch(this,"moveHandler"));
			this.upConnection = on(win.doc,"mouseup",lang.hitch(this,"upHandler"));

			event.stop(e);
		},

		moveHandler: function(e) {
			this.pos = new Point(e.pageX,e.pageY);

			this.setDiv();

			this.onselect(this.rect);

			event.stop(e);
		},

		upHandler: function(e) {
			this.upConnection.remove();
			this.moveConnection.remove();

			win.doc.body.removeChild(this.div);

			this.onselectfinished();

			event.stop(e);
		}

	});

});
