const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapeUser } = require(rootDir+'/lib/pageData');

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
	req.pageData.post = {
		_id: "",
		title: "",
		slug: "",
		preview: "",
		body: "",
		published: true,
		description: "",
		og_image: "",
		tags: []
	};
	req.pageData.user = user || { preferences: { editor: 'trix' } };

	res.send(req.render(req.pageData));
}
];
