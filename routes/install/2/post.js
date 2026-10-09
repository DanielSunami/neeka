let fs = require('fs');

module.exports = function(req, res, next){

	if(req.body.smtp_secure) req.body.smtp_secure = true;
	else req.body.smtp_secure = false;

	req.body.template = "default";

	fs.writeFileSync(rootDir+'/neekaconf.json', JSON.stringify(req.body));
	res.json({ok: true});

};
