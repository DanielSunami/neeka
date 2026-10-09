const utils = require(rootDir+'/lib/utils');
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

utils.bodyTrim,

function(req, res){
	const db = sqlite.open();
	const published = req.body.published == 'true' ? 1 : 0;

	try {
		const changes = db.transaction(function() {
			const result = db.prepare(`
				UPDATE posts SET
					title = ?, slug = ?, preview = ?, body = ?,
					keywords = ?, published = ?, description = ?, last_update = ?
				WHERE id = ?
			`).run(
				req.body.title,
				req.body.slug,
				req.body.preview,
				req.body.body,
				req.body.keywords || '',
				published,
				req.body.description || '',
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
