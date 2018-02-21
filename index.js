global.rootDir = __dirname;
global.zeroLeftMask = function (number, size) {
	number = number.toString();
	for(; size - number.length > 0;) number = "0" + number;
	return number;
}

Date.prototype.toString = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}
Date.prototype.toJSON = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}


var express = require('express'),
	http = require('http'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	multer = require('multer'), // v1.0.5 
	upload = multer(),
	sessionManager = require('./lib/sessionManager.js'),
	cookieParser = require('cookie-parser'),
	schemas = require(rootDir+'/schemas'),
	crypto = require('crypto'),
	fs = require('fs'),
	util = require('util'),
	router = require('dir-routes'),
	mongoUri = "",
	fecha = require('fecha');

var i18n = {
	ptbr: {
		dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
		dayNames: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
		monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
		monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],  
		amPm: ['am', 'pm'],
		// TO-DO 
		DoFn: function (D) {
		    return D + [ 'th', 'st', 'nd', 'rd' ][ D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10 ];
		}
	},	
	en: {
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		amPm: ['am', 'pm'],
		DoFn: function (D) {
		    return D + [ 'th', 'st', 'nd', 'rd' ][ D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10 ];
		}
	}
};

fecha.i18n = i18n['ptbr'];
fecha.masks.brazilian = 'dddd, D [de] MMMM [de] YYYY';
fecha.masks.url = 'YYYY/MM/DD';
fecha.masks.regular = 'DD/MM/YYYY';
fecha.masks.iso = 'YYYY-MM-DD';

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

var db = mongoose.connection;
db.on('connecting', function() {
	console.info('Connecting to MongoDB...');
});

db.on('error', function(error) {
	console.error('Error in MongoDB connection: ' + error);
	mongoose.disconnect();
});

db.on('connected', function() {
	console.info('MongoDB connected!');
});

db.once('open', function() {
	console.info('MongoDB connection opened!');
});

db.on('reconnected', function () {
	console.info('MongoDB reconnected!');
});

db.on('disconnected', function() {
	console.info('MongoDB disconnected!');
	mongoose.connect(mongoUri, {server:{auto_reconnect:true}});
});

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
					mongoUri = util.format('mongodb://%s:%d/%s',
						mongoConf.hostname,
						mongoConf.port,
						mongoConf.dbname);
				else
					mongoUri = util.format('mongodb://%s:%s@%s:%d/%s',
						mongoConf.user,
						mongoConf.password,
						mongoConf.hostname,
						mongoConf.port,
						mongoConf.dbname);

				mongoose.connect(mongoUri, {server:{auto_reconnect:true}});
			}
		});
	}catch(err){
		console.error('MongoDB configuration file missing! (dbconf.json)\nExiting!');
	}

	global.NEEKA = JSON.parse(fs.readFileSync(rootDir+'/neekaconf.json', 'utf8'));
	global.mailer = require(rootDir+'/lib/mailer.js');
}

require("dot").process({
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

var httpServer = http.createServer(app);

httpServer.listen(8081, function() {
	console.log('Listening on port %d', httpServer.address().port);
});