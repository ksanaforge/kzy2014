/*
TODO , normalize all traditional and variants to simplified Chinese
*/

var warning=function() {
	console.log.apply(console,arguments);
}

var getChise=function() {
	var res=JSON.parse(require('fs').readFileSync('./decompose.json','utf8'));
	for (var i in res) res[i].sorted=true;
	return res;
}

var finalized=function(session) {
	console.log("VPOS",session.vpos);
	console.log("FINISHED")
}
var config={
	name:"chise"
	,meta:{
		config:"simple1"	
	},
	extra: {
		chiseids: getChise()
	}
	,estimatesize:10430400
	,glob:"chise.xml"
	,pageSeparator:"pb.n"
	,reset:true
	,outdir:"../../"
	,finalized:finalized
	,warning:warning
}
setTimeout(function(){ //this might load by gulpfile-app.js
	if (!config.gulp) require("ksana-document").build();
},100)
module.exports=config;