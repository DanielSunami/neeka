var render = require(rootDir+'/render'),
	mongoose = require('mongoose'),
	fs = require('fs');


module.exports = function(req, res){

	model.user.auth(req.body.email , req.body.password, function(err, user){
		if(err) {
			console.log(err);
		} else {
			if(user){
				res.setHeader("Set-Cookie",sessionManager.createSession({
					user: {
						id: user._id,
						name: user.fullName
					}
				}));
				res.json({ok:true});
			} else {
				res.json({ok:false});
			}
		}
	})

};