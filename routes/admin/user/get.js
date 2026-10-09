let render = require(rootDir+'/render');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapeUser } = require(rootDir+'/lib/pageData');

module.exports = function(req, res){
	const db = sqlite.open();
	req.pageData.title = "Administration";
	req.pageData.subtitle = "";

	const rows = db.prepare(`
		SELECT id, firstname, lastname, website, email, birthday, permissions, editor, created_on, last_update
		FROM users
		ORDER BY created_on ASC
		LIMIT 10
	`).all();

	req.pageData.users = rows.map(shapeUser);
	res.send(render.admin_user(req.pageData));
};
