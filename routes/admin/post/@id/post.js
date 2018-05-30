var render = require(rootDir+'/render'),
	mongoose = require('mongoose'),
	fs = require('fs');

var permissions = new PermissionGroup([PERMISSION.ALTER_POST]);

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

	if(req.session.user.id == req.params.id || (req.session.user.id != req.params.id && permissions.allow(req.session.user.permissions)) ) {
		model.post.findById(req.params.id,function(err, doc){
			if(!doc){
				res.redirect('/admin/post');
			} else {
				for(a in req.body) {
					if( req.body.hasOwnProperty(a) && (
							a === 'title' ||
							a === 'slug' ||
							a === 'preview' ||
							a === 'body' ||
							a === 'keywords' ||
							a === 'description' ||
							a === 'published'
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