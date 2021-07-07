var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	multer = require('multer'), // v1.0.5 
	upload = multer(),
	sessionManager = require('./sessionManager.js'),
	cookieParser = require('cookie-parser'),
	schemas = require(rootDir+'/schemas'),
	crypto = require('crypto'),
	fs = require('fs'),
	util = require('util'),
	router = require('dir-routes');

global.utils = {
	criptoSenha: function (senha){
		var hmac = crypto.createHmac('sha256', '@#$FSfeW!'); // nunca mudar @#$FSfeW!
		hmac.update(senha);
		return hmac.digest('base64');
	},
	today: function (){
		return new Date(new Date().toDateString());
	}
}

global.installed = false;
global.model = {
	'user': mongoose.model('users', schemas.user),
	'post': mongoose.model('posts', schemas.post),
	'tag': mongoose.model('tags', schemas.tag),
	'forgot': mongoose.model('forgots', schemas.forgot),
	'meta_posts': mongoose.model('meta_posts', schemas.post.meta)
};

/**
 *	if install folder still exists then not installed
 */
if (fs.existsSync(rootDir+'/routes/install')) {
	global.installed = false;
	// TODO - ensure run conf
} else {
	global.installed = true;
	require('./mongooseConnect.js');
	require('./setupAppConf.js');
	
	global.mailer = require(rootDir+'/lib/mailer.js');
}

let dot = require("dot");
dot.log = false;
dot.process({
	global: '_render',
	destination: rootDir + "/render",
	path: (rootDir + "/templates/default")
});

let render = require(rootDir+"/render");

app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function (req, res, next){
	if(req.cookies.sessionid) {
		try{
			req.session = sessionManager.get(req.cookies.sessionid).data;
			next();
		}catch(err){ next(); }
	}else next();
});

/* block unauthorized access */
app.use(/\/admin(\/.*)?/, function (req, res, next){
	if(!req.session) res.redirect('/login');
	else next();
});

app.use(express.static(rootDir+'/public'));

app.get('*', function(req, res, next){
	if(!global.installed && req.path !== '/install' ) res.send('Nothing here...'); 
	else next();
});

app.use(router);

app.get('*', function(req, res){
	var pageData = {
		title:"Not Found",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		}
	};
	res.status(404).end(render.not_found(pageData));
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).end('Something broke!');
});

module.exports = app;