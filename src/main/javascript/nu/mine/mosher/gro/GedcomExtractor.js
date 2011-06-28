/**
 * @fileoverview
 * Defines the {@link GedcomExtractor} class.
 */

(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gro.GedcomExtractor";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gro.Partnership");
	var Partnership = nu.mine.mosher.gro.Partnership;
	$.require("nu.mine.mosher.gro.Person");
	var Person = nu.mine.mosher.gro.Person;
	$.require("nu.mine.mosher.gro.model.TreeModel");
	var TreeModel = nu.mine.mosher.gro.model.TreeModel;
	$.require("nu.mine.mosher.gro.model.PartnershipModel");
	var PartnershipModel = nu.mine.mosher.gro.model.PartnershipModel;
	$.require("nu.mine.mosher.gro.model.PersonModel");
	var PersonModel = nu.mine.mosher.gro.model.PersonModel;
	$.require("nu.mine.mosher.gedcom.model.GedcomEvent");
	var GedcomEvent = nu.mine.mosher.gedcom.model.GedcomEvent;
	$.require("nu.mine.mosher.gedcom.model.Source");
	var Source = nu.mine.mosher.gedcom.model.Source;
	$.require("nu.mine.mosher.gedcom.model.Citation");
	var Citation = nu.mine.mosher.gedcom.model.Citation;
	$.require("nu.mine.mosher.gedcom.model.GedcomTag");
	var GedcomTag = nu.mine.mosher.gedcom.model.GedcomTag;
	$.require("nu.mine.mosher.gedcom.model.date.GedcomDateParser");
	var GedcomDateParser = nu.mine.mosher.gedcom.model.date.GedcomDateParser;
	$.require("nu.mine.mosher.gedcom.model.date.DatePeriod");
	var DatePeriod = nu.mine.mosher.gedcom.model.date.DatePeriod;
	$.require("nu.mine.mosher.gedcom.model.date.DateRange");
	var DateRange = nu.mine.mosher.gedcom.model.date.DateRange;
	$.require("nu.mine.mosher.gedcom.model.date.YMD");
	var YMD = nu.mine.mosher.gedcom.model.date.YMD;
	$.require("nu.mine.mosher.gfx.Selector");
	var Selector = nu.mine.mosher.gfx.Selector;
	$.require("nu.mine.mosher.gfx.Point");
	var Point = nu.mine.mosher.gfx.Point;
	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	var GedcomExtractor = $.declare(CLASS, null, {
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
		$.hitch(this, function(rect) {
			Util.forEach(this.mperson,function(person) {
				person.select(person.hit(rect));
			});
		}),
		$.hitch(this, function() {
			this.selection = [];
			this.selectionPartners = {};
			Util.forEach(this.mperson,$.hitch(this,function(person) {
				if (person.isSelected()) {
					this.selectPerson(person);
				}
			}));
		})
	);
},

selectPerson: function(person) {
	this.selection.push(person);
	Util.forEach(person.getChildIn(),$.hitch(this,function(part) {
		this.selectionPartners[part.getID()] = part;
	}));
	Util.forEach(person.getSpouseIn(),$.hitch(this,function(part) {
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

	Util.forEach(rchil, $.hitch(this,function(node) {
		if (node.line.getTag() === "SOUR") {
			this.msour[node.line.getID()] = this.extractSource(node);
		}
	}));
	Util.forEach(rchil, $.hitch(this,function(node) {
		if (node.line.getTag() === "INDI") {
			this.mperson[node.line.getID()] = this.extractPerson(node);
		}
	}));
	Util.forEach(rchil, $.hitch(this,function(node) {
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
	Util.forEach(repo.getChildren(), $.hitch(this,function(node) {
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
	Util.forEach(sour.getChildren(), $.hitch(this,function(node) {
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

	Util.forEach(sour.getChildren(), $.hitch(this,function(node) {
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
		if ($.indexOf(this.selection,hitPerson) < 0) {
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

})(window.dojo);
