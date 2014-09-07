var fs=require("fs");
var request=require("request");
var zlib=require("zlib");
var unzip=require("unzip");
var tar=require("tar");
var processUnihan=function(cb) {
	console.log("process Unihan")	;
	if (cb) cb();
}
var processGlyphwiki=function(cb) {
	console.log("process glyphwiki")	;
	if (cb) cb();
}

var doglyphwiki=function(){
	var chunk=0;
	console.log("downloading glyphwiki");
	request("http://glyphwiki.org/dump.tar.gz")
	  .pipe(zlib.createGunzip())
	  .pipe(tar.Extract({path:__dirname + "/glyphwiki"}))
	  .on("data",function(res) {
	  	chunk++;
	  	if (chunk%1024==0) process.stdout.write(".");
	  })
	  .on("end",function(){
	  	processGlyphwiki(function(){
	  		dounihan();
	  	});
	  });
}

var dounihan=function() {
	var chunk=0;
	console.log("downloading unihan");
	request("http://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip")
	  .pipe(unzip.Extract({ path: __dirname + "/unihan" }))
	  .on("end",function(){
	  	processUnihan();
	  });
}

require("./download_chise")();
doglyphwiki();