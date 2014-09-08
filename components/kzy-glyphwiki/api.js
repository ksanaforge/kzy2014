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
				if (!buhins[buhin]) buhins[buhin] = 0;
				buhins[buhin]++;
				for (var k in buhin) {
					if (buhin[k] === "@") break; // skip version number
					r.push(buhin.charCodeAt(k));
				}
			} else {
				ii = parseInt(stk[j]);
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
		buhins: buhins
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

var getBuhin = function(key) {
	var group = this.customfunc['getGlyphGroup'].apply(this, [key]);
	if (group[0] != '$') key = key.substring(group.length);
	var d = this.get(['extra', 'glyphwiki', group, key, 'd'], true);
	if (!d) return "";
	return this.customfunc['stringify'].apply(this, [d]);
}

//get Buhins recursively

var getBuhins = function(K) {
	var B = {};
	var getbuhins = function(key, buhins) {
		var data = this.customfunc['getBuhin'].apply(this, [key]);
		var r = this.customfunc['parse'].apply(this, [data]);
		if (data) buhins[key] = data;
		for (var i in r.buhins) {
			getbuhins.apply(this, [i, buhins]);
		}
	}
	if (K.indexOf(':') > -1) { //K is command
		var r = this.customfunc['parse'].apply(this, [K]);
		for (var i in r.buhins) {
			getbuhins.apply(this, [i, B]);
		}

	} else {
		getbuhins.apply(this, [K, B]);
	}

	return B;
}
module.exports = {
	getBuhin: getBuhin,
	getBuhins: getBuhins,
	getGlyphGroup: getGlyphGroup,
	parse: parse,
	stringify: stringify
}