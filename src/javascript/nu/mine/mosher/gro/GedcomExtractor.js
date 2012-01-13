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
 * Defines the {@link GedcomExtractor} class.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"nu/mine/mosher/util/Util",
	"nu/mine/mosher/gfx/Point",
	"nu/mine/mosher/gfx/Selector",
	"nu/mine/mosher/gedcom/model/date/YMD",
	"nu/mine/mosher/gedcom/model/date/DateRange",
	"nu/mine/mosher/gedcom/model/date/DatePeriod",
	"nu/mine/mosher/gedcom/model/date/GedcomDateParser",
	"nu/mine/mosher/gedcom/model/GedcomTag",
	"nu/mine/mosher/gedcom/model/GedcomEvent",
	"nu/mine/mosher/gedcom/model/Source",
	"nu/mine/mosher/gedcom/model/Citation",
	"./model/PersonModel",
	"./model/PartnershipModel",
	"./model/TreeModel",
	"./Person",
	"./Partnership"],

function(
	declare,
	lang,
	arr,
	Util,
	Point,
	Selector,
	YMD,
	DateRange,
	DatePeriod,
	GedcomDateParser,
	GedcomTag,
	GedcomEvent,
	Source,
	Citation,
	PersonModel,
	PartnershipModel,
	TreeModel,
	Person,
	Partnership) {



	return declare(null, {
/**
 * @class
 * Extracts needed data from a {@link GedcomTree}.
 * @requires Partnership
 * @requires Person
 * @requires GedcomEvent
 * @requires Point
 * @requires Util
 * 
 * @constructor
 * @param {GedcomTree} gedcomtree tree to extract data from
 * @return new {@link GedcomExtractor}
 * @type GedcomExtractor
 */
constructor: function(gedcomtree,container) {
	/**
	 * tree to extract from
	 * @private
	 * @type GedcomTree
	 */
	this.t = gedcomtree;

	this.msour = {};

	/**
	 * map of IDs to {@link Person}s.
	 * @private
	 * @type Object
	 */
	this.mperson = {};

	/**
	 * map of IDs to {@link Partnership}s.
	 * @private
	 * @type Object
	 */
	this.mpartnership = {};

	this.model = new TreeModel();

	this.container = container;

	// current selection of person objects
	this.selection = [];
	this.selectionPartners = {};

	this.extract();

	this.selector = new Selector(
		this.container,
		lang.hitch(this, function(rect) {
			Util.forEach(this.mperson,function(person) {
				person.select(person.hit(rect));
			});
		}),
		lang.hitch(this, function() {
			this.selection = [];
			this.selectionPartners = {};
			Util.forEach(this.mperson,lang.hitch(this,function(person) {
				if (person.isSelected()) {
					this.selectPerson(person);
				}
			}));
		})
	);
},

selectPerson: function(person) {
	this.selection.push(person);
	Util.forEach(person.getChildIn(),lang.hitch(this,function(part) {
		this.selectionPartners[part.getID()] = part;
	}));
	Util.forEach(person.getSpouseIn(),lang.hitch(this,function(part) {
		this.selectionPartners[part.getID()] = part;
	}));
},

/**
 * Calculates every {@link Partnership}.
 */
calc: function() {
	Util.forEach(this.mpartnership, function(p) {
		p.calc();
	});
},

/**
 * Extracts the data from the tree.
 * @private
 */
extract: function() {
	var rchil;
	rchil = this.t.getRoot().getChildren();

	Util.forEach(rchil, lang.hitch(this,function(node) {
		if (node.line.getTag() === "SOUR") {
			this.msour[node.line.getID()] = this.extractSource(node);
		}
	}));
	Util.forEach(rchil, lang.hitch(this,function(node) {
		if (node.line.getTag() === "INDI") {
			this.mperson[node.line.getID()] = this.extractPerson(node);
		}
	}));
	Util.forEach(rchil, lang.hitch(this,function(node) {
		if (node.line.getTag() === "FAM") {
			this.mpartnership[node.line.getID()] = this.extractParnership(node);
		}
	}));

	Util.forEach(this.mperson, function(indi) {
		indi.enlargeDropLine();
	});

	Util.forEach(this.mperson, function(indi) {
		indi.getEventsFromPartnerships();
	});
},

extractRepoName: function(repo) {
	var n;
	n = "";
	Util.forEach(repo.getChildren(), lang.hitch(this,function(node) {
		if (node.line.getTag() === "NAME") {
			n = node.line.getVal();
		}
	}));
	return n;
},

extractSource: function(sour) {
	var auth, titl, publ, repo, text;
	publ = titl = auth = "[unknown]";
	repo = text = "";
	Util.forEach(sour.getChildren(), lang.hitch(this,function(node) {
		if (node.line.getTag() === "AUTH") {
			auth = node.line.getVal();
		} else if (node.line.getTag() === "TITL") {
			titl = node.line.getVal();
		} else if (node.line.getTag() === "PUBL") {
			publ = node.line.getVal();
		} else if (node.line.getTag() === "TEXT") {
			text = node.line.getVal();
		} else if (node.line.getTag() === "REPO") {
			repo = this.extractRepoName(node.line.getRef());
		}
	}));
	if (repo.length > 0) {
		publ += " ("+repo+")";
	}
	return new Source(auth,titl,publ,text);
},

extractCitation: function(sour) {
	var sourrec = this.msour[sour.line.getPointer()];
	var text = "";
	var page = "";
	var quay = null;

	Util.forEach(sour.getChildren(), lang.hitch(this,function(node) {
		if (node.line.getTag() === "PAGE") {
			page = node.line.getVal();
		} else if (node.line.getTag() === "TEXT") {
			text = node.line.getVal();
		} else if (node.line.getTag() === "QUAY") {
			quay = parseInt(node.line.getVal(),10);
		}
	}));
	return new Citation(sourrec,text,page,quay);
},

/**
 * Extracts one {@link Person} from the given INDI node
 * @private
 * @param {TreeNode} indi
 * @return new {@link Person}
 * @type Person
 */
extractPerson: function(indi) {
	var that, nam, xy, m, revt, line, revtm, e, pm;

	that = this;

	nam = "[unknown]";
	revt = [];
	revtm = [];
	xy = new Point(0,0);
	Util.forEach(indi.getChildren(), function(node) {
		if (node.line.getTag() === "NAME") {
			nam = node.line.getVal().replace(/\//g,"");
		} else if (node.line.getTag() === "_XY") {
			m = /(\d+)\s+(\d+)/.exec(node.line.getVal());
			if (m !== null) {
				xy = new Point(m[1],m[2]);
			}
		} else if (GedcomTag.isIndiEvent(node.line.getTag())) {
			e = that.extractEvent(node);
			revt.push(e);
			revtm.push(e);
		}
	});

	line = indi.line;
	pm = new PersonModel(line.getID(),nam,xy,revtm);
	this.model.addPerson(pm);
	return new Person(pm,this,this.container);
},

/**
 * Extracts one {@link Partnership} from the given FAM node
 * @private
 * @param {TreeNode} fam
 * @return new {@link Partnership}
 * @type Partnership
 */
extractParnership: function(fam) {
	var that, husb, wife, rchil, revt, line, e, pm;
	var husbm, wifem, rchilm, revtm;
	that = this;
	husb = null;
	husbm = null;
	wife = null;
	wifem = null;
	rchil = [];
	rchilm = [];
	revt = [];
	revtm = [];
	Util.forEach(fam.getChildren(), function(node) {
		if (node.line.getTag() === "HUSB") {
			husb = that.mperson[node.line.getPointer()];
			husbm = that.model.mPerson[node.line.getPointer()];
		} else if (node.line.getTag() === "WIFE") {
			wife = that.mperson[node.line.getPointer()];
			wifem = that.model.mPerson[node.line.getPointer()];
		} else if (node.line.getTag() === "CHIL") {
			rchil.push(that.mperson[node.line.getPointer()]);
			rchilm.push(that.model.mPerson[node.line.getPointer()]);
		} else if (GedcomTag.isFamEvent(node.line.getTag())) {
			e = that.extractEvent(node);
			revt.push(e);
			revtm.push(e);
		}
	});
	line = fam.line;
	this.model.addPartnership(new PartnershipModel(line.getID(),husbm,wifem,rchilm,revtm));
	return new Partnership(line.getID(),husb,wife,rchil,revt,this.container);
},

/**
 * Extracts one {@link GedcomEvent} from the given event node
 * @private
 * @param {TreeNode} evt
 * @return new {@link GedcomEvent}
 * @type GedcomEvent
 */
extractEvent: function(evt) {
	var that, typ, gdate, place, note, cit;
	that = this;
	gdate = DatePeriod.UNKNOWN;
	place = "";
	note = "";
	typ = this.extractEventName(evt);
	cit = null;
	Util.forEach(evt.getChildren(), function(node) {
		if (node.line.getTag() === "DATE") {
			gdate = that.extractDate(node.line.getVal());
		} else if (node.line.getTag() === "PLAC") {
			place = node.line.getVal();
		} else if (node.line.getTag() === "SOUR") {
			cit = that.extractCitation(node);
		} else if (node.line.getTag() === "NOTE") {
			if (node.line.isPointer()) {
				note = node.line.getRef().line.getVal();
			} else {
				note = node.line.getVal();
			}
		}
	});
	return new GedcomEvent(typ,gdate,place,cit,note);
},

/**
 * Extracts (constructs) the event-name for the given event node.
 * @param evt
 * @private
 * @param {TreeNode} evt
 * @return event name
 * @type String
 */
extractEventName: function(evt) {
	var nam, val;
	nam = "";
	val = "";

	if (evt.line.getTag() === "EVEN") {
		Util.forEach(evt.getChildren(), function(node) {
			if (node.line.getTag() === "TYPE") {
				nam = node.line.getVal();
			}
		});
	}
	if (!nam) {
		nam = GedcomTag.getEventName(evt.line.getTag());
		val = evt.line.getVal();
		if (val) {
			nam += ": "+val;
		}
	}
	return nam;
},

/**
 * Extracts a {@link DatePeriod} from a given GEDCOM date string.
 * @param {String} s GEDCOM date string to parse
 * @return {@link DatePeriod}
 * @type DatePeriod
 */
extractDate: function(s) {
	var r, ymd, rng;
	r = null;
	try {
		r = GedcomDateParser.parse(s);
	} catch (e) {
		r = null;
	}
	if (YMD.isParsedYMD(r)) {
		ymd = YMD.fromParserResult(r);
		rng = new DateRange(ymd,ymd);
		return new DatePeriod(rng,rng);
	}
	if (DateRange.isParsedDateRange(r)) {
		rng = DateRange.fromParserResult(r);
		return new DatePeriod(rng,rng);
	}
	if (DatePeriod.isParsedDatePeriod(r)) {
		return DatePeriod.fromParserResult(r);
	}
	return DatePeriod.UNKNOWN;
},

onBeginDrag: function(hitPerson) {
	if (this.selection.length > 0) {
		if (arr.indexOf(this.selection,hitPerson) < 0) {
			Util.forEach(this.selection,function(person) {
				person.select(false);
			});
			this.selection = [];
			this.selectionPartners = {};
		}
	}
	this.tempSelection = false;
	if (this.selection.length == 0) {
		this.selectPerson(hitPerson);
		this.tempSelection = true;
	}
	Util.forEach(this.selection,function(person) {
		person.onBeginDrag();
	});
},

onDrag: function(delta) {
	if (this.selection.length > 0) {
		Util.forEach(this.selection,function(person) {
			person.onDrag(delta);
		});
		Util.forEach(this.selectionPartners,function(partnership) {
			partnership.calc();
		});
	}
},

onEndDrag: function() {
	if (this.selection.length > 0) {
		Util.forEach(this.selection,function(person) {
			person.onEndDrag();
		});
	}
	if (this.tempSelection) {
		this.selection = [];
		this.selectionPartners = {};
		this.tempSelection = false;
	}
}
	});

});
