/**
 * @fileoverview
 * Defines the {@link Partnership} class.
 */

(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gro.model.TreeModel";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gro.model.PersonModel");
	var PersonModel = nu.mine.mosher.gro.model.PersonModel;
	$.require("nu.mine.mosher.gro.model.PartnershipModel");
	var PartnershipModel = nu.mine.mosher.gro.model.PartnershipModel;

	var TreeModel = $.declare(CLASS, null, {
		/**
		 * @class
		 * Represents a family tree.
		 * 
		 * @constructor
		 * @return new {@link TreeModel}
		 * @type TreeModel
		 */
		constructor: function() {
			// map of ID to PersonModel
			this.mPerson = {};
			// map of ID to PartnershipModel
			this.mPartnership = {};
		},
		addPerson: function(personModel) {
			this.mPerson[personModel.getID()] = personModel;
		},
		addPartnership: function(partnershipModel) {
			this.mPartnership[partnershipModel.getID()] = partnershipModel;
		}
	});
})(window.dojo);
