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
 * Defines the {@link TreeModel} class.
 */

define(["dojo/_base/declare"],function(declare) {

	"use strict";

	return declare(null, {
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

});
