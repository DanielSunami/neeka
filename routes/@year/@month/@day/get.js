let render = require(rootDir+'/render'),
	fecha = require('fecha');
const pagination = require(rootDir+'/lib/pagination');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');

module.exports = function(req, res, next){
	if(isNaN(req.params.year)) return next();

	pagination(req, res, function() {
		const db = sqlite.open();
		const year = String(req.params.year);
		const month = zeroLeftMask(req.params.month);
		const day = zeroLeftMask(req.params.day);
		const ymd = year + '-' + month + '-' + day;

		req.pageData.title = fecha.format(new Date(req.params.year, req.params.month - 1, req.params.day), 'DD MMMM, YYYY');
		req.pageData.url = "/" + year + "/" + month + "/" + day;
		req.pageData.page = req.page;

		const rows = db.prepare(`
			SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
				p.keywords, p.description, p.created_on, p.last_update,
				u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
			FROM posts p
			JOIN users u ON u.id = p.author_id
			WHERE p.published = 1 AND strftime('%Y-%m-%d', p.created_on) = ?
			ORDER BY p.created_on DESC
			LIMIT ? OFFSET ?
		`).all(ymd, req.itens, req.offset);

		const total = db.prepare(`
			SELECT COUNT(*) AS n FROM posts WHERE published = 1 AND strftime('%Y-%m-%d', created_on) = ?
		`).get(ymd).n;

		req.pageData.posts = rows.map(shapePost);
		req.pageData.totalNumberOfPages = Math.ceil(total / req.itens);

		res.send(render.blog_index(req.pageData));
	});
};
