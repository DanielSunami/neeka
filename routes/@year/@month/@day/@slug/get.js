var render = require(rootDir+'/render');

module.exports = function(req, res, next){
	// If @year is not a number redirect to other routes
	if(isNaN(req.params.year)) return next();

	var pageData = {
		title: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords,
			gaUID: NEEKA.google_analytics,
			path: req.path
		},
		url: NEEKA.url+"/"+req.params.year+"/"+req.params.month+"/"+req.params.day+"/"+req.params.slug,
	};


	model.post
		.find()
		.bySlug(req.params.year, req.params.month, req.params.day, req.params.slug)
		.populate('author')
		.exec(function(err,doc){
			if(!doc){
				res.status(404).end("not found!");
			} else {
				pageData.post = doc;
				pageData.title = doc.title;

				if(doc.description) pageData.site.description = doc.description;
				if(doc.keywords) pageData.site.keywords = doc.keywords;

				res.send(render.blog_post(pageData));
			}
		});
};