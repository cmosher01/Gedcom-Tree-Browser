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
 * Defines the {@link Partnership} class.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"nu/mine/mosher/util/Util",
	"nu/mine/mosher/gfx/Point",
	"nu/mine/mosher/gfx/Size",
	"nu/mine/mosher/gfx/Rect"],

function(
	declare,
	lang,
	Util,
	Point,
	Size,
	Rect) {

	"use strict";

	var Partnership = declare(null, {
/**
 * @class
 * Represents a family in the family tree.
 * 
 * @constructor
 * @param {String} gid ID of this {@link Partnership}
 * @param {Person} husb husband in this {@link Partnership}
 * @param {Person} wife wife in this {@link Partnership}
 * @param {Array} rchil array of children {@link Person}s for this {@link Partnership}.
 * @param {Array} revt array of {@link GedcomEvent}s for this {@link Partnership}.
 * @return new {@link Partnership}
 * @type Partnership
 */
constructor: function(gid,husb,wife,rchil,revt,container) {
	/**
	 * ID of this person
	 * @private
	 * @type String
	 */
	this.id = gid;

	/**
	 * husband
	 * @private
	 * @type Person
	 */
	this.husb = husb;

	/**
	 * wife
	 * @private
	 * @type Person
	 */
	this.wife = wife;

	/**
	 * children {@link Person}s
	 * @private
	 * @type Array
	 */
	this.rchil = rchil;

	/**
	 * {@link GedcomEvent}s
	 * @private
	 * @type Array
	 */
	this.revt = revt;

	this.container = container;



	if (this.husb !== null) {
		this.husb.addSpouseIn(this);
	}

	if (this.wife !== null) {
		this.wife.addSpouseIn(this);
	}

	Util.forEach(this.rchil, lang.hitch(this,function(c) {
		c.addChildIn(this);
	}));

	this.divLeft = this.createDiv();
	this.divRight = this.createDiv();

	this.divChild = [];
	Util.forEach(rchil, lang.hitch(this,function() {
		this.divChild.push(this.createDiv());
	}));

	if (this.divChild.length > 0) {
		this.divChildConn = this.createDiv();
	} else {
		this.divChildConn = null;
	}

	this.calc();
},

getID: function() {
	return this.id;
},

/**
 * Gets the array of {@link GedcomEvent}s for this {@link Partnership}.
 * @return events
 * @type Array
 */
getEvents: function() {
	return this.revt;
},

/**
 * Creates and displays a new DIV with "partnership" class
 * @private
 * @return new DIV
 * @type HTMLElement
 */
createDiv: function() {
	var div;
	div = Util.createHtmlElement("div");
	div.className = "partnership";
	div.style.position = "absolute";
	this.container.appendChild(div);
	return div;
},

/**
 * Calculates this {@link Partnership} for display on the drop line chart.
 */
calc: function() {
	var mx;
	var my;
	var rmy;
	var lmy;
	var lmx;
	var rmx;
	var by;
	var ic;
	var child;
	var crect;
	var cy;
	var rectLeft;
	var rectRight;
	var rtemp;



	// find topmost child
	my = Number.MAX_VALUE;
	Util.forEach(this.rchil, function(chil) {
		cy = chil.getRect().getTop();
		if (cy < my) {
			my = cy;
		}
	});
	my -= 15; // 15 is distance of child bar above children



	// get two parent rects (calc if missing)
	rectLeft = rectRight = null;
	if (this.husb != null && this.wife != null) {
		rectLeft = this.husb.getRect();
		rectRight = this.wife.getRect();
	} else if (this.wife != null && this.husb == null) {
		rectLeft = this.wife.getRect();
		rectRight = Partnership.phantomSpouse(rectLeft);
	} else if (this.husb != null && this.wife == null) {
		rectLeft = this.husb.getRect();
		rectRight = Partnership.phantomSpouse(rectLeft);
	}

	if (rectLeft != null && rectRight != null) {
		// make sure rectLeft is to the LEFT of rectRight
		if (rectRight.getMidX() < rectLeft.getMidX()) {
			rtemp = rectLeft;
			rectLeft = rectRight;
			rectRight = rtemp;
		}

		lmx = rectLeft.getMidX();
		rmx = rectRight.getMidX();
		mx = Partnership.getDescenderX(rectLeft,rectRight);

		lmy = rectLeft.getMidY()-Partnership.getMarBarHalfHeight();
		rmy = rectRight.getMidY()-Partnership.getMarBarHalfHeight();
		by = Math.max(rmy,lmy); // bottom of parents

		Partnership.setRect(this.divLeft,lmx,null,mx,null,rmy,null,lmy,Partnership.getSpouseLine());
		Partnership.setRect(this.divRight,mx,Partnership.getChildLine(),rmx,null,rmy,Partnership.getSpouseLine(),lmy,null);

	} else {
		// children with no parents
		mx = this.rchil[0].getRect().getMidX(); // mid x of any child
		by = my;
	}

	for (ic = 0; ic < this.rchil.length; ic++) {
		child = this.rchil[ic];
		crect = child.getRect();

		Partnership.setRect(this.divChild[ic],crect.getMidX(),Partnership.getChildLine(),mx,null,my,Partnership.getChildLine(),crect.getTop(),null);
	}

	if (this.divChildConn) {
		Partnership.setRect(this.divChildConn,mx,Partnership.getChildLine(),mx+3,null,by,null,my,null);
	}
}


	});

/**
 * @private
 * @return border CSS style for child lines
 * @type String
 */
Partnership.getChildLine = function() {
	return "solid 1px";
};

/**
 * @private
 * @return border CSS style for partnership lines
 * @type String
 */
Partnership.getSpouseLine = function() {
	var h = 2*Partnership.getMarBarHalfHeight();
	return "double "+h+"px";
};

/**
 * @private
 * @return half of height of partnership lines (in pixels)
 * @type Number
 */
Partnership.getMarBarHalfHeight = function() {
	return 2;
};

/**
 * @private
 * @return minimum width of one person's side of a partnership line
 * @type Number
 */
Partnership.getMarChildDistance = function() {
	return 10;
};

/**
 * Calculates a phantom location for a missing spouse on the drop-line chart.
 * @private
 * @param {Rect} rect location of known spouse
 * @return new location
 * @type Rect
 */
Partnership.phantomSpouse = function(rect) {
	return new Rect(
		new Point(rect.getRight()+2*Partnership.getMarChildDistance()+1,rect.getTop()),
		new Size(3,rect.getHeight()));
};

/**
 * Calculates x-coordinate of the child-descent line for the given two spouses' locations.
 * @param rectLeft location of one spouse
 * @param rectRight location of the other spouse
 * @return the x-coordinate for the child-descent line
 * @type Number
 */
Partnership.getDescenderX = function(rectLeft,rectRight) {
	var mx;
	// try hanging it off the right of the LEFT rect
	mx = rectLeft.getRight()+Partnership.getMarChildDistance();
	// but if that doesn't work for the RIGHT rect
	if (!(mx+Partnership.getMarChildDistance() < rectRight.getLeft() || rectRight.getRight()+Partnership.getMarChildDistance() < mx)) {
		// then hang it off the right of the RIGHT rect instead
		mx = rectRight.getRight()+Partnership.getMarChildDistance();
	}
	return mx;
};

/**
 * Sets DIV's left/right pos/borders. Will swap left/right if necessary.
 * @param {HTMLElement} div
 * @param {Number} xLeft x-coordinate of left side
 * @param {String} borderLeft CSS style for left border, or <code>null</code>
 * @param {Number} xRight x-coordinate of right side
 * @param {String} borderRight CSS style for right border, or <code>null</code>
 */
Partnership.setX = function(div,xLeft,borderLeft,xRight,borderRight) {
	var t;
	var style = div.style;

	if (xRight < xLeft) {
		t = xRight;
		xRight = xLeft;
		xLeft = t;
		t = borderLeft;
		borderLeft = borderRight;
		borderRight = t;
	}
	style.left = Util.px(xLeft);
	style.borderLeft = borderLeft ? borderLeft : "none";
	style.width = Util.px(Math.max(0,xRight-xLeft));
	style.borderRight = borderRight ? borderRight : "none";
};

/**
 * Sets DIV's top/bottom pos/borders. Will swap top/bottom if necessary.
 * @param {HTMLElement} div
 * @param {Number} yTop y-coordinate of top side
 * @param {String} borderTop CSS style for top border, or <code>null</code>
 * @param {Number} yBottom y-coordinate of bottom side
 * @param {String} borderBottom CSS style for bottom border, or <code>null</code>
 */
Partnership.setY = function(div,yTop,borderTop,yBottom,borderBottom) {
	var t;
	var style = div.style;

	if (yBottom < yTop) {
		t = yBottom;
		yBottom = yTop;
		yTop = t;
		t = borderTop;
		borderTop = borderBottom;
		borderBottom = t;
	}
	style.top = Util.px(yTop);
	style.borderTop = borderTop ? borderTop : "none";
	style.height = Util.px(Math.max(0,yBottom-yTop));
	style.borderBottom = borderBottom ? borderBottom : "none";
};

/**
 * Sets DIV's sides and borders as appropriate for the given coordinates and borders.
 * @param {HTMLElement} div
 * @param x1 x-coordinate of one side
 * @param borderX1 CSS style for x1 side border, or <code>null</code>
 * @param x2 x-coordinate of the other side
 * @param borderX2 CSS style for x2 side border, or <code>null</code>
 * @param y1 y-coordinate of one side
 * @param borderY1 CSS style for y1 side border, or <code>null</code>
 * @param y2 y-coordinate of the other side
 * @param borderY2 CSS style for y2 side border, or <code>null</code>
 */
Partnership.setRect = function(div,x1,borderX1,x2,borderX2,y1,borderY1,y2,borderY2) {
	Partnership.setX(div,x1,borderX1,x2,borderX2);
	Partnership.setY(div,y1,borderY1,y2,borderY2);
};

return Partnership;

});
