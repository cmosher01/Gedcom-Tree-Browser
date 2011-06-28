/**
 * @fileoverview
 * Defines the {@link GedcomEvent} class.
 */

(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gedcom.model.GedcomEvent";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gedcom.model.date.DatePeriod");
	var DatePeriod = nu.mine.mosher.gedcom.model.date.DatePeriod;
	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	var GedcomEvent = $.declare(CLASS, null, {

		/**
		 * @class Represents a GEDCOM event record.
		 * @requires Util
		 * 
		 * @constructor
		 * @param {String} typ type of this {@link GedcomEvent} (such as "birth" or "death")
		 * @param {DatePeriod} gdate GEDCOM date of this {@link GedcomEvent}.
		 * @param {String} place place of this {@link GedcomEvent}.
		 * @return new {@link GedcomEvent}
		 * @type GedcomEvent
		 */
		constructor: function(typ,gdate,place,citation,note) {
			/**
			 * type of event
			 * @private
			 * @type String
			 */
			this.typ = Util.safeStr(typ);
			if (this.typ.length == 0) {
				this.typ = "[unknown]";
			}
		
			/**
			 * date of this event
			 * @private
			 * @type String
			 */
			this.gdate = gdate;
			if (!this.gdate) {
				throw new Error("date must be specified");
			}
		
			/**
			 * place of this event
			 * @private
			 * @type String
			 */
			this.place = Util.safeStr(place);
			if (this.place.length == 0) {
				this.place = "[unknown]";
			}

			this.citation = citation;
			this.note = Util.safeStr(note);
		},
		
		/**
		 * Gets the type of this {@link GedcomEvent}.
		 * @return type of event
		 * @type String
		 */
		getType: function() {
			return this.typ;
		},
		
		/**
		 * Gets the date of this {@link GedcomEvent}.
		 * @return date of this {@link GedcomEvent}.
		 * @type DatePeriod
		 */
		getDate: function() {
			return this.gdate;
		},
		
		/**
		 * Gets the place of this {@link GedcomEvent}.
		 * @return place of this {@link GedcomEvent}.
		 * @type String
		 */
		getPlace: function() {
			return this.place;
		},

		getCitation: function() {
			return this.citation;
		},

		getNote: function() {
			return this.note;
		}
	});

	/**
	 * Compares two {@link GedcomEvent}s, for sorting.
	 * @param {GedcomEvent} a
	 * @param {GedcomEvent} b
	 * @return negative for a&lt;b, positive for b&lt;a, zero for a=b
	 * @type Number
	 */
	GedcomEvent.order = function(a,b) {
		return DatePeriod.order(a.getDate(),b.getDate());
	};

})(window.dojo);
