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
 * @fileoverview Defines the {@link GedcomTag} class.
 */

define(["dojo/_base/declare"],
function(declare) {

	"use strict";

	var GedcomTag = declare(null, {
		/**
		 * @class Contains static GEDCOM event tag methods.
		 * @constructor
		 * @return never returns
		 * @type GedcomTag
		 * @throws always throws an error
		 */
		constructor: function() {
			throw new Error("cannot instantiate");
		}
	});

	/**
	 * Returns <code>true</code> if the given tag is a
	 * GEDCOM individual event tag.
	 * @param {String} tag
	 * @returns if this is an individual event tag
	 * @type Boolean
	 */
	GedcomTag.isIndiEvent = function(tag) {
		return this.indiEvent.hasOwnProperty(tag);
	};
	
	/**
	 * Returns <code>true</code> if the given tag is a
	 * GEDCOM family event tag.
	 * @param {String} tag
	 * @returns if this is a family event tag
	 * @type Boolean
	 */
	GedcomTag.isFamEvent = function(tag) {
		return this.famEvent.hasOwnProperty(tag);
	};
	
	/**
	 * Gets the name of the given GEDCOM event tag.
	 * @param {String} tag
	 * @returns name
	 * @type String
	 */
	GedcomTag.getEventName = function(tag) {
		var nam;
		nam = GedcomTag.indiEvent[tag];
		if (!nam) {
			nam = GedcomTag.famEvent[tag];
		}
		return nam;
	};
	
	/**
	 * Maps GEDCOM individual events to names.
	 * @private
	 * @type Object
	 */
	GedcomTag.indiEvent = {};
	
	GedcomTag.indiEvent["BIRT"] = "birth";
	GedcomTag.indiEvent["CHR" ] = "christening";
	GedcomTag.indiEvent["DEAT"] = "death";
	GedcomTag.indiEvent["BURI"] = "reposition";
	GedcomTag.indiEvent["CREM"] = "cremation";
	GedcomTag.indiEvent["ADOP"] = "adoption";
	GedcomTag.indiEvent["BAPM"] = "baptism";
	GedcomTag.indiEvent["BARM"] = "bar mitzvah";
	GedcomTag.indiEvent["BASM"] = "bas mitzvah";
	GedcomTag.indiEvent["BLES"] = "blessing";
	GedcomTag.indiEvent["CHRA"] = "adult christening";
	GedcomTag.indiEvent["CONF"] = "confirmation";
	GedcomTag.indiEvent["FCOM"] = "first communion";
	GedcomTag.indiEvent["ORDN"] = "ordination";
	GedcomTag.indiEvent["NATU"] = "naturalization";
	GedcomTag.indiEvent["EMIG"] = "emigration";
	GedcomTag.indiEvent["IMMI"] = "immigration";
	GedcomTag.indiEvent["CENS"] = "census";
	GedcomTag.indiEvent["PROB"] = "will probated";
	GedcomTag.indiEvent["WILL"] = "signed will";
	GedcomTag.indiEvent["GRAD"] = "graduated";
	GedcomTag.indiEvent["RETI"] = "retirement";
	GedcomTag.indiEvent["EVEN"] = "[unknown]";
	GedcomTag.indiEvent["CAST"] = "caste";
	GedcomTag.indiEvent["DSCR"] = "description";
	GedcomTag.indiEvent["EDUC"] = "education";
	GedcomTag.indiEvent["IDNO"] = "national ID";
	GedcomTag.indiEvent["NATI"] = "national origin";
	GedcomTag.indiEvent["NCHI"] = "count of children";
	GedcomTag.indiEvent["NMR" ] = "count of marriages";
	GedcomTag.indiEvent["OCCU"] = "occupation";
	GedcomTag.indiEvent["PROP"] = "posession";
	GedcomTag.indiEvent["RELI"] = "religion";
	GedcomTag.indiEvent["RESI"] = "residence";
	GedcomTag.indiEvent["SSN" ] = "US Social Security number";
	GedcomTag.indiEvent["TITL"] = "title";
	
	/**
	 * Maps GEDCOM family events to names.
	 * @private
	 * @type Object
	 */
	GedcomTag.famEvent = {};
	
	GedcomTag.famEvent["ANUL"]  = "annulment";
	GedcomTag.famEvent["CENS"]  = "census";
	GedcomTag.famEvent["DIV" ]  = "divorce";
	GedcomTag.famEvent["DIVF"]  = "divorce filed";
	GedcomTag.famEvent["ENGA"]  = "engagement";
	GedcomTag.famEvent["MARR"]  = "marriage";
	GedcomTag.famEvent["MARB"]  = "marriage bann";
	GedcomTag.famEvent["MARC"]  = "marriage contract";
	GedcomTag.famEvent["MARL"]  = "marriage license";
	GedcomTag.famEvent["MARS"]  = "marriage settlement";
	GedcomTag.famEvent["EVEN"]  = "[unknown]";

	return GedcomTag;

});
