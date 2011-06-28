(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gedcom.model.Source";

	$.provide(CLASS);

	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	var SourceModel = $.declare(CLASS, null, {
		constructor: function(auth,titl,publ,text) {
			this.auth = auth;
			this.titl = titl;
			this.publ = publ;
			this.text = text;
		},
		getAuthor: function() {
			return this.auth;
		},
		getTitle: function() {
			return this.titl;
		},
		getPublication: function() {
			return this.publ;
		},
		getText: function() {
			return this.text;
		},
		getHtml: function() {
			return this.auth+".<br><i><b>"+this.titl+".</b></i><br>"+this.publ+".<hr>"+this.text;
		}
	});
})(window.dojo);
