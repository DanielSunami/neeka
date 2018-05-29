var render = require(rootDir+'/render');

var permissions = new PermissionGroup([PERMISSION.DELETE_USERS]);

module.exports = function(req, res){
	
	var pageData = {
		title: "Administration",
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		}
	};

	if(req.session.user.id != req.params.id) {
		if(!permissions.allow(req.session.permissions))
			res.status(401).end('unauthorized');
		else {
			model.user
			.findById(req.params.id)
			.exec(function(err,doc){
				if(err) res.json({ok: false}); 
				else{
					doc.remove();
					res.json({ok: true});
				}
			});
		}
	} else {
		model.user
			.findById(req.params.id)
			.exec(function(err,doc){
				if(err) res.json({ok: false}); 
				else{
					doc.remove();
					res.json({ok: true});
				}
			});
	}
};