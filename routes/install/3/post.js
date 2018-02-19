var mongoose = require('mongoose'),
	fs = require('fs');

module.exports = function(req, res, next){

	if(req.body.smtp_secure) req.body.smtp_secure = true;
	else req.body.smtp_secure = false;

	//add default template property
	req.body.template = "default";

	//unique document in meta_posts
	new model.meta_posts({
		_id: '5a5ab903486beb7fce003a39',
		published: 0,
		draft: 0
	}).save();

	//TO-DO warn about writing errors	
	fs.writeFileSync(rootDir+'/neekaconf.json', JSON.stringify(req.body));
	res.json({ok: true});

};