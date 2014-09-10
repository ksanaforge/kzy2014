var stringify = function(strokearray) {
	var partseperator = 253;
	var negativeprefix = 255;
	var stringprefix = 254;
	var bigintprefix = 250;
	if (!strokearray) return "";
	var r = "";
	var partstrokecount = 0;
	var nextnegative = false;
	var i = 0;
	while (i < strokearray.length) {
		if (strokearray[i] === partseperator) {
			r += '$';
			partstrokecount = 0;
		} else if (strokearray[i] === stringprefix) {
			i++;
			if (partstrokecount) r += ':';
			while (strokearray[i] !== partseperator && strokearray[i] !== 58 && i < strokearray.length) {
				if (strokearray[i]) { //string cannot have \0
					r += String.fromCharCode(strokearray[i]);
				}
					
				i++;
			}
			i--;
		} else {
			if (partstrokecount) r += ':';
			if (strokearray[i] === negativeprefix) {
				i++;
				r += (-strokearray[i]);
			} else if (strokearray[i] === bigintprefix) {
				r += strokearray[i] + strokearray[i + 1];
				i++;
			} else {
				r += strokearray[i];
			}
			partstrokecount++;
		}
		i++;
	}
	return r;
}
var parse = function(str, key) {
	var partseperator = 253;
	var negativeprefix = 255;
	var stringprefix = 254;
	var bigintprefix = 250;
	var buhins = {};
	var buhincount=0;
	var arr = str.split("$");
	var r = [];
	for (var i in arr) {
		var s = arr[i];
		var stk = s.split(":");
		if (parseInt(i,10)) r.push(partseperator);
		for (var j in stk) {
			if (!stk[j]) break; //no data after : u23714
			if (isNaN(stk[j])) {
				r.push(stringprefix);
				var buhin = stk[j].replace(/@.*$/, '');
				if (!buhins[buhin]) {
					buhins[buhin] = 0;
					buhincount++;
				}
				buhins[buhin]++;
				for (var k in buhin) {
					if (buhin[k] === "@") break; // skip version number
					r.push(buhin.charCodeAt(k));
				}
			} else {
				var ii = parseInt(stk[j]);
				if (ii < 0) {
					r.push(negativeprefix);
					r.push(-ii);
				} else {
					if (ii >= 250) {
						r.push(250);
						if (ii - 250 > 255) {
							console.error("integer too big " + ii, key);
						}
						r.push(ii - 250);
					} else {
						r.push(ii);
					}
				}
			}
		}
	}
	return {
		bytearr: r,
		buhins: buhins,
		buhincount: buhincount
	};
}

var getGlyphGroup = function(key) {
	var group = '$';
	var sep = key.indexOf('_');
	if (sep == -1) sep = key.indexOf('-');
	if (sep > -1) {
		group = key.substring(0, sep);
	} else {
		if (key.length == 6 && key[1] == '2') group = '$$'
	}
	return group;
}

var getBuhins=function(engine,key,cb,context) {
	if (typeof cb.__unresolved=="undefined"||cb.__unresolved==0) {//first call
		cb.__unresolved=1; 
	  cb.out={};
	}
	var group = getGlyphGroup(key);
  var k=key;
	if (group[0] != '$') k = key.substring(group.length);
	engine.get(['extra', 'glyphwiki', group, k, 'd'], function(data){
		if (typeof data=="undefined") {
			cb.__unresolved=0;
			cb.apply(context,[null]);
			return;
		}
		cb.__unresolved--;
		cb.out[key]=stringify(data);
		var r=parse(cb.out[key]);
		if (r.buhincount) {
			cb.__unresolved+=r.buhincount;
			for (var buhin in r.buhins) getBuhins(engine,buhin,cb,context);
		}
		if (cb.__unresolved==0) {
			cb.apply(context,[cb.out]);
		}
	});
}
module.exports = {
	getBuhins: getBuhins,
	getGlyphGroup: getGlyphGroup,
	parse: parse,
	stringify: stringify
}