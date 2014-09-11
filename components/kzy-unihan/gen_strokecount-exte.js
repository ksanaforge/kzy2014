/*
  generate extension E stroke count
*/
var fs=require("fs");
//var charstroke=require("./kTotalStrokes.js");
var charstroke=JSON.parse(fs.readFileSync("./kTotalStrokes.json","utf8"));
var exte=fs.readFileSync("../kzy-chise/raw/IDS-UCS-Ext-E.txt","utf8").split("\n");
var api=require("../kzy-chise/api.js");
var hasstroke=0,nostroke=0;
var out={},missing={};
var parseLine=function(line,idx) {
	var data=line.split("\t");
	if (data[1]==data[2]) return;
	var unicode=parseInt("0x"+data[0].substr(2));
	var thechar=data[1];
	var parts=api.parseIDS(data[2]);
	var strokecount=0;
	for (var i=0;i<parts.length;i++) {
		if (!parts[i]) continue;
		var sc=charstroke[parts[i]];
		if (sc) {
			strokecount+=sc;
		} else {
			console.log("cannot resolve",unicode);
			if (!missing[parts[i]]) missing[parts[i]]=0;
			missing[parts[i]]++;
			strokecount=0;
			break;
		}
	}

	if (strokecount) {
		hasstroke++;
		out[thechar]=strokecount;
	} else {
		nostroke++;
	}
}
exte.map(parseLine);
fs.writeFileSync("strokecount-exte.json",JSON.stringify(out),'utf8');
fs.writeFileSync("strokecount-exte-missing-part.json",JSON.stringify(missing,""," "),'utf8');
console.log("has strokecount",hasstroke );
console.log("no strokecount",nostroke );
