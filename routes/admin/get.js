var render = require(rootDir+'/render');

module.exports = function(req, res){

	var pageData = {
		title: "Administration",
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords,
			gaUID: NEEKA.gaUID,
			template: NEEKA.template
		},
		url: NEEKA.url+"/"+req.params.year
	};

	model.post
		.find()
		.sort({'created_on':-1})
		.limit(7)
		.populate('author')
		.exec(function(err,docs){
			pageData.posts = docs;
			
			res.send(render.admin_index(pageData));

		});

};