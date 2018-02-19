var render = require(rootDir+'/render');

module.exports = function(req, res){

	req.query.itens = req.query.itens || 5;
	req.query.page = --req.query.page || 0;
	
	var pageData = {
		title: req.params.year,
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords,
			gaUID: NEEKA.google_analytics
		},
		url: NEEKA.url+"/"+req.params.year,
		page: req.query.page //zero-based
	};

	model.post
		.find()
		.publishedByYear(req.params.year, req.query.page, req.query.itens)
		.sort({'created_on':-1})
		.populate('author')
		.exec(function(err,docs){ 
			pageData.posts = docs;

			res.send(render.blog_index(pageData));
		});
};