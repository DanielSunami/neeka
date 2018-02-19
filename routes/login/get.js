var render = require(rootDir+'/render');

module.exports = function(req, res){

	var pageData = {
		title: "Login",
		subtitle: "Login",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		}
	};

	res.send(render.login(pageData));

};