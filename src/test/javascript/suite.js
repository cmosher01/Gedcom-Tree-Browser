/*
This file (suite.js) is designed to be loaded by a script tag,
and called from the body onload event,
of an html file that is in src/test/javascript directory, where
src/main/javascript contains dojo and util directories:
	src/
		main/
			javascript/
				dojo/
					dojo.js
				util/
					doh/
						runner.html
				com/
				org/
				nu/
					mine/
						mosher/
							mymod/
								MyMod.js
		test/
			javascript/
				suite.html
				com/
				org/
				nu/
					mine/
						mosher/
							mymod/
								tests/
									tests.js
									MyMod.js
Query parameter "module" would be "nu.mine.mosher.mymod" in this case:

	file:///path/to/src/test/javascript/suite.html?module=nu.mine.mosher.mymod

*/
function suite(global) {
	/*
	 * Based on getArgs function from "Javascript: The Definitive Guide, 4th ed.," section 13.9.
	 *
	 * This function parses comma-separated name=value argument pairs from
	 * the query string of the URL. It stores the name=value pairs in 
	 * properties of an object and returns that object.
	 */
	var args = (function(global) {
	    var r = {};
	    var query = global.location.search.substring(1);
	    var pairs = query.split(",");
	    for(var i = 0; i < pairs.length; i++) {
	        var pos = pairs[i].indexOf('=');
	        if (pos >= 0) {
		        var argname = pairs[i].substring(0,pos);
		        var value = pairs[i].substring(pos+1);
		        r[argname] = unescape(value);
	        }
	    }
	    return r;
	})(global);

	var module = args.module;
	if (typeof module === "undefined" || module.length === 0) {
		var err = "Error: missing required parameter: module";
		global.document.body.innerHTML = err;
		throw new Error(err);
	}

	var modulePath = module.replace(/\./g,"/");

//  dojo.registerModule(module+".tests","../../../test/javascript/"+modulePath+"/tests");

	var loc;
	loc = "";
	loc += "../../main/javascript/util/doh/runner.html";
	loc += "?";
	loc += "test="+modulePath+"/tests/tests.js";
	loc += "&";
	loc += "paths="+module+".tests,../../../test/javascript/"+modulePath+"/tests";

  console.log(loc);

	global.location = loc;
}
