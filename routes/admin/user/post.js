var render = require(rootDir+'/render'),
	fs = require('fs');

var permissions = new PermissionGroup([PERMISSION.CREATE_USERS]);

module.exports = function(req, res){
	
	req.body.password = utils.criptoSenha(req.body.password);
	if(!permissions.allow(req.session.user.permissions))
		res.status(401).end('unauthorized');  
	else {
		new model.user(req.body).save(function(err){
			if(err) {
				console.log(err);
				res.status(500).end('Something broke!');
			} else {
				res.redirect('/admin/user');
			}
		});
	}
};