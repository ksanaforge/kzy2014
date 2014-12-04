var fs=require("fs");
var request=require("request");
var zlib=require("zlib");
var unzip=require("unzip");
var tar=require("tar");


var doglyphwiki=function(){
	var chunk=0;
	var targetpath=__dirname + "/components/kzy-glyphwiki/raw/";
	targetpath=targetpath.replace(/\//g,require("path").sep);
	console.log(targetpath);
	console.log("downloading glyphwiki");
	if (!fs.existsSync(targetpath)) {
		fs.mkdirSync(targetpath);
	}
	request("http://glyphwiki.org/dump.tar.gz")
	  .pipe(zlib.createGunzip())
	  .pipe(tar.Extract({path:targetpath}))
	  .on("data",function(res) {
	  	chunk++;
	  	if (chunk%1024==0) process.stdout.write(".");
	  })
	  .on("end",function(){
  		fs.unlinkSync(targetpath+"dump_all_versions.txt");
  		dounihan();
	  });
}

var dounihan=function() {
	var chunk=0;
	console.log("downloading unihan");
	request("http://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip")
	  .pipe(unzip.Extract({ path: __dirname + "/components/kzy-unihan/raw" }));
}

require("./download_chise")();
doglyphwiki();