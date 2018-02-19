var db = new Array(0xFFFF);
function get(str){
	var key = new Array(3);
	key[0] = eval('0x'+str[0]+str[2]);
	key[1] = eval('0x'+str[1]+str[5]);
	key[2] = eval('0x'+str[3]+str[4]);
	return db[elf_hash(key)];
}

function set(str,json){
	var key = new Array(3);
	key[0] = eval('0x'+str[0]+str[2]);
	key[1] = eval('0x'+str[1]+str[5]);
	key[2] = eval('0x'+str[3]+str[4]);
	var x = elf_hash(key);
	if(typeof db[x] != "undefined") {
		if(db[x].expires.getTime() < new Date().getTime() ){
			db[x] = json;
		}else throw "collision";
	}
	else db[x] = json;
}

function unset(str){
	var key = new Array(3);
	key[0] = eval('0x'+str[0]+str[2]);
	key[1] = eval('0x'+str[1]+str[5]);
	key[2] = eval('0x'+str[3]+str[4]);
	var x = elf_hash(key);
	db[x] = undefined;
}

function elf_hash(key){	
	var p = key;
	var h = 0x0000;
	var g;
	var i;
	for ( i = 0; i < p.length; i++ ) {
		h = ( h << 4 ) + p[i];
		g = h & 0xF000;
		if ( g != 0 ) h = h ^(g >> 24);
		h = h & (~g);
	}

	return h;
};


module.exports.set = set;
module.exports.unset = unset;
module.exports.get = get;