const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/legal');
	next();
},

function(req, res) {
	req.pageData.title = 'Termos de Uso';
	req.pageData.url = '/termos-de-uso';
	req.pageData.canonical = 'https://' + (req.pageData.site.url || '').replace(/^https?:\/\//i, '').replace(/\/$/, '') + '/termos-de-uso';
	req.pageData.html = sqlite.getPage('terms');
	res.send(req.render(req.pageData));
}
];
