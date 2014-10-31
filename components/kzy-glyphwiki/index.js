//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var glyphwiki = {
 api: require("./api")
}

if (typeof process!="undefined" && process.platform!="node-webkit") {
	glyphwiki.gen=require("./gen");	
}


module.exports=glyphwiki;