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
module.exports={parseIDS:parseIDS};