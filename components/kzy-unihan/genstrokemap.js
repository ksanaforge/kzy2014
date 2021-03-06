﻿var fs=require('fs');
var charstroke=JSON.parse(fs.readFileSync('./kTotalStrokes.json','utf8'));  //from extractkey.js
var exte_stroke=JSON.parse(fs.readFileSync('./strokecount-exte.json','utf8'));  //from extractkey.js
for (var i in exte_stroke) charstroke[i]=exte_stroke[i];

var  getutf32 = function (opt) { // return ucs32 value from a utf 16 string, advance the string automatically
	opt.thechar='';
	if (!opt.widestring) return 0;
    var s = opt.widestring;
    var ic = s.charCodeAt(0);
    var c = 1; // default BMP one widechar
    if (ic >= 0xd800 && ic <= 0xdcff) {
      var ic2 = s.charCodeAt(1);
      ic = 0x10000 + ((ic & 0x3ff) * 1024) + (ic2 & 0x3ff);
      c++; // surrogate pair
    }
    opt.thechar = s.substr(0, c);
    opt.widestring = s.substr(c, s.length - c);
    return ic;
};
var mapbmp=[]; //start from 0x3400
var mapsur=[];  // start from 0x20000
//sinica eudc need extra mapping
var maxstroke=0;
var count=0;
for (var i in charstroke) {
	var stroke=parseInt(charstroke[i]);
	
	var opt={};
	opt.widestring=i;
	var code=getutf32(opt);
	if (code>=0x3400 && code<=0x9FFF ) {
		mapbmp[ code-0x3400 ] = stroke;
	} else if (code>=0x20000 &&  code<=0x2CEA1) {//up to extension E
		mapsur[code-0x20000] = stroke;
	}
	if (stroke>maxstroke) maxstroke=stroke;
	if (opt.widestring!=="") throw "key should only have one character";
	
}
var bmpunknown=0,surunknown=0;
var bmpstr="";
for (var i=0;i<mapbmp.length;i++) {
	var sc=mapbmp[i];
	if (typeof(sc)=='undefined') { //stroke count unknown
		sc=0;
		bmpunknown++;
		mapbmp[i]=0;
	}
	bmpstr+=String.fromCharCode(0x23+sc);
}
var surstr="";
for (var i=0;i<mapsur.length;i++) {
	var sc=mapsur[i];
	if (typeof(sc)=='undefined') {
		sc=0;
		surunknown++;
		mapsur[i]=0;
	}
	surstr+=String.fromCharCode(0x23+sc);
}

for (var i=0;i<mapbmp.length;i++) {
  if ((bmpstr.charCodeAt(i)-0x23 )!==mapbmp[i]) {
	console.log('bmp string conversion error at ',i, bmpstr.charCodeAt(i), mapbmp[i]);
	throw 'string convesion error';
  }
}

console.log('max stroke count ',maxstroke);
console.log('BMP count ',mapbmp.length);
console.log('SUR count ',mapsur.length);

var output="";
output+='exports.bmpRLE="'+bmpstr+'";\r\n';
output+='exports.surRLE="'+surstr+'";\r\n';
fs.writeFileSync('kTotalStrokes_str.js',output,'utf8');

//testing

var  getstroke=function(ch) {
	opt.widestring=ch;
	var s="";
	var offset=0;
	var code=getutf32(opt);
	if (code>=0x20000 && code<=0x2B81F) {
		s=surstr;
		offset=code-0x20000;
	} else if (code<0x20000) {
		s=bmpstr;
		offset=code-0x3400;
	}
	return s.charCodeAt(offset)-0x23 ;
}

if (getstroke('龘')!=48) throw 'read data wrong!';

console.log("bmp unknown count",bmpunknown);
console.log("surrogate unknown count",surunknown);