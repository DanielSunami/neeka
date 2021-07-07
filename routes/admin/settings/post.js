const
	utils = require(rootDir+'/lib/utils'),
	fs = require('fs');

module.exports = [

utils.bodyTrim,

function(req, res) {

	let update = {
		smtp_host: req.body.smtp_host,
		smtp_port: req.body.smtp_port,
		smtp_user: req.body.smtp_user,
		smtp_secure: Boolean(req.body.smtp_secure),
		template: req.body.template,
		name: req.body.site_name,
		url: req.body.site_url,
		description: req.body.site_description,
		keywords: req.body.site_keywords,
		gaUID: req.body.gaUID
	};

	if(req.body.smtp_pass) update.smtp_pass = req.body.smtp_pass;

	Object.assign(NEEKA, update);

	fs.writeFileSync(rootDir+'/neekaconf.json', JSON.stringify(NEEKA));

	res.json({ ok: true });
}
];