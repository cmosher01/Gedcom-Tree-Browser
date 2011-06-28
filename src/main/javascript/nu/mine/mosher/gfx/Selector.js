(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gfx.Selector";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gfx.Point");
	var Point = nu.mine.mosher.gfx.Point;
	$.require("nu.mine.mosher.gfx.Size");
	var Size = nu.mine.mosher.gfx.Size;
	$.require("nu.mine.mosher.gfx.Rect");
	var Rect = nu.mine.mosher.gfx.Rect;
	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	var Selector = $.declare(CLASS, null, {

		constructor: function(element,onselect,onselectfinished) {
			$.connect(element,"onmousedown",this,"beginDrag");
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
			if (e.clientX >= $.doc.documentElement.clientWidth || e.clientY >= $.doc.documentElement.clientHeight) {
				return true;
			}

			this.start = this.pos = Point.fromBrowserEvent(e);

			this.div = Util.createHtmlElement("div");
			this.div.className = "selector";
			this.div.style.position = "absolute";
			$.doc.body.appendChild(this.div);

			this.setDiv();

			this.onselect(this.rect);

			this.moveConnection = $.connect($.doc,"onmousemove",this,"moveHandler");
			this.upConnection = $.connect($.doc,"onmouseup",this,"upHandler");

			return $.stopEvent(e);
		},
		
		moveHandler: function(e) {
			this.pos = Point.fromBrowserEvent(e);

			this.setDiv();

			this.onselect(this.rect);

			return $.stopEvent(e);
		},
		
		upHandler: function(e) {
			$.disconnect(this.upConnection);
			$.disconnect(this.moveConnection);
		
			$.doc.body.removeChild(this.div);
		
			this.onselectfinished();
		
			return $.stopEvent(e);
		}
	});

})(window.dojo);
