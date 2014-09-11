
var gen=function() {
	var customfunc=require(__dirname+'/api');
	console.log('loading text',process.cwd());
	var fs=require('fs');
	var dumpfile='./raw/dump_newest_only.txt';
	if (!fs.existsSync(dumpfile)) {
		console.log('missing '+dumpfile+' from  http://glyphwiki.org/dump.tar.gz');
		return;
	}
	var arr=fs.readFileSync(dumpfile,'utf8').split('\n');

	console.log('parsing')
	//parse field
	var fields=arr[0].split('|');
	var fieldstart=[0];
	for (var i=0;i<fields.length;i++) {
		fieldstart.push(fieldstart[i]+fields[i].length+1);
	}
	fields=fields.map(function(i){return i.trim()});
	//fieldstart.unshift(0);//for the loop
	//console.log(fields,fieldstart);

	var output={},groupcount=0,keycount=0; //first generate a big output file
	var buhins={}
	var relatedidx={},relatedcount=0; //related index
	for (var i=2;i<arr.length-3;i++) { //last 3 is not data
		var obj={},key='',related='';
		for (var j=1;j<fieldstart.length;j++) {
			var field=fields[j-1];
			var value=arr[i].substring(fieldstart[j-1],fieldstart[j]-1).trim();

			if (field=='related') related=value;

			if (field=='name') key=value;
			else obj[field]=value;
		}
		if (obj['related']==key || obj['related']=='u3013') delete obj['related'];

		obj['d']=customfunc.parse(obj['data'],key).bytearr;
		//obj['d']=obj['data']
		delete obj['data'];

		//split into smaller group
		var group='$';

		var sep=key.indexOf('_');
		if (sep==-1) sep=key.indexOf('-');
		if (sep >-1) {
			group=key.substring(0,sep);
		} else {
			if (key.length==6 && key[1]=='2') group='$$';
		}
		var fullkey=key;
		//remove group prefix , save some space
		if (group[0]!='$') key=key.substring(group.length);

		//put into glyphwiki json
		if (!output[group]) {
			groupcount++;
			output[group]={};
		}
		keycount++;
		output[group][key] = obj;

		//build related reverse index
		if (related==fullkey) continue;
		if (related && typeof relatedidx[related]=='undefined') {
			relatedidx[related]=[];
			relatedcount++;
		}
		if (related) relatedidx[related].push(fullkey);
		//if (keycount>1000) break;
	}
	console.log('keycount',keycount);
	console.log('groupcount',groupcount);
	console.log('relatedcount',relatedcount);
	console.log('writing json')
	fs.writeFileSync('glyphwiki.json',JSON.stringify(output),'utf8');
	fs.writeFileSync('related.json',JSON.stringify(relatedidx,'',' '),'utf8');
	fs.writeFileSync('buhins.json',JSON.stringify(buhins,'',' '),'utf8');
		
}

if (typeof process!="undefined" &&__filename==require("path").resolve(process.argv[1])) gen();
module.exports=gen;