const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/legal');
	next();
},

function(req, res) {
	req.pageData.title = 'Política de Privacidade';
	req.pageData.url = '/politica-de-privacidade';
	req.pageData.canonical = 'https://' + (req.pageData.site.url || '').replace(/^https?:\/\//i, '').replace(/\/$/, '') + '/politica-de-privacidade';
	req.pageData.html = sqlite.getPage('privacy');
	res.send(req.render(req.pageData));
}
];
