var render = require(rootDir+'/render');

module.exports = function(req, res){

	var pageData = {
		title:"Recuperar Senha",
		subtitle:"Recuperar Senha",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		},
		id: req.params.id
	};

	model.forgot
		.find()
		.getUser(req.params.id)
		.exec(function(err,doc){
			pageData.found = doc ? true : false;
			
			res.send(render.password_recovery(pageData));
		});

};