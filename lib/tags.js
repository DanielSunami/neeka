const sqlite = require('./sqlite');

function tagNames(body) {
	let t = body && (body.tag != null ? body.tag : body.tags);
	if (t == null || t === '') return [];
	if (!Array.isArray(t)) t = [t];
	return t.map(function(s) { return String(s).trim().toLowerCase(); }).filter(Boolean);
}

function saveTags(db, postId, names) {
	db.prepare('DELETE FROM post_tags WHERE post_id = ?').run(postId);
	const now = sqlite.now();
	const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name, created_on) VALUES (?, ?)');
	const getTag = db.prepare('SELECT id FROM tags WHERE name = ? COLLATE NOCASE');
	const link = db.prepare('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)');
	names.forEach(function(name) {
		insertTag.run(name, now);
		const tag = getTag.get(name);
		if (tag) link.run(postId, tag.id);
	});
}

function attachTags(db, posts) {
	const list = Array.isArray(posts) ? posts : (posts ? [posts] : []);
	if (!list.length) return posts;
	list.forEach(function(p) { if (p && !p.tags) p.tags = []; });
	const ids = list.map(function(p) { return p.id; }).filter(Boolean);
	if (!ids.length) return posts;
	const placeholders = ids.map(function() { return '?'; }).join(',');
	const rows = db.prepare(
		'SELECT pt.post_id, t.name FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id IN (' +
		placeholders + ') ORDER BY t.name COLLATE NOCASE'
	).all(ids);
	const byPost = {};
	rows.forEach(function(r) {
		if (!byPost[r.post_id]) byPost[r.post_id] = [];
		byPost[r.post_id].push(r.name);
	});
	list.forEach(function(p) { p.tags = byPost[p.id] || []; });
	return posts;
}

module.exports = { tagNames, saveTags, attachTags };
