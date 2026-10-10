const sqlite = require(rootDir+'/lib/sqlite');
const { tagNames, saveTags } = require(rootDir+'/lib/tags');

module.exports = [
function(req, res) {
	const db = sqlite.open();
	const now = sqlite.now();
	const published = req.body.published == 'true' ? 1 : 0;

	try {
		const info = db.transaction(function() {
			const result = db.prepare(`
				INSERT INTO posts (title, slug, preview, body, author_id, published, description, og_image, created_on, last_update)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`).run(
				req.body.title,
				req.body.slug,
				req.body.preview,
				req.body.body,
				req.session.user.id,
				published,
				req.body.description || '',
				req.body.og_image || '',
				now,
				now
			);
			saveTags(db, result.lastInsertRowid, tagNames(req.body));
			return result;
		})();

		res.json({ ok: true, id: info.lastInsertRowid });
	} catch (err) {
		console.log('[SQLiteError] POST /admin/post - ', err);
		res.json({ok: false});
	}
}
];
