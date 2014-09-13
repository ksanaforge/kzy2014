var parseIDS=function(ids) {
	var i=0;
	var res=[];
	while (i<ids.length) {
		var code=ids.charCodeAt(i);
		var token=ids[i];
		if (code>=0x2ff0 && code<=0x2fff) {
			i++; //skip idc
			continue;
		} else if (code==0x26) {
			token="";
			while (i<ids.length && ids[i]!=';') {
				token+=ids[i];
				i++;
			}
		} else if (code>=0xd800 && code<=0xdfff) {
			token+=ids[++i];
		}
		res.push(token);
		i++;
	}
	return res;
}
var ucs2string = function (unicode) { //unicode ¤º½XÂà ¦r¦ê¡A§textension B ±¡ªp
  if (unicode >= 0x10000 && unicode <= 0x10FFFF) {
    var hi = Math.floor((unicode - 0x10000) / 0x400) + 0xD800;
    var lo = ((unicode - 0x10000) % 0x400) + 0xDC00;
    return String.fromCharCode(hi) + String.fromCharCode(lo);
  } else {
    return String.fromCharCode(unicode);
  }
};
module.exports={parseIDS:parseIDS, ucs2string:ucs2string};