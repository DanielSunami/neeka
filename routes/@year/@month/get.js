let render = require(rootDir+'/render'),
	fecha = require('fecha');

module.exports = [

function(req, res, next){
	// If @year is not a number redirect to other routes
	if(isNaN(req.params.year)) return next();

	let title = fecha.format(new Date(req.params.year, req.params.month, 1), 'MMMM, YYYY') + (req.query.page > 1 ? " - Page " + req.query.page : "");
	let url = "/" + req.params.year + "/" + req.params.month + (req.query.page > 1 ? "?page=" + req.query.page : "");

	req.query.itens = req.query.itens || 5;
	req.query.page = --req.query.page || 0;
	
	let pageData = {
		title: title,
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords,
			gaUID: NEEKA.gaUID
		},
		url: url,
		page: req.query.page //zero-based
	};

	model.post
		.find()
		.publishedByYearMonth(req.params.year, req.params.month, req.query.page, req.query.itens)
		.sort({'created_on':-1})
		.populate('author')
		.exec(function(err,docs){

			pageData.posts = docs;
			res.send(render.blog_index(pageData));

		});
}
];