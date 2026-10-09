const
	utils = require(rootDir+'/lib/utils'),
	fecha = require('fecha');
const sqlite = require(rootDir+'/lib/sqlite');

module.exports = [

utils.bodyTrim,

function(req, res, next) {

	if(!req.body.birthday) return next();

	let toDate = fecha.parse(req.body.birthday, 'regular');
	if(!toDate) {
		res.status(400).json({ ok: false, msg: 'Invalid Date Format' });
		return;
	} else {
		req.body.birthday = fecha.format(toDate, 'iso');
		return next();
	}
},

function(req, res){
	const db = sqlite.open();
	const now = sqlite.now();

	try {
		let sql, params;
		if(req.body.password) {
			sql = `
				UPDATE users SET
					firstname = ?, lastname = ?, website = ?, birthday = ?,
					editor = ?, password = ?, last_update = ?
				WHERE id = ?
			`;
			params = [
				req.body.firstname,
				req.body.lastname || '',
				req.body.website || '',
				req.body.birthday || null,
				req.body.preferences_editor || 'trix',
				utils.hashPassword(req.body.password),
				now,
				req.params.id
			];
		} else {
			sql = `
				UPDATE users SET
					firstname = ?, lastname = ?, website = ?, birthday = ?,
					editor = ?, last_update = ?
				WHERE id = ?
			`;
			params = [
				req.body.firstname,
				req.body.lastname || '',
				req.body.website || '',
				req.body.birthday || null,
				req.body.preferences_editor || 'trix',
				now,
				req.params.id
			];
		}

		const result = db.prepare(sql).run(...params);
		if(!result.changes) {
			console.log('[UserNotFound] POST /admin/user/' + req.params.id);
			res.status(404).json({ ok: false });
		} else
			res.json({ ok: true });
	} catch (err) {
		console.error('[SQLiteError] POST /admin/user/' + req.params.id + ' - ', err);
		res.status(500).json({ ok: false });
	}
}
];
