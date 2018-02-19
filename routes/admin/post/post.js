var render = require(rootDir+'/render'),
	mongoose = require('mongoose'),
	fs = require('fs');


module.exports = function(req, res){

	req.body.author = req.session.userId;

	new model.post(req.body).save(function(err){
		if(err) {
			console.log(err);
		} else {
			res.redirect('/admin');
		}
	})

};