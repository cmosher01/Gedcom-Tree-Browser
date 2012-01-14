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
	"dojo/query",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/on",
	"nu/mine/mosher/gedcom/model/GedcomTree",
	"./GedcomExtractor"],

function(
	declare,
	query,
	dom,
	domConstruct,
	on,
	GedcomTree,
	GedcomExtractor) {

	"use strict";

	return function() {
		var gedcom;
		var chart;

		var body = query("html body")[0];
		var infile = domConstruct.create("input",{type:"file"},body);

		on(infile,"change",function(e) {
			var f = e.target.files[0];

			var reader = new FileReader();
			reader.onload = function() {
				var gtree;

				if (chart) {
					domConstruct.destroy(chart);
				}
				chart = domConstruct.create("div",{},body);

				gtree = GedcomTree.parse(reader.result);
				gedcom = new GedcomExtractor(gtree,chart);
			}
			reader.readAsText(f,"windows-1252");
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
