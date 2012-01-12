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

define([
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/query",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/_base/xhr",
	"nu/mine/mosher/gedcom/model/GedcomTree",
	"./GedcomExtractor"],

function(
	declare,
	win,
	query,
	dom,
	domConstruct,
	xhr,
	GedcomTree,
	GedcomExtractor) {

	"use strict";

	return function() {
		var head, title, gedcom;
	
		gedcom = null;
	
		/* get the head of the doc */
		head = query("html head")[0];
	
		/* remove any existing title from the document */
		title = query("html head title").forEach(domConstruct.destroy);
	
		/* add our title to the document */
		domConstruct.create("title",{innerHTML:"GRO Javascript"},head,"first");
	
		domConstruct.create("div",{id:"dropline"},win.doc.body);
	
		xhr.get({
			url: "../rapp.ged",
			load: function(gc) {
				var gtree = GedcomTree.parse(gc);
				gedcom = new GedcomExtractor(gtree,dom.byId("dropline"));
			},
			error: function(e) {
				alert("Error reading file "+this.url+": "+e);
			}
		});

	};

});





/*
	nu.mine.mosher.gro.main.menu = function() {
        var pMenu = new dijit.Menu({
        	targetNodeIds: ["dropline"]
        });
        pMenu.addChild(new dijit.MenuItem({
            label: "Save",
            onClick: function() {
            	var jsonGedcom = dojox.json.ref.toJson(gedcom.model,true);
            	alert("ok");
            }
        }));
        pMenu.startup();
	};
*/
