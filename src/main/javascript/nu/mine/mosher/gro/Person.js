
/**
 * @fileoverview
 * Defines the {@link Person} class.
 */

(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gro.Person";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gro.Partnership");
	var Partnership = nu.mine.mosher.gro.Partnership;
	$.require("nu.mine.mosher.gedcom.model.GedcomEvent");
	var GedcomEvent = nu.mine.mosher.gedcom.model.GedcomEvent;
	$.require("nu.mine.mosher.gfx.Dragger");
	var Dragger = nu.mine.mosher.gfx.Dragger;
	$.require("nu.mine.mosher.gfx.Rect");
	var Rect = nu.mine.mosher.gfx.Rect;
	$.require("nu.mine.mosher.gfx.Point");
	var Point = nu.mine.mosher.gfx.Point;
	$.require("nu.mine.mosher.gfx.Size");
	var Size = nu.mine.mosher.gfx.Size;
	$.require("nu.mine.mosher.gfx.ToolTip");
	var ToolTip = nu.mine.mosher.gfx.ToolTip;
	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	var Person = $.declare(CLASS, null, {

/**
 * @class Represents a person in a family tree.
 * 
 * @constructor
 * @return new {@link Person}
 * @type Person
 */
constructor: function(model,dragHandler,container) {
	this.model = model;

	/**
	 * Array of {@link Partnership}s that this {@link Person} is a child in. Could be more than one to allow for adoptive parents.
	 * @private
	 * @type Array
	 */
	this.childIn = [];

	/**
	 * Array of {@link Partnership}s that this {@link Person} is a spouse in.
	 * @private
	 * @type Array
	 */
	this.spouseIn = [];

	this.container = container;

	this.tooltips = []; // just so we can close them upon shrinking

	/**
	 * non-expanded display DIV of this {@link Person}
	 * @private
	 * @type HTMLElement
	 */
	this.div = this.createDiv(this.model.getPos());

	/**
	 * expanded display DIV of this {@link Person}
	 * @private
	 * @type HTMLElement
	 */
	this.divExp = this.createDivExp(this.model.getPos());

	/**
	 * @private
	 * @type Boolean
	 */
	this.viewExpanded = false;

	/**
	 * @private
	 * @type Boolean
	 */
	this.ignoreNextClick = false;
	
	this.div.onclick = $.hitch(this, function() {
		if (this.ignoreNextClick) {
			this.ignoreNextClick = false;
		} else {
			this.toggleView();
		}
	});

	this.divExp.onclick = this.div.onclick;

	/**
	 * @private
	 * @type Boolean
	 */
	this.savedZ = false;
	this.div.dragger = new Dragger(this.div,dragHandler,this);
	this.divExp.dragger = new Dragger(this.divExp,dragHandler,this);

	/**
	 * currently displayed DIV (<code>this.div</code> or <code>this.divExp</code>)
	 * @private
	 * @type HTMLElement
	 */
	this.divCur = this.div;

	this.sel = false;
},

/**
 * Gets the ID of this {@link Person}.
 * @return ID
 * @type String
 */
getID: function() {
	return this.model.getID();
},

/**
 * Gets the name of this {@link Person}.
 * @return name
 * @type String
 */
toString: function() {
	return this.model.getName();
},

/**
 * Gets the Array of {@link Partnership}s that this {@link Person} is a child in.
 * @return child in {@link Partnership}s
 * @type Array
 */
getChildIn: function() {
	return this.childIn;
},

/**
 * Gets the Array of {@link Partnership}s that this {@link Person} is a spouse in.
 * @return spouse in {@link Partnership}s
 * @type Array
 */
getSpouseIn: function() {
	return this.spouseIn;
},

/**
 * Adds the given {@link Partnership} to this {@link Person}, where this person is
 * a spouse.
 * @param {Partnership} f spouse in {@link Partnership} to add
 */
addSpouseIn: function(f) {
	this.spouseIn.push(f);
},

/**
 * Adds the given {@link Partnership} to this {@link Person}, where this person is
 * a child.
 * @param {Partnership} f child in {@link Partnership} to add
 */
addChildIn: function(f) {
	this.childIn.push(f);
},

/**
 * Gets the Array of {@link GedcomEvent}s for this {@link Person}.
 * @return array in {@link GedcomEvent}s
 * @type Array
 */
getEvents: function() {
	return this.model.getEvents();
},

/**
 * Creates a new DIV element for this {@link Person}'s non-expanded
 * display in the drop-line chart.
 * @private
 * @param {Point} pos position of upper-left corner
 * @return new div for non-expanded display
 * @type HTMLElement
 */
createDiv: function(pos) {
	var div;
	div = Util.createHtmlElement("div");

	div.className = "person";
	div.style.zIndex = 1;

	div.style.position = "absolute";
	div.tabindex = 0;
	div.style.left = Util.px(0);
	div.style.top = Util.px(0);
	div.style.textAlign = "center";
	div.style.visiblity = "hidden";
	div.appendChild($.doc.createTextNode(this.model.getName()));

	this.container.appendChild(div);

	div.style.width = Util.px(div.clientWidth);
	div.style.left = Util.px(pos.getX());
	div.style.top = Util.px(pos.getY());
	div.style.visiblity = "visible";

	return div;
},

/**
 * Creates a new DIV element for this {@link Person}'s expanded
 * display in the drop-line chart.
 * @private
 * @param {Point} pos position of upper-left corner
 * @return new div for expanded display
 * @type HTMLElement
 */
createDivExp: function(pos) {
	var div;
	div = Util.createHtmlElement("div");

	div.className = "person expanded-person";
	div.style.zIndex = 9;

	div.style.position = "absolute";
	div.tabindex = 0;
	div.style.left = Util.px(pos.getX());
	div.style.top = Util.px(pos.getY());
	div.style.visiblity = "hidden";
	div.appendChild($.doc.createTextNode(this.model.getName()));


	return div;
},

/**
 * Gets the current bounding rectangle of this {@link Person} on the drop-line chart.
 * @return current bounds
 * @type Rect
 */
getRect: function() {
	return Rect.ofDiv(this.divCur);
},

/**
 * Checks if this person intersects the given rectangle.
 * @param {Rect} rect
 * @return if this person intersects
 * @type Boolean
 */
hit: function(rect) {
	return Rect.intersect(this.getRect(),rect);
},

select: function(sel) {
	this.sel = sel;
	if (this.sel) {
		$.addClass(this.div,"selected-person");
		$.addClass(this.divExp,"selected-person");
	} else {
		$.removeClass(this.div,"selected-person");
		$.removeClass(this.divExp,"selected-person");
	}
},

isSelected: function() {
	return this.sel;
},

onBeginDrag: function() {
	this.divX = parseInt(this.div.style.left,10);
	this.divY = parseInt(this.div.style.top,10);
},

onDrag: function(delta) {
	this.div.style.left = this.divExp.style.left = Util.px(this.divX + delta.getWidth());
	this.div.style.top = this.divExp.style.top = Util.px(this.divY + delta.getHeight());

	this.ignoreNextClick = true;
	if (!this.savedZ) {
		this.savedZ = this.divCur.style.zIndex;
		this.divCur.style.zIndex = 10;
	}
	this.calc();
},

onEndDrag: function() {
	if (this.savedZ) {
		this.divCur.style.zIndex = this.savedZ;
		this.savedZ = false;
	}
},

/**
 * Calculates this {@link Person}'s related {@link Partnership}s.
 */
calc: function() {
	this.enlargeDropLine();
},

enlargeDropLine: function() {
	var dl, dlWidth, dlHeight, right, bottom;
	dl = this.container;
	dlWidth = dl.offsetWidth;
	right = this.divCur.offsetLeft+this.divCur.offsetWidth;
	dlHeight = dl.offsetHeight;
	bottom = this.divCur.offsetTop+this.divCur.offsetHeight;
	if (right > dlWidth || bottom > dlHeight) {
		dlWidth = Math.max(right,dlWidth);
		dl.style.width = Util.px(dlWidth);
		$.query("html")[0].style.width = Util.px(dlWidth);
		$.doc.body.style.width = Util.px(dlWidth);
		dlHeight = Math.max(bottom,dlHeight);
		dl.style.height = Util.px(dlHeight);
	}
},

/**
 * Toggles the display of this {@link Person} between expanded and
 * non-expanded. 
 */
toggleView: function() {
	if (this.viewExpanded) {
		this.viewExpanded = false;
		this.divExp.parentNode.replaceChild(this.div,this.divExp);
		this.divCur = this.div;
	} else {
		this.viewExpanded = true;
		this.div.parentNode.replaceChild(this.divExp,this.div);
		this.divCur = this.divExp;
	}
	Util.forEach(this.childIn,function(partnership) {
		partnership.calc();
	});
	Util.forEach(this.spouseIn,function(partnership) {
		partnership.calc();
	});
	this.calc();
	Util.forEach(this.tooltips,function(tt) {
		tt.hide();
	});
},

/**
 * Creates an HTML TABLE of this this {@link Person}'s events.
 * @private
 * @returns {HTMLElement}
 */
createEventTable: function() {
	var table, thead, tfoot, tbody, tr, td;

	table = $.create("table",{className:"events"});
		thead = $.create("thead",null,table);
			tr = $.create("tr",null,thead);
				td = $.create("th",{innerHTML:"event"},tr);
				td = $.create("th",{innerHTML:"date" },tr);
				td = $.create("th",{innerHTML:"place"},tr);
				td = $.create("th",{innerHTML:"note"},tr);
				td = $.create("th",{innerHTML:"citation"},tr);
		tfoot = $.create("tfoot",null,table);
		tbody = $.create("tbody",null,table);
			Util.forEach(this.model.getEvents(), $.hitch(this,function(evt) {
				var note, ttip, cit;
				tr = $.create("tr",null,tbody);
					td = $.create("td",{innerHTML:evt.getType()},tr);
					td = $.create("td",{innerHTML:evt.getDate()},tr);
					td = $.create("td",{innerHTML:evt.getPlace()},tr);
					note = evt.getNote();
					if (note.length == 0) {
						td = $.create("td",null,tr);
					} else {
						td = $.create("td",{innerHTML:"*"},tr);
						ttip = new ToolTip(td,note);
						this.tooltips.push(ttip);
					}
					cit = evt.getCitation();
					if (cit) {
						td = $.create("td",{innerHTML:cit.getSource().getTitle()},tr);
						ttip = new ToolTip(td,cit.getSource().getHtml());
						this.tooltips.push(ttip);
					} else {
						td = $.create("td",null,tr);
					}
			}));

	return table;
},

getEventsFromPartnerships: function() {
	var e;

	Util.forEach(this.spouseIn, $.hitch(this, function(part) {
		Util.forEach(part.getEvents(), $.hitch(this, function(evt) {
			this.model.getEvents().push(evt);
		}));
	}));

	this.model.getEvents().sort(GedcomEvent.order);

	e = this.createEventTable();
	this.divExp.appendChild(e);

	this.divExp.style.visiblity = "hidden";
	var x = this.divExp.style.left;
	var y = this.divExp.style.top;
	this.divExp.style.left = Util.px(0);
	this.divExp.style.top = Util.px(0);
	this.container.appendChild(this.divExp);
	this.divExp.style.width = Util.px(this.divExp.clientWidth);
	this.divExp.style.left = x;
	this.divExp.style.top = y;
	this.container.removeChild(this.divExp);
	this.divExp.style.visiblity = "visible";
}
	});

})(window.dojo);
