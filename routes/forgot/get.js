var render = require(rootDir+'/render');

module.exports = function(req, res){

	var pageData = {
		title:"Esqueci Minha Senha",
		subtitle:"Esqueci Minha Senha",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		}
	};

	res.send(render.forgot(pageData));

};


