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
	},
	installed : false
}

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
	utils.installed = false;
	// TODO - ensure run conf
} else {
	utils.installed = true;
	try{
		fs.readFile(rootDir+'/dbconf.json','utf8', function(err, raw){
			if(err){
				console.error('Error while reading MongoDB configuration file! (dbconf.json)\nError:'+err+'\nExiting!');
			} else {
				var mongoConf = JSON.parse(raw);
				if(mongoConf.user)
					global.mongoUri = util.format('mongodb://%s:%d/%s',
						mongoConf.hostname,
						mongoConf.port,
						mongoConf.dbname);
				else
					global.mongoUri = util.format('mongodb://%s:%s@%s:%d/%s',
						mongoConf.user,
						mongoConf.password,
						mongoConf.hostname,
						mongoConf.port,
						mongoConf.dbname);

				mongoose.connect(global.mongoUri, {server:{auto_reconnect:true}});
			}
		});
	}catch(err){
		console.error('MongoDB configuration file missing! (dbconf.json)\nExiting!');
	}

	global.NEEKA = JSON.parse(fs.readFileSync(rootDir+'/neekaconf.json', 'utf8'));
	global.mailer = require(rootDir+'/lib/mailer.js');
}

var dot = require("dot");
dot.log = false;
dot.process({
	global: "_page.render"
	, destination: rootDir + "/render"
	, path: (rootDir + "/templates/default")
});

var render = require(rootDir+"/render");

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
	if(!global.utils.installed && req.path !== '/install' ) res.send('Nothing here...'); 
	else next();
});

console.log(router.log);
router.param('year', function (req, res, next, value) {
	var pageData = {
		title:"Home",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords
		}
	};
	if(isNaN(value)) res.status(404).end(render.not_found(pageData));
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