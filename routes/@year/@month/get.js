let render = require(rootDir+'/render'),
	fecha = require('fecha');
const pagination = require(rootDir+'/lib/pagination');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');

module.exports = [

function(req, res, next){
	if(isNaN(req.params.year)) return next();
	pagination(req, res, next);
},

function(req, res, next){
	if(isNaN(req.params.year)) return next();

	const db = sqlite.open();
	const year = String(req.params.year);
	const month = zeroLeftMask(req.params.month);
	const title = fecha.format(new Date(req.params.year, req.params.month - 1, 1), 'MMMM, YYYY') + (req.query.page > 1 ? " - Page " + req.query.page : "");
	const url = "/" + year + "/" + month + (req.query.page > 1 ? "?page=" + req.query.page : "");

	req.pageData.title = title;
	req.pageData.subtitle = "";
	req.pageData.url = url;
	req.pageData.page = req.page;

	const yearMonth = year + '-' + month;

	const rows = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.description, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
		FROM posts p
		JOIN users u ON u.id = p.author_id
		WHERE p.published = 1 AND strftime('%Y-%m', p.created_on) = ?
		ORDER BY p.created_on DESC
		LIMIT ? OFFSET ?
	`).all(yearMonth, req.itens, req.offset);

	const total = db.prepare(`
		SELECT COUNT(*) AS n FROM posts WHERE published = 1 AND strftime('%Y-%m', created_on) = ?
	`).get(yearMonth).n;

	req.pageData.posts = rows.map(shapePost);
	req.pageData.totalNumberOfPages = Math.ceil(total / req.itens);

	res.send(render.blog_index(req.pageData));
}
];
