const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');
const { tagNames, saveTags } = require(rootDir+'/lib/tags');

module.exports = [

utils.bodyTrim,

function(req, res){
	const db = sqlite.open();
	const published = req.body.published == 'true' ? 1 : 0;

	try {
		const changes = db.transaction(function() {
			const result = db.prepare(`
				UPDATE posts SET
					title = ?, slug = ?, preview = ?, body = ?,
					published = ?, description = ?, og_image = ?, last_update = ?
				WHERE id = ?
			`).run(
				req.body.title,
				req.body.slug,
				req.body.preview,
				req.body.body,
				published,
				req.body.description || '',
				req.body.og_image || '',
				sqlite.now(),
				req.params.id
			);
			if (result.changes) saveTags(db, req.params.id, tagNames(req.body));
			return result;
		})();

		if(!changes.changes) {
			console.log('[PostNotFound] POST /admin/post/' + req.params.id);
			res.status(404).json({ ok: false });
		} else {
			res.json({ ok: true });
		}
	} catch (err) {
		console.error('[SQLiteError] POST /admin/post/' + req.params.id + ' - ', err);
		res.status(500).json({ ok: false });
	}
}
];
