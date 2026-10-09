let render = require(rootDir+'/render');

module.exports = function(req, res){
	req.pageData.title = "Esqueci Minha Senha";
	req.pageData.subtitle = "Esqueci Minha Senha";
	res.send(render.forgot(req.pageData));
};
