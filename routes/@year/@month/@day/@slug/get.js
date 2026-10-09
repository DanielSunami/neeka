let render = require(rootDir+'/render');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');

module.exports = function(req, res, next){
	if(isNaN(req.params.year)) return next();

	const db = sqlite.open();
	const year = String(req.params.year);
	const month = zeroLeftMask(req.params.month);
	const day = zeroLeftMask(req.params.day);
	const ymd = year + '-' + month + '-' + day;

	req.pageData.url = "/" + year + "/" + month + "/" + day + "/" + req.params.slug;

	const row = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.keywords, p.description, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
		FROM posts p
		JOIN users u ON u.id = p.author_id
		WHERE p.published = 1
			AND p.slug = ? COLLATE NOCASE
			AND strftime('%Y-%m-%d', p.created_on) = ?
	`).get(req.params.slug, ymd);

	if(!row){
		res.status(404).end("not found!");
	} else {
		const post = shapePost(row);
		req.pageData.post = post;
		req.pageData.title = post.title;
		if(post.description) req.pageData.site.description = post.description;
		if(post.keywords) req.pageData.site.keywords = post.keywords;
		res.send(render.blog_post(req.pageData));
	}
};
