const utils = require(rootDir+'/lib/utils');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/admin_posts');
	next();
},

function(req, res){
	
	const pageData = {
		title: "Administration",
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		},
		posts: []
	};

	model.post
	  .find()
	  .select('_id title published author created_on last_update')
	  .populate({ path: 'author', select: 'firstname lastname' })
	  .lean()
	  .exec(function(err, posts) {
		if(err) {
			console.log(err);
			// append error to pageData
			res.send(req.render(pageData));
		} else {
			pageData.posts = posts;

			res.send(req.render(pageData));
		}
	})

}
];