let render = require(rootDir+'/render');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');
const { attachTags } = require(rootDir+'/lib/tags');

module.exports = function(req, res){
	const db = sqlite.open();
	req.pageData.title = "Administration";
	req.pageData.subtitle = "";
	req.pageData.url = (NEEKA.url || "") + "/" + (req.params.year || "");

	const rows = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.description, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
		FROM posts p
		JOIN users u ON u.id = p.author_id
		ORDER BY p.created_on DESC
		LIMIT 7
	`).all();

	req.pageData.posts = rows.map(shapePost);
	attachTags(db, req.pageData.posts);
	req.pageData.tags = db.prepare(`
		SELECT t.name, COUNT(pt.post_id) AS n
		FROM tags t
		LEFT JOIN post_tags pt ON pt.tag_id = t.id
		GROUP BY t.id
		ORDER BY t.name COLLATE NOCASE
	`).all();
	res.send(render.admin_index(req.pageData));
};
