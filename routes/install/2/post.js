var mongoose = require('mongoose')
	sessionManager = require(rootDir+'/lib/sessionManager.js');

module.exports = function(req, res, next){

	if(!req.body.firstname ||
	!req.body.email ||
	!req.body.password) {
		res.json({ok: false});
	} else {
		req.body.password = utils.criptoSenha(req.body.password);
		model['user'].create(req.body,function(err, novo){
			if(err) {
				console.log(err);
				res.json({ok:false});
			} else {
				res.setHeader("Set-Cookie",sessionManager.createSession({user: novo._id, name: novo.fullName}));
				res.json({ok: true});
			}
		});
	}
};