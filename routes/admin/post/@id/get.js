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

	model.post.findById(req.params.id,function(err, doc){
		if(!doc){
			res.redirect('/admin/post');
		} else {
			pageData.post = doc;
			
			res.send(render.admin_post(pageData));
		}
	});
};