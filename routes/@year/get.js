const utils = require(rootDir+'/lib/utils');

module.exports = [

function(req, res, next) {

	// If @year is not a number redirect to other routes
	if(isNaN(req.params.year)) return next();

	req.render = utils.requireUncached(rootDir+'/render/blog_index');
	next();
},

function(req, res, next) {

	// If @year is not a number redirect to other routes
	if(isNaN(req.params.year)) return next();

	req.query.itens = req.query.itens || 5;
	req.query.page = --req.query.page || 0;
	
	req.pageData = {
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
	  .lean()
	  .exec(function(err, docs){ 
		req.pageData.posts = docs;

		next();
	});
},

function(req, res, next) {

	// If @year is not a number redirect to other routes
	if(isNaN(req.params.year)) return next();

	model.meta_posts
	  .findOne()
	  .exec(function(err, meta){
	  	let total = 0;

		for (let i = 0; i < meta.byYear.length; i++) {
			if(meta.byYear[i].year == req.params.year) {
				total = meta.byYear[i].qty;				
			}
		}

		req.pageData.totalNumberOfPages = Math.ceil(total/req.query.itens);

		res.send(req.render(req.pageData));
	});
}
];