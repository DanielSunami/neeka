var render = require(rootDir+'/render'),
	mongoose = require('mongoose'),
	fs = require('fs');


module.exports = function(req, res){

	req.body.password = utils.criptoSenha(req.body.password);

	new model.user(req.body).save(function(err){
		if(err) {
			console.log(err);
			res.status(500).end('Something broke!');
		} else {
			res.redirect('/admin/user');
		}
	})

};