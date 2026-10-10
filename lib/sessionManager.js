let cookieHandler = require('cookie');
let sqlite = require('./sqlite.js');
let { randomId } = require('./utils.js');

let path = '/';
let sidName = 'sessionid';
const WEEK = 604800000;

function cookieDomain(url) {
	let host = String(url || '').replace(/^https?:\/\//i, '').replace(/\/.*$/, '').split(':')[0];
	if (!host || host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return;
	return host;
}

function createSession(json, exprs, pth, id){
	let expires = (typeof exprs === 'undefined') ? new Date(Date.now() + WEEK) : exprs;
	path = (typeof pth === 'undefined') ? path : pth;
	sidName = (typeof id === 'undefined') ? sidName : id;

	let strCookie = randomId();
	let opts = { path: path, expires: expires };
	let domain = cookieDomain(NEEKA.url);
	if (domain) opts.domain = domain;
	let cookie = cookieHandler.serialize(sidName, strCookie, opts);
	let db = sqlite.open();
	let now = Date.now();
	db.prepare('DELETE FROM sessions WHERE expires < ?').run(now);
	db.prepare('INSERT INTO sessions (id, data, expires) VALUES (?, ?, ?)').run(
		strCookie,
		JSON.stringify(json),
		expires.getTime()
	);
	return cookie;
}

function get(sid){
	let db = sqlite.open();
	let row = db.prepare('SELECT id, data, expires FROM sessions WHERE id = ?').get(sid);
	if(!row || row.expires < Date.now()) {
		if(row) db.prepare('DELETE FROM sessions WHERE id = ?').run(sid);
		throw 'expired';
	}
	return {
		cookie: row.id,
		expires: new Date(row.expires),
		data: JSON.parse(row.data)
	};
}

function removeSession(sid){
	sqlite.open().prepare('DELETE FROM sessions WHERE id = ?').run(sid);
}

module.exports.createSession = createSession;
module.exports.get = get;
module.exports.removeSession = removeSession;
