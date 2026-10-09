let render = require(rootDir+'/render');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');

module.exports = function(req, res){
	const db = sqlite.open();
	req.pageData.title = "Administration";
	req.pageData.subtitle = "";
	req.pageData.url = (NEEKA.url || "") + "/" + (req.params.year || "");

	const rows = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.keywords, p.description, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
		FROM posts p
		JOIN users u ON u.id = p.author_id
		ORDER BY p.created_on DESC
		LIMIT 7
	`).all();

	req.pageData.posts = rows.map(shapePost);
	res.send(render.admin_index(req.pageData));
};
