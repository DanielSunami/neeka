const utils = require(rootDir+'/lib/utils');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/admin_post');
	next();
},

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
	
	const pageData = {
		title: "Administration",
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		},
		post: {
			_id: "",
			title: "",
			slug: "",
			preview: "",
			body: "",
			published: true,
			keywords: "",
			description: ""
		},
		user: req.data.user
	};

	res.send(req.render(pageData));
}
];