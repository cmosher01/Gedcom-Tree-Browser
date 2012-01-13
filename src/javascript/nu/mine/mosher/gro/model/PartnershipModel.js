/**
 * @fileoverview
 * Defines the {@link Partnership} class.
 */

(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gro.model.PartnershipModel";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gro.model.PersonModel");
	var PersonModel = nu.mine.mosher.gro.model.PersonModel;

	var PartnershipModel = $.declare(CLASS, null, {
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
})(window.dojo);
