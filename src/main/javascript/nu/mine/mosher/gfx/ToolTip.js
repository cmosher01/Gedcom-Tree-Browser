(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gfx.ToolTip";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gfx.Point");
	var Point = nu.mine.mosher.gfx.Point;
	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	// Load the window-related functions:
	$.require("dojo.window");

	var ToolTip = $.declare(CLASS, null, {

		constructor: function(tipper,tipHTML) {
			this.tipHTML = tipHTML;
			this.div = null;
			this.moveConnection = null;

			$.connect(tipper,"onmouseover",this,"show");
			$.connect(tipper,"onmouseout",this,"hide");
		},

		show: function(e) {
			this.moveConnection = $.connect($.doc,"onmousemove",this,"moveToCursor");
			this.div = $.create("div",{innerHTML:this.tipHTML,className:"tooltip",style:{position:"absolute",zIndex:20}},$.doc.body);
			this.div.style.width = Util.px(this.div.clientWidth);
			this.moveToCursor(e);
			return $.stopEvent(e);
		},

		hide: function(e) {
			if (this.div) {
				$.destroy(this.div);
				this.div = null;
				$.disconnect(this.moveConnection);
				this.moveConnection = null;
			}
			if (e) {
				return $.stopEvent(e);
			}
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
			return $.stopEvent(e);
		},

		offscreen: function(p) {
			var vs = $.window.getBox();
			var offleft = p.getX() < vs.l;
			var offtop = p.getY() < vs.t;
			var offright = p.getX()+this.div.clientWidth > vs.l+vs.w;
			var offbottom = p.getY()+this.div.clientHeight > vs.t+vs.h;
			return offleft || offtop || offright || offbottom;
		}
	});
})(window.dojo);
