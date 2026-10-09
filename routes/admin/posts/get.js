const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/admin_posts');
	next();
},

function(req, res){
	const db = sqlite.open();
	req.pageData.title = "Administration";
	req.pageData.subtitle = "";
	req.pageData.posts = [];

	try {
		const rows = db.prepare(`
			SELECT p.id, p.title, p.published, p.author_id, p.created_on, p.last_update,
				u.firstname AS author_firstname, u.lastname AS author_lastname
			FROM posts p
			JOIN users u ON u.id = p.author_id
			ORDER BY p.created_on DESC
		`).all();
		req.pageData.posts = rows.map(shapePost);
	} catch (err) {
		console.log(err);
	}

	res.send(req.render(req.pageData));
}
];
