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

define(["dojo/_base/declare"],
function(declare) {

	"use strict";

	return declare(null, {
		/**
		 * @class
		 * Represents a family in the family tree.
		 * 
		 * @constructor
		 * @param {String} gid ID of this {@link PartnershipModel}
		 * @param {PersonModel} husb husband in this {@link PartnershipModel}
		 * @param {PersonModel} wife wife in this {@link PartnershipModel}
		 * @param {Array} rchil array of children {@link PersonModel}s for this {@link PartnershipModel}.
		 * @param {Array} revt array of {@link GedcomEvent}s for this {@link PartnershipModel}.
		 * @return new {@link PartnershipModel}
		 * @type PartnershipModel
		 */
		constructor: function(gid,husb,wife,rchil,revt) {
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
		
		},
		/**
		 * Gets the array of {@link GedcomEvent}s for this {@link Partnership}.
		 * @return events
		 * @type Array
		 */
		getEvents: function() {
			return this.revt;
		},
		getHusband: function() {
			return this.husb;
		},
		getWife: function() {
			return this.wife;
		},
		getChildren: function() {
			return this.rchil;
		},
		getID: function() {
			return this.id;
		}
	});

});
