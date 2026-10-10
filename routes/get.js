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
	const title = "Home" + (req.query.page > 1 ? " - Page " + req.query.page : "");
	const url = "/" + (req.query.page > 1 ? "?page=" + req.query.page : "");

	req.pageData.title = title;
	req.pageData.url = url;
	req.pageData.page = req.page;

	const rows = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.description, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
		FROM posts p
		JOIN users u ON u.id = p.author_id
		WHERE p.published = 1
		ORDER BY p.created_on DESC
		LIMIT ? OFFSET ?
	`).all(req.itens, req.offset);

	const total = db.prepare(`SELECT COUNT(*) AS n FROM posts WHERE published = 1`).get().n;

	req.pageData.posts = rows.map(shapePost);
	attachTags(db, req.pageData.posts);
	req.pageData.totalNumberOfPages = Math.ceil(total / req.itens);

	res.send(req.render(req.pageData));
}
];
