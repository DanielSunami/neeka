var render = require(rootDir+'/render'),
	mongoose = require('mongoose'),
	fs = require('fs');


module.exports = function(req, res){

	req.body.author = req.session.user.id;

	new model.post(req.body).save(function(err, doc){
		if(err) {
			console.log(err);
			res.json({ok: false});
		} else {
			res.json({ok: true, id: doc._id});
		}
	})

};