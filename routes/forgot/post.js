var render = require(rootDir+'/render'),
	crypt = require(rootDir+'/lib/sha1.js');

module.exports = function(req, res){

	var pageData = {
		title:"Home",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		}
	};

	model.user.findOne({ email: new RegExp(req.body.email, 'i') }, function(err, doc){

		if(doc) {
			var body = {
				id: crypt.hex_sha1(new String(Math.random())),
				user: doc._id
			};

			new model.forgot(body).save(function(err, novo){
				if(err) {
					res.json({ok : false});
				} else {
					mailer.sendMail('forgot', {dest: req.body.email, nome: doc.fullName, id: body.id});
					res.json({ok : true});
				}
			});
		} else {
			res.json({ok : false})
		}

	});
	
};