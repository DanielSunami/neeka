const sqlite = require(rootDir+'/lib/sqlite');

module.exports = [

function(req, res, next) {
	const db = sqlite.open();
	try {
		db.prepare(`DELETE FROM posts WHERE id = ?`).run(req.params.id);
		res.json({ ok: true });
	} catch (err) {
		res.json({ ok: false });
	}
}

];
