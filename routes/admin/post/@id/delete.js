const utils = require(rootDir+'/lib/utils');

module.exports = [

function(req, res, next) {

	model.post
	  .findByIdAndDelete(req.params.id)
	  .exec(function(err, post) {
		if(err){
			res.json({ ok: false });
		} else {

			res.json({ ok: true });
		}
	});
}

// TO-DO Update metas
];