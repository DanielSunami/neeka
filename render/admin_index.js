(function(){function admin_index(it
/**/) {
var out='<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+(it.site.name)+' | Administration</title><meta http-equiv="x-dns-prefetch-control" content="on"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"><link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"><link rel="stylesheet" href="/assets/style/normalize.min.css" type="text/css"><link rel="stylesheet" href="/assets/style/basscss.min.css" type="text/css" /><link rel="stylesheet" href="/assets/style/taggle.css" type="text/css" /><link rel="stylesheet" href="/assets/style/prism.css" type="text/css" /><link rel="stylesheet" href="/assets/style/loading.css" type="text/css" /><link rel="stylesheet" href="/assets/style/loading-btn.css" type="text/css" /><link rel="stylesheet" href="/assets/style/alertify.min.css" type="text/css" /><link rel="stylesheet" href="/assets/style/alertify.default.min.css" type="text/css" /><link rel="stylesheet" href="/assets/style/font.css" type="text/css" /><link rel="stylesheet" href="/assets/style/default-dark.css" type="text/css" /><link rel="stylesheet" href="/assets/style/card.css" type="text/css" /><link rel="stylesheet" href="/assets/style/form.css" type="text/css" /><link rel="stylesheet" href="/assets/style/buttons.css" type="text/css" /><link rel="stylesheet" href="/assets/style/footer.css" type="text/css" /><link rel="stylesheet" href="/assets/style/header.css" type="text/css" /><link rel="stylesheet" href="/assets/style/blog.css" type="text/css" /><link rel="stylesheet" href="/assets/style/admin.css" type="text/css" /></head><body><div class="page-wrap"><header class="mx-auto"><div class="navbar" role="navigation"><div class="navbar-brand-group"><a class="navbar-brand" href="//'+(it.site.url)+'">'+(it.site.name)+'</a><span style="display: inline-block;margin-left: 5px;"><a href="//'+(it.site.url)+'/admin">administration</a></span></div><hr class="mobile-hr"/><div class="navbar-menu"><ul class="list-reset"><li><a href="/admin/tags">Tags</a></li><li><a href="/admin/post">Content Management</a></li><li><a href="/admin/user">Users</a></li><li><a href="/admin/settings">Settings</a></li><li><a href="/admin/databaseConf">Database Credentials</a></li></ul></div></div></header><div class="container"><div class="max-width-4 mx-auto"><div class="clearfix mxn1"><div class="sm-col sm-col-12 px1 my2"><div class="table"><!-- table header --><div class="clearfix table-row header"><div class="sm-col sm-col-6 cell">Title</div><div class="sm-col sm-col-2 cell">Author</div><div class="sm-col sm-col-2 cell">Date</div><div class="sm-col sm-col-2 cell">Last Update</div></div><!-- rows -->';var fecha =  require('fecha');var arr1=it.posts;if(arr1){var post,index=-1,l1=arr1.length-1;while(index<l1){post=arr1[index+=1];out+='<div class="clearfix table-row"><div class="sm-col cell" style="width: 48%;"><a href="/admin/post/'+(post._id)+'">'+(post.title)+'</a></div><div class="sm-col" style="width: 2%; padding-top: 1em;"><a href="/'+(fecha.format(post.created_on, 'url'))+'/'+(post.slug)+'"><i class="material-icons">launch</i></a></div><div class="sm-col sm-col-2 cell">'+(post.author.fullName)+'</div><div class="sm-col sm-col-2 cell">'+(fecha.format(post.created_on, 'regular'))+'</div><div class="sm-col sm-col-2 cell">'+(fecha.format(post.last_update, 'regular'))+'</div></div>';} } out+='</div></div></div></div><div class="max-width-4 mx-auto"><div class="clearfix mxn1"><div class="sm-col sm-col-12 md-col-6 px1"><div class="table"><!-- table header --><div class="clearfix table-row header"><div class="sm-col sm-col-12 cell center" style="padding-left: 0;">Site Settings</div></div><!-- rows --><div class="clearfix table-row"><div class="sm-col sm-col-6 cell">Active template</div><div class="sm-col sm-col-6 cell">'+(it.site.template)+'</div></div><div class="clearfix table-row"><div class="sm-col sm-col-6 cell">Site Name</div><div class="sm-col sm-col-6 cell">'+(it.site.name)+'</div></div><div class="clearfix table-row"><div class="sm-col sm-col-6 cell">URL</div><div class="sm-col sm-col-6 cell">'+(it.site.url)+'</div></div><div class="clearfix table-row"><div class="sm-col sm-col-6 cell">Description</div><div class="sm-col sm-col-6 cell">'+(it.site.description)+'</div></div><div class="clearfix table-row"><div class="sm-col sm-col-6 cell">Keywords</div><div class="sm-col sm-col-6 cell">'+(it.site.keywords)+'</div></div><div class="clearfix table-row"><div class="sm-col sm-col-6 cell">Google Analytics UID</div><div class="sm-col sm-col-6 cell">'+(it.site.gaUID)+'</div></div></div></div><div class="sm-col sm-col-12 md-col-6 px1"><div class="table"><!-- table header --><div class="clearfix table-row header"><div class="sm-col sm-col-12 cell center" style="padding-left: 0;">Tag</div></div><!-- rows --><div class="clearfix table-row"><div class="sm-col sm-col-12 cell"></div></div></div></div></div></div></div></div><footer class="fit"><div class="poweredby">Powered by <a href="//danielsunami.github.io/neeka">Neeka</a></div></footer><script type="text/javascript" src="/assets/lib/prism.js"></script><script type="text/javascript" src="/assets/lib/alertify.min.js"></script></body></html>';return out;
}var itself=admin_index, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {_page.render=_page.render||{};_page.render['admin_index']=itself;}}());