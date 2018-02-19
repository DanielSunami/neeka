var render = require(rootDir+'/render');

module.exports = function(req, res){
	
	var pageData = {
		title: "Administration",
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		}
	};

	model.user
		.find()
		.select('-password')
		.sort({'created_on':1})
		.limit(10)
		.exec(function(err,docs){
			pageData.users = docs;

			res.send(render.admin_user(pageData));

		});
};