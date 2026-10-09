let render = require(rootDir+'/render');

module.exports = function(req, res){
	req.pageData.title = "Login";
	req.pageData.subtitle = "Login";
	res.send(render.login(req.pageData));
};
