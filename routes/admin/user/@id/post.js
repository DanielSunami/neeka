var render = require(rootDir+'/render'),
	fs = require('fs');

var permissions = new PermissionGroup([PERMISSION.ALTER_USERS]);

module.exports = function(req, res){

	req.body.password = utils.criptoSenha(req.body.password);

	if(req.session.user.id == req.params.id || (req.session.user.id != req.params.id && permissions.allow(req.session.user.permissions)) ) {
		model.user.findById(req.params.id,function(err, doc){
			if(!doc){
				res.json({ok: false})
			} else {
				for(a in req.body) {
					if( req.body.hasOwnProperty(a) && (
							a === 'firstname' ||
							a === 'lastname' ||
							a === 'website' ||
							a === 'password' ||
							a === 'birthday' 
						)
					) {
						doc[a] = req.body[a];
					}
				}
				
				doc.save(function(err, doc){
					if(err) res.json({ok: false});
					else res.json({ok: true});
				});
			}
		});
	} else {
		res.status(401).end('unauthorized');
	}
};