const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/blog_tags');
	next();
},

function(req, res) {
	const db = sqlite.open();
	req.pageData.title = 'Tags';
	req.pageData.url = '/tags';
	req.pageData.tags = db.prepare(`
		SELECT t.name, COUNT(p.id) AS n
		FROM tags t
		JOIN post_tags pt ON pt.tag_id = t.id
		JOIN posts p ON p.id = pt.post_id AND p.published = 1
		GROUP BY t.id
		HAVING n > 0
		ORDER BY t.name COLLATE NOCASE
	`).all();
	res.send(req.render(req.pageData));
}
];
