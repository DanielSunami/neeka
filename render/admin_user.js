(function(){function admin_user(it
/**/) {
var out='<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+(it.site.name)+' | Administration</title><meta http-equiv="x-dns-prefetch-control" content="on"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"><link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"><link rel="stylesheet" href="/assets/style/normalize.min.css" type="text/css"><link rel="stylesheet" href="/assets/style/basscss.min.css" type="text/css" /><link rel="stylesheet" href="/assets/style/taggle.css" type="text/css" /><link rel="stylesheet" href="/assets/style/prism.css" type="text/css" /><link rel="stylesheet" href="/assets/style/loading.css" type="text/css" /><link rel="stylesheet" href="/assets/style/loading-btn.css" type="text/css" /><link rel="stylesheet" href="/assets/style/alertify.min.css" type="text/css" /><link rel="stylesheet" href="/assets/style/alertify.default.min.css" type="text/css" /><link rel="stylesheet" href="/assets/style/font.css" type="text/css" /><link rel="stylesheet" href="/assets/style/default-dark.css" type="text/css" /><link rel="stylesheet" href="/assets/style/card.css" type="text/css" /><link rel="stylesheet" href="/assets/style/form.css" type="text/css" /><link rel="stylesheet" href="/assets/style/buttons.css" type="text/css" /><link rel="stylesheet" href="/assets/style/footer.css" type="text/css" /><link rel="stylesheet" href="/assets/style/header.css" type="text/css" /><link rel="stylesheet" href="/assets/style/blog.css" type="text/css" /><link rel="stylesheet" href="/assets/style/admin.css" type="text/css" /></head><body><div class="page-wrap"><header class="mx-auto"><div class="navbar" role="navigation"><div class="navbar-brand-group"><a class="navbar-brand" href="//'+(it.site.url)+'">'+(it.site.name)+'</a><span style="display: inline-block;margin-left: 5px;"><a href="//'+(it.site.url)+'/admin">administration</a></span></div><hr class="mobile-hr"/><div class="navbar-menu"><ul class="list-reset"><li><a href="/admin/tags">Tags</a></li><li><a href="/admin/post">Content Management</a></li><li><a href="/admin/user">Users</a></li><li><a href="/admin/settings">Settings</a></li><li><a href="/admin/databaseConf">Database Credentials</a></li></ul></div></div></header><div class="container"><div class="max-width-4 mx-auto"><div class="clearfix mxn1"><div class="sm-col sm-col-12 px1 my2"><div class="table"><!-- table header --><div class="clearfix table-row header"><div class="sm-col cell" style="width: 9%">Firstname</div><div class="sm-col cell" style="width: 9%">Lastname</div><div class="sm-col cell" style="width: 26%">Website</div><div class="sm-col cell" style="width: 21%">Email</div><div class="sm-col cell" style="width: 11.5%">Birthday</div><div class="sm-col cell" style="width: 11.5%">Created On</div><div class="sm-col cell" style="width: 11.5%">Last Update</div></div><!-- rows -->';var fecha =  require('fecha');var arr1=it.users;if(arr1){var user,index=-1,l1=arr1.length-1;while(index<l1){user=arr1[index+=1];out+='<div class="clearfix table-row"><div class="sm-col cell" style="width: 9%">'+(user.firstname)+'</div><div class="sm-col cell" style="width: 9%">'+(user.lastname)+'</div><div class="sm-col cell" style="width: 26%">'+(user.website)+'</div><div class="sm-col cell" style="width: 21%">'+(user.email)+'</div><div class="sm-col cell" style="width: 11.5%">';if(user.birthday){out+=' '+(fecha.format(user.birthday, 'regular'))+' ';}else{out+=' N/A ';}out+='</div><div class="sm-col cell" style="width: 11.5%">'+(fecha.format(user.created_on, 'regular'))+'</div><div class="sm-col cell" style="width: 11.5%">'+(fecha.format(user.last_update, 'regular'))+'</div></div>';} } out+='</div></div></div><form method="POST" name="user" action="/admin/user/"> <input type="hidden" name="id"/><div class="clearfix mxn1"><div class="sm-col sm-col-12 px1 my2"><div class="table"><!-- table header --><div class="clearfix table-row header"><div class="sm-col sm-col-12 cell center" style="padding-left: 0">New User</div></div><div class="clearfix"><div class="sm-col sm-col-6 px1"><div class="form-group"><label>Firstname<input type="text" name="firstname"/></label></div></div><div class="sm-col sm-col-6 px1"><div class="form-group"><label>Lastname<input type="text" name="lastname"/></label></div></div></div><div class="clearfix"><div class="sm-col sm-col-6 px1"><div class="form-group"><label>Website<input type="text" name="website"/></label></div></div><div class="sm-col sm-col-6 px1"><div class="form-group"><label>Birthday<input type="text" name="birthday"/></label><small>day-month-year - 21/01/1990 </small></div></div></div><div class="clearfix"><div class="sm-col sm-col-6 px1"><div class="form-group"><label>Email<input type="text" name="email"/></label></div></div><div class="sm-col sm-col-6 px1"><div class="form-group"><label>Password<input type="password" name="password"/></label></div></div></div></div></div></div><div><div class="clearfix"><button id="btn-save" class="green col-right col-3 mx1 ld ld-ext-right">Save<div class="ld ld-ring ld-cycle" style="font-size: 1.6em;"></div></button></div></div></form></div></div></div><footer class="fit"><div class="poweredby">Powered by <a href="//danielsunami.github.io/neeka">Neeka</a></div></footer><script type="text/javascript" src="/assets/lib/prism.js"></script><script src="/assets/lib/serialize.min.js"></script><script type="text/javascript" src="/assets/lib/alertify.min.js"></script><script type="text/javascript">[].map.call(document.querySelectorAll(\'form input\'), function(input){input.onkeypress = function(e) {if ( e.which == 13 ) e.preventDefault();}});</script></body></html>';return out;
}var itself=admin_user, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {_page.render=_page.render||{};_page.render['admin_user']=itself;}}());