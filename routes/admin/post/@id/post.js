const utils = require(rootDir+'/lib/utils');

const permissions = new PermissionGroup([PERMISSION.ALTER_POST]);

module.exports = [

/*
function(req, res, next){
	if(req.session.user.id == req.params.id || (req.session.user.id != req.params.id && permissions.allow(req.session.user.permissions)) ) {
		next();
	} else {
		res.status(401).end('unauthorized');
	}
},
*/

utils.bodyTrim,

function(req, res, next){

	req.data = {};

	req.data.update = {
		title: req.body.title,
		slug: req.body.slug,
		preview: req.body.preview,
		body: req.body.body,
		keywords: req.body.keywords,
		published: req.body.published == 'true' ? true : false,
		description: req.body.description,
		tags: req.body.tags,
		last_update: new Date(),
		$push: {
			updates: {
				user: req.session.user.id
			}
		}
	}

	const options = {
		new: false,
		lean: true,
		upsert: false
	}

	model.post.findByIdAndUpdate(req.params.id, req.data.update, options, function(err, oldPost) {
		if(err) {
			console.error('[MongoDBError] POST /admin/user/' + req.params.id + ' - ', err);
			res.status(500).json({ ok: false });
		} else if(!oldPost) {
			console.log('[PostNotFound] POST /admin/post/' + req.params.id);
			res.status(404).json({ ok: false });
		} else {
			req.data.oldPost = oldPost;
			next();
			return;
		}
	});
},

function(req, res, next) {
	// didnt change published status, no need to update meta doc
	if(req.data.oldPost.published == req.data.update.published) {
		next();
		return;
	} else if(req.data.update.published){
		model.meta_posts.addToPublished(function() {
			model.meta_posts.removeFromDraft(next);
		});
		return;
	} else {
		model.meta_posts.addToDraft(function(){
			model.meta_posts.removeFromPublished(next);
		});
		return;
	}
},
function(req, res) {
	res.json({ ok: true });
}
];