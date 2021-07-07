module.exports = [
function(req, res, next) {

	model.meta_posts.findByIdAndDelete('5a5ab903486beb7fce003a39').exec(function(err, deletedDoc) {
		if(err) {
			console.error('[MongoDBError] POST /admin/settings/resetMeta', err);
			res.json({ ok: false });
		} else next();
	});
},
function(req, res, next) {
	//unique document in meta_posts
	new model.meta_posts({
		_id: '5a5ab903486beb7fce003a39',
		published: 0,
		draft: 0
	}).save(function(err, metaDoc) {

		res.json({ok: true});
	});
}
];