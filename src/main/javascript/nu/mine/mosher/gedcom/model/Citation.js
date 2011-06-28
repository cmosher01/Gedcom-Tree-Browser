(function($) {
	"use strict";

	var CLASS = "nu.mine.mosher.gedcom.model.Citation";

	$.provide(CLASS);

	$.require("nu.mine.mosher.util.Util");
	var Util = nu.mine.mosher.util.Util;

	var CitationModel = $.declare(CLASS, null, {
		constructor: function(sour,text,page,quay) {
			this.sour = sour;
			this.text = text;
			this.page = page;
			this.quay = quay;
		},
		getSource: function() {
			return this.sour;
		},
		getText: function() {
			return this.text;
		},
		getPage: function() {
			return this.page;
		},
		getQuality: function() {
			return this.quay;
		}
	});
})(window.dojo);
