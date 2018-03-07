var render = require(rootDir+'/render');

module.exports = function(req, res){

	req.query.itens = req.query.itens || 5;
	req.query.page = --req.query.page || 0;
	
	var pageData = {
		title:"Home",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords,
			gaUID: NEEKA.google_analytics
		},
		page: req.query.page //zero-based
	};

	model.post
		.find()
		.published(req.query.page, req.query.itens)
		.sort({'created_on':-1})
		.populate('author')
		.exec(function(err,docs){
			pageData.posts = docs;
			
			model.meta_posts.find().published().exec(function(err, meta){
				pageData.totalNumberOfPages = Math.ceil(meta.published/req.query.itens);
				
				res.send(render.blog_index(pageData));
			})
		});
};