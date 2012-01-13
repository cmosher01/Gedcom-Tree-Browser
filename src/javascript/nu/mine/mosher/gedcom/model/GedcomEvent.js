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
 * Defines the {@link GedcomEvent} class.
 */

define(["dojo/_base/declare","nu/mine/mosher/util/Util","./date/DatePeriod"],
function(declare,Util,DatePeriod) {

	"use strict";

	var GedcomEvent = declare(null, {

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

	return GedcomEvent;

});
