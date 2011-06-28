(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gro.model.PersonModel";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gedcom.model.GedcomEvent");
	var GedcomEvent = nu.mine.mosher.gedcom.model.GedcomEvent;

	var PersonModel = $.declare(CLASS, null, {

		/**
		 * @class Represents a person in a family tree.
		 * 
		 * @constructor
		 * @param {String} gid ID of this {@link PersonModel}
		 * @param {String} gname displayable name of this {@link PersonModel}.
		 * @param {Array} revt array of {@link GedcomEvent}s for this {@link PersonModel}.
		 * @type PersonModel
		 */
		constructor: function(gid,gname,pos,revt) {
			/**
			 * ID of this person
			 * @private
			 * @type String
			 */
			this.id = gid;
		
			/**
			 * Displayable name of this person
			 * @private
			 * @type String
			 */
			this.gname = gname;

			this.pos = pos;

			/**
			 * Array of events for this person
			 * @private
			 * @type Array
			 */
			this.revt = revt;
		},

		getName: function() {
			return this.gname;
		},

		/**
		 * Gets the ID of this {@link Person}.
		 * @return ID
		 * @type String
		 */
		getID: function() {
			return this.id;
		},

		getPos: function() {
			return this.pos;
		},

		/**
		 * Gets the Array of {@link GedcomEvent}s for this {@link Person}.
		 * @return array in {@link GedcomEvent}s
		 * @type Array
		 */
		getEvents: function() {
			return this.revt;
		},
		
		/**
		 * Gets the name of this {@link Person}.
		 * @return name
		 * @type String
		 */
		toString: function() {
			return this.gname;
		}
	});
})(window.dojo);
