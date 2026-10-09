const sqlite = require(rootDir+'/lib/sqlite');

module.exports = function(req, res){
	const db = sqlite.open();
	const doc = db.prepare(`
		SELECT id, user_id FROM forgots
		WHERE id = ? AND datetime(created_on) > datetime('now', '-48 hours')
	`).get(req.params.id);

	if(doc) {
		try {
			db.prepare(`UPDATE users SET password = ?, last_update = ? WHERE id = ?`).run(
				utils.hashPassword(req.body.password),
				sqlite.now(),
				doc.user_id
			);
			db.prepare(`DELETE FROM forgots WHERE id = ?`).run(doc.id);
			res.json({ok : true});
		} catch (err) {
			res.json({ok : false});
		}
	} else {
		res.json({ok : false});
	}
};
