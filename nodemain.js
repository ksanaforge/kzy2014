// nodemain.js // this java script must be load by inject-script-start in package.json*/

if (typeof process !="undefined") {			// checking if node.js is running
	nodeRequire=require;			// browser side package will overwrite require
	global.nodeRequire=require;
	if (typeof window!="undefined") window.nodeRequire=nodeRequire;
	if (process.versions["node-webkit"]) {	// checking if nw is running
  		require("../node_scripts/watch.js")	// setup developing environment
	}
}