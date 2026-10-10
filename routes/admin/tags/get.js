const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/admin_tags');
	next();
},

function(req, res) {
	const db = sqlite.open();
	req.pageData.title = 'Administration';
	req.pageData.subtitle = '';
	req.pageData.tags = db.prepare(`
		SELECT t.id, t.name, COUNT(pt.post_id) AS n
		FROM tags t
		LEFT JOIN post_tags pt ON pt.tag_id = t.id
		GROUP BY t.id
		ORDER BY t.name COLLATE NOCASE
	`).all();
	res.send(req.render(req.pageData));
}
];
