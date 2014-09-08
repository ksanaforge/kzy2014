var fs=require("fs");
var path=require("path");
var request=require("request");
var baseurl="http://git.chise.org/gitweb/?p=chise/kage.git;a=blob_plain;f=engine/";
var files=["2d.js","buhin.js","curve.js","kage.js","kagecd.js","kagedf.js","polygon.js","polygons.js"];
var targetpath="components/kzy-kage";
var combinefile=function() {
	var out=[];
	for (var i=0;i<files.length;i++) {
		var fn=targetpath+"/"+files[i];
		out.push(fs.readFileSync(fn,"utf8"));
		fs.unlinkSync(fn);
	}
	out.push("//from http://git.chise.org/gitweb/?p=chise/kage.git");
	out.push("module.exports={Kage:Kage, Polygons:Polygons};");

	//work around for passing use strict
	out[2]=out[2].replace("    temp = new Array(2);","    var temp = new Array(2);");
	fs.writeFileSync(targetpath+"/kageall.js",out.join("\n"),"utf8");
}
var download=function() {
	var finished=0;
	if (!fs.existsSync(targetpath)) fs.mkdirSync(targetpath);
	for (var i=0;i<files.length;i++) {
		var writer=fs.createWriteStream(__dirname+"/"+targetpath+"/"+files[i]);
		console.log(baseurl+files[i]);
		request(baseurl+files[i]).pipe(writer);
		writer.on('finish',function(){
			finished++;
			if (finished==files.length) combinefile();
		})
	}
}
if (__filename==path.resolve(process.argv[1])) download();
module.exports=download;