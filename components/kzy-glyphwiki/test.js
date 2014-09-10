var Kde=require("ksana-document").kde;
var api=require("./api");

Kde.open("../glyphwiki",function(db){
	api.getBuhins(db,"u76df",function(out){
		console.log(out);
	})
});

var fetch=function() {
	db.get(['extra', 'glyphwiki', "abcabc", "_sandbox", 'd'],function(data){
		//console.log(data)
		var s=api.stringify(data);
		var parsed=api.parse(s);
		console.log(parsed.buhins)
	})
}