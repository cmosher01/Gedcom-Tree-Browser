(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gro.main";

	$.provide(CLASS);

	$.require("nu.mine.mosher.gedcom.model.GedcomTree");
	var GedcomTree = nu.mine.mosher.gedcom.model.GedcomTree;
	$.require("nu.mine.mosher.gro.GedcomExtractor");
	var GedcomExtractor = nu.mine.mosher.gro.GedcomExtractor;

	$.require("dojox.json.ref");
	$.require("dijit.Menu");

    $.declare(CLASS, null, {
		constructor: function() {
			throw new Error("cannot instantiate");
		}
	});

    var gedcom;

    nu.mine.mosher.gro.main.main = function() {
		var head, title;

		gedcom = null;

		// get the head of the doc
		head = $.query("html head")[0];

		// remove any existing title from the document
		title = $.query("html head title").forEach($.destroy);

		// add our title to the document
		$.create("title",{innerHTML:"GRO Javascript"},head,"first");

		$.create("div",{id:"dropline"},$.doc.body);

		nu.mine.mosher.gro.main.menu();


		//"lib/testged/TGC55C.ged"
		//"RichardsReeves.ged"
		$.xhrGet({
			url: "../rapp.ged",
			load: function(gc) {
				var gtree = GedcomTree.parse(gc);
				gedcom = new GedcomExtractor(gtree,$.byId("dropline"));
			},
			error: function(e) {
				alert("Error reading file "+this.url+": "+e);
			}
		});
	};

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
})(window.dojo);
