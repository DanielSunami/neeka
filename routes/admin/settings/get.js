var render = require(rootDir+'/render');

module.exports = function(req, res){
	res.send(render.admin_new_post({
		page: {
			title:""
		},
		site: {
			name: "Akafrx",
			url: "akafrx.com"
		},
		posts: [{
			url: "teste-teste",
			title: "Teste teste",
			preview: "esse é um texto longo. esse é um texto longo. esse é um texto longo. esse é um texto longo. esse é um texto longo. esse é um texto longo.",
			author: {
				name: "Daniel Sunami",
				website: "akafrx.com"
			},
			date: new Date()
		},
		{
			url: "teste-teste",
			title: "Teste teste",
			preview: "esse é um texto longo. esse é um texto longo. esse é um texto longo. esse é um texto longo. esse é um texto longo. esse é um texto longo.",
			author: {
				name: "Daniel Sunami",
				website: "akafrx.com"
			},
			date: new Date()
		}]
	}));
};