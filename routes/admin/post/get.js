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
		},
		post: {
			_id: "",
			title: "",
			slug: "",
			preview: "",
			body: "",
			published: true,
			keywords: "",
			description: ""
		}
	};

	res.send(render.admin_post(pageData));
};