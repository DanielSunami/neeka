let fs = require('fs'),
	util = require('util');

module.exports = function(req, res, next){
	if(!req.body.hostname ||
	!req.body.port ||
	!req.body.dbname) {
		res.json({ok: false});
	} else {
		obj = {
			user: req.body.user,
			password: req.body.password,
			hostname: req.body.hostname,
			port: req.body.port,
			dbname: req.body.dbname
		};
		fs.writeFileSync(rootDir+'/dbconf.json', JSON.stringify(obj));
		var mongoUri;
		if(!req.body.user)
			mongoUri = util.format('mongodb://%s:%d/%s',
				obj.hostname,
				obj.port,
				obj.dbname);
		else
			mongoUri = util.format('mongodb://%s:%s@%s:%d/%s',
				obj.user,
				obj.password,
				obj.hostname,
				obj.port,
				obj.dbname);

		require(rootDir+'/lib/mongooseConnect');
		res.json({ok:true});
	}
};