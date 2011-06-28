/**
 * @fileoverview Defines the {@link GedcomTag} class.
 */

(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gedcom.model.GedcomTag";

	$.provide(CLASS);

	var GedcomTag = $.declare(CLASS, null, {

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

})(window.dojo);
