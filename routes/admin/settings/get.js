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

	let pageData = {
		title: "Administration",
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords,
			gaUID: NEEKA.gaUID,
			template: NEEKA.template
		},
		url: NEEKA.url+"/admin/settings",
		NEEKA: obj
	};

	res.send(req.render(pageData));
}
];