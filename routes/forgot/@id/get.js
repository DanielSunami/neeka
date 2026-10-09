let render = require(rootDir+'/render');
const sqlite = require(rootDir+'/lib/sqlite');

module.exports = function(req, res){
	const db = sqlite.open();
	req.pageData.title = "Recuperar Senha";
	req.pageData.subtitle = "Recuperar Senha";
	req.pageData.id = req.params.id;

	const doc = db.prepare(`
		SELECT id FROM forgots
		WHERE id = ? AND datetime(created_on) > datetime('now', '-48 hours')
	`).get(req.params.id);

	req.pageData.found = !!doc;
	res.send(render.password_recovery(req.pageData));
};
