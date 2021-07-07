module.exports = [
function(req, res, next) {

	req.body.author = req.session.user.id;

	new model.post(req.body).save(function(err, newPost){
		if(err) {
			console.log('[MongoDBError] POST /admin/post - ', err);
			res.json({ok: false});
		} else {
			req.newPost = newPost;
			next();
		}
	})

},
function(req, res, next) {
	if(req.newPost.published)
		model.meta_posts.addToPublished(next);
	else
		model.meta_posts.addToDraft(next);
},
function(req, res, next) {
	model.meta_posts.addToYear(req.newPost.created_on.getFullYear(), next);
},
function(req, res, next) {
	model.meta_posts.addToYearMonth(req.newPost.created_on.getFullYear(), req.newPost.created_on.getMonth(), next);
},
function(req, res, next) {
	model.meta_posts.addToAuthor(req.newPost.author.toString(), next);
},
function(req, res) {
	res.json({ ok: true, id: req.newPost._id });
}
];