const utils = require(rootDir+'/lib/utils');
const pagination = require(rootDir+'/lib/pagination');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');
const { attachTags } = require(rootDir+'/lib/tags');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/blog_index');
	next();
},

pagination,

function(req, res) {
	const db = sqlite.open();
	const name = String(req.params.name || '').trim();
	const tag = db.prepare('SELECT id, name FROM tags WHERE name = ? COLLATE NOCASE').get(name);
	if (!tag) {
		res.status(404).end('not found!');
		return;
	}

	const title = tag.name + (req.query.page > 1 ? ' - Page ' + req.query.page : '');
	req.pageData.title = title;
	req.pageData.subtitle = '';
	req.pageData.url = '/tags/' + encodeURIComponent(tag.name);
	req.pageData.page = req.page;

	const rows = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.description, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
		FROM posts p
		JOIN users u ON u.id = p.author_id
		JOIN post_tags pt ON pt.post_id = p.id
		WHERE p.published = 1 AND pt.tag_id = ?
		ORDER BY p.created_on DESC
		LIMIT ? OFFSET ?
	`).all(tag.id, req.itens, req.offset);

	const total = db.prepare(`
		SELECT COUNT(*) AS n
		FROM posts p
		JOIN post_tags pt ON pt.post_id = p.id
		WHERE p.published = 1 AND pt.tag_id = ?
	`).get(tag.id).n;

	req.pageData.posts = rows.map(shapePost);
	attachTags(db, req.pageData.posts);
	req.pageData.totalNumberOfPages = Math.ceil(total / req.itens);
	res.send(req.render(req.pageData));
}
];
