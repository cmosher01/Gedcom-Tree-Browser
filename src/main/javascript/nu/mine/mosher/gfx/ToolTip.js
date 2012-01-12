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
	"dojo/window",
	"dojo/dom-construct",
	"dojo/on",
	"dojo/_base/event",
	"./Point",
	"nu/mine/mosher/util/Util"],

function(
	declare,
	lang,
	win,
	dojoWindow,
	domConstruct,
	on,
	event,
	Point,
	Util) {

	"use strict";

	return declare(null, {

		constructor: function(tipper,tipHTML) {
			this.tipHTML = tipHTML;
			this.div = null;
			this.moveConnection = null;

			on(tipper,"mouseout",lang.hitch(this,"hide"));
			on(tipper,"mouseover",lang.hitch(this,"show"));
		},

		show: function(e) {
			this.moveConnection = on(win.doc,"mousemove",lang.hitch(this,"moveToCursor"));
			this.div = domConstruct.create("div",{innerHTML:this.tipHTML,className:"tooltip",style:{position:"absolute",zIndex:20}},win.doc.body);
			this.div.style.width = Util.px(this.div.clientWidth);
			this.moveToCursor(e);
			event.stop(e);
		},

		hide: function(e) {
			if (this.div) {
				domConstruct.destroy(this.div);
				this.div = null;
				this.moveConnection.remove();
				this.moveConnection = null;
			}
			event.stop(e);
		},

		moveToCursor: function(e) {
			var p = Point.fromBrowserEvent(e);
			var under = new Point(p.getX()+10,p.getY()+10);
			var underoff = this.offscreen(under);
			var over = new Point(p.getX()-10-this.div.clientWidth,p.getY()-10-this.div.clientHeight);
			var overoff = this.offscreen(over);
			if (!underoff || overoff) {
				this.div.style.left = Util.px(under.getX());
				this.div.style.top = Util.px(under.getY());
			} else {
				this.div.style.left = Util.px(over.getX());
				this.div.style.top = Util.px(over.getY());
			}
			event.stop(e);
		},

		offscreen: function(p) {
			var vs = dojoWindow.getBox();
			var offleft = p.getX() < vs.l;
			var offtop = p.getY() < vs.t;
			var offright = p.getX()+this.div.clientWidth > vs.l+vs.w;
			var offbottom = p.getY()+this.div.clientHeight > vs.t+vs.h;
			return offleft || offtop || offright || offbottom;
		}

	});

});
