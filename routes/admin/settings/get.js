const utils = require(rootDir+'/lib/utils');

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

	res.send(req.render(req.pageData));
}
];
