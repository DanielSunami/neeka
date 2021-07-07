const utils = require(rootDir+'/lib/utils');

module.exports = [

function(req, res, next) {
	req.render = utils.requireUncached(rootDir+'/render/blog_index');
	next();
},

function(req, res, next) {

	req.query.itens = req.query.itens || 5;
	req.query.page = --req.query.page || 0;
	
	req.pageData = {
		title:"Home",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords,
			gaUID: NEEKA.gaUID
		},
		page: req.query.page //zero-based
	};

	model.post
	  .find()
	  .published(req.query.page, req.query.itens)
	  .sort({'created_on':-1})
	  .populate('author')
	  .exec(function(err, docs){
		req.pageData.posts = docs;

		next();
	});
},

function(req, res) {
	model.meta_posts
	  .find()
	  .published()
	  .exec(function(err, meta){
	  	console.log(meta);
		req.pageData.totalNumberOfPages = Math.ceil(meta.published/req.query.itens);
		
		res.send(req.render(req.pageData));
	});
}
];