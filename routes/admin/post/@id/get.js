const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost, shapeUser } = require(rootDir+'/lib/pageData');
const { attachTags } = require(rootDir+'/lib/tags');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/admin_post');
	next();
},

function(req, res) {
	const db = sqlite.open();
	const user = shapeUser(db.prepare(`SELECT id, editor FROM users WHERE id = ?`).get(req.session.user.id));

	req.pageData.title = "Administration";
	req.pageData.subtitle = "";
	req.pageData.post = {};
	req.pageData.user = user || { preferences: { editor: 'trix' } };

	const row = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.description, p.og_image, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname,
			u.website AS author_website, u.editor AS author_editor
		FROM posts p
		JOIN users u ON u.id = p.author_id
		WHERE p.id = ?
	`).get(req.params.id);

	if(!row){
		res.redirect('/admin/posts');
	} else {
		req.pageData.post = shapePost(row);
		attachTags(db, req.pageData.post);
		res.send(req.render(req.pageData));
	}
}
];
