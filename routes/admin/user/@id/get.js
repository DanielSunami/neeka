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
		.findById(req.params.id)
		.exec(function(err,doc){
			pageData.user = doc;

			res.send(render.admin_user_edit(pageData));
		});
};