const sqlite = require(rootDir+'/lib/sqlite');

function tagNames(body) {
	let t = body.tag;
	if (t == null) t = body.tags;
	if (t == null || t === '') return [];
	if (!Array.isArray(t)) t = [t];
	return t.map(function(s) { return String(s).trim().toLowerCase(); }).filter(Boolean);
}

function saveTags(db, postId, names) {
	db.prepare(`DELETE FROM post_tags WHERE post_id = ?`).run(postId);
	const now = sqlite.now();
	const insertTag = db.prepare(`INSERT OR IGNORE INTO tags (name, created_on) VALUES (?, ?)`);
	const getTag = db.prepare(`SELECT id FROM tags WHERE name = ?`);
	const link = db.prepare(`INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)`);
	names.forEach(function(name) {
		insertTag.run(name, now);
		const tag = getTag.get(name);
		if (tag) link.run(postId, tag.id);
	});
}

module.exports = [
function(req, res) {
	const db = sqlite.open();
	const now = sqlite.now();
	const published = req.body.published == 'true' ? 1 : 0;

	try {
		const info = db.transaction(function() {
			const result = db.prepare(`
				INSERT INTO posts (title, slug, preview, body, author_id, published, keywords, description, created_on, last_update)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`).run(
				req.body.title,
				req.body.slug,
				req.body.preview,
				req.body.body,
				req.session.user.id,
				published,
				req.body.keywords || '',
				req.body.description || '',
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
