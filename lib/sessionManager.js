var cookieHandler = require('cookie');
var crypt = require('./sha1.js');
var db = require('./db.js');
var domain = '127.0.0.1';

var path = '/';
var sid = 'sessionid';

function createSession(json, exprs, pth, id){
	var expires = (typeof exprs === 'undefined') ? new Date(new Date().getTime()+604800000) : exprs;
	path = (typeof pth === 'undefined') ? path : pth;
	sid = (typeof id === 'undefined') ? sid : id;
	var tryAgain = false;
	do{
		var strCookie = crypt.hex_sha1(new String(Math.random()));
		var dbKey = strCookie[5]+strCookie[10]+strCookie[15]+strCookie[7]+strCookie[11]+strCookie[17];
		var cookie = cookieHandler.serialize(sid,strCookie,{domain : domain, path : path, expires : expires});
		try{
			db.set(dbKey, {cookie : strCookie, expires: expires, data : json});
			tryAgain = false;
		}catch(e){
			tryAgain = true;
		}
	}while(tryAgain);
	return cookie;
}

function get(sid){
	var dbKey = sid[5]+sid[10]+sid[15]+sid[7]+sid[11]+sid[17];
	var dbJson = db.get(dbKey);
	if(dbJson.cookie != sid) throw fakeCookie;
	return dbJson;
}

function removeSession(sid){
	var dbKey = sid[5]+sid[10]+sid[15]+sid[7]+sid[11]+sid[17];
	db.unset(dbKey);
}

module.exports.createSession = createSession;
module.exports.get = get;
module.exports.removeSession = removeSession;