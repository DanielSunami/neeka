let render = require(rootDir+'/render');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapeUser } = require(rootDir+'/lib/pageData');

module.exports = function(req, res){
	const db = sqlite.open();
	req.pageData.title = "Administration";
	req.pageData.subtitle = "";

	const row = db.prepare(`
		SELECT id, firstname, lastname, website, email, birthday, permissions, editor, created_on, last_update
		FROM users WHERE id = ?
	`).get(req.params.id);

	req.pageData.user = shapeUser(row);
	res.send(render.admin_user_edit(req.pageData));
};
