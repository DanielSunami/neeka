const utils = require(rootDir+'/lib/utils');
const sqlite = require(rootDir+'/lib/sqlite');

module.exports = [

function(req, res, next) {

	req.render = utils.requireUncached(rootDir + '/render/admin_settings');
	next();
},

function(req, res) {

	let obj = {};
	Object.assign(obj, NEEKA);
	delete obj.smtp_pass;

	req.pageData.title = "Administration";
	req.pageData.subtitle = "";
	req.pageData.url = NEEKA.url+"/admin/settings";
	req.pageData.NEEKA = obj;
	req.pageData.privacy_html = sqlite.getPage('privacy');
	req.pageData.terms_html = sqlite.getPage('terms');

	res.send(req.render(req.pageData));
}
];
