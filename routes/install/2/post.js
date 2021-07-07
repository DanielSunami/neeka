let sessionManager = require(rootDir+'/lib/sessionManager.js');

module.exports = function(req, res, next){

	if(!req.body.firstname ||
	!req.body.email ||
	!req.body.password) {
		res.json({ok: false});
	} else {
		req.body.password = utils.criptoSenha(req.body.password);
		req.body.permissions = [0,1,2,3,4,5,6,7,8,9];
		model.user.create(req.body,function(err, novo){
			if(err) {
				console.log(err);
				res.json({ok:false});
			} else {
				res.setHeader("Set-Cookie",sessionManager.createSession({user: novo._id, name: novo.fullName, permissions: novo.permissions}));
				res.json({ok: true});
			}
		});
	}
};