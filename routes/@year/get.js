const utils = require(rootDir+'/lib/utils');
const pagination = require(rootDir+'/lib/pagination');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');

module.exports = [

function(req, res, next) {
	if(isNaN(req.params.year)) return next();
	req.render = utils.requireUncached(rootDir+'/render/blog_index');
	next();
},

function(req, res, next) {
	if(isNaN(req.params.year)) return next();
	pagination(req, res, next);
},

function(req, res, next) {
	if(isNaN(req.params.year)) return next();

	const db = sqlite.open();
	const year = String(req.params.year);
	const title = year + (req.query.page > 1 ? " - Page " + req.query.page : "");

	req.pageData.title = title;
	req.pageData.subtitle = "";
	req.pageData.url = "/" + year;
	req.pageData.page = req.page;

	const rows = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.keywords, p.description, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
		FROM posts p
		JOIN users u ON u.id = p.author_id
		WHERE p.published = 1 AND strftime('%Y', p.created_on) = ?
		ORDER BY p.created_on DESC
		LIMIT ? OFFSET ?
	`).all(year, req.itens, req.offset);

	const total = db.prepare(`
		SELECT COUNT(*) AS n FROM posts WHERE published = 1 AND strftime('%Y', created_on) = ?
	`).get(year).n;

	req.pageData.posts = rows.map(shapePost);
	req.pageData.totalNumberOfPages = Math.ceil(total / req.itens);

	res.send(req.render(req.pageData));
}
];
