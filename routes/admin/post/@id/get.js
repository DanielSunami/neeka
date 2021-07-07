const utils = require(rootDir+'/lib/utils');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/admin_post');
	next();
},

// fetch auth user preferences, NOT author preferences
function(req, res, next) {
	req.data = {};

	model.user
	  .findById(req.session.user.id)
	  .select('preferences')
	  .lean()
	  .exec(function(err, user) {
		req.data.user = user;
		next();
	});
},

function(req, res) {

	let pageData = {
		title: "Administration",
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		},
		post: {},
		user: req.data.user
	};

	model.post
	  .findById(req.params.id)
	  .populate({ path: 'author', select: 'preferences' })
	  .lean()
	  .exec(function(err, post) {
		if(!post){
			res.redirect('/admin/posts');
		} else {
			pageData.post = post;
			res.send(req.render(pageData));
		}
	});
}
];