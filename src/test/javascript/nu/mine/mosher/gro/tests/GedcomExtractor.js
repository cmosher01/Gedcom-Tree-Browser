$(function() {

	module("GedcomExtractor", {
		setup: function() {
			var qu = this;
			$.ajaxSetup({
				dataType: "text"
			});
			stop(); // wait for ged file to load (or fail)
			$.get("lib/testged/TGC55C.ged")
				.success(function(gc) {
					gtree = GedcomTree.parse(gc);
					qu.extr = new GedcomExtractor(gtree);
					start();
				})
				.error(function(s,m,e) {
					ok(false,"Error reading file "+this.url+": "+e);
					start();
				});
		}
	});

	test("nominal read", function() {
		var ex = this.extr;
		ok(true);
	});


});
