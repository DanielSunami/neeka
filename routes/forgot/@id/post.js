var render = require(rootDir+'/render');

module.exports = function(req, res){

	model.forgot
		.find()
		.getUser(req.params.id)
		.exec(function(err,doc){
			if(doc) {
				model.user.findByIdAndUpdate(doc.user._id, { password: utils.criptoSenha(req.body.password) }, function (err, old){
					if(err) res.json({ok : false});
					else {
						doc.remove();
						res.json({ok : true});
					}
				});
			} else {
				res.json({ok : false});
			}
		});

};