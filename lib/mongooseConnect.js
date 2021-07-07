let mongoose = require('mongoose'),
	util = require('util'),
	mongoConf,
	mongoUri;

try{
	mongoConf = require(rootDir+'/dbconf.json');
} catch(err) {
	console.error('MongoDB configuration file missing or invalid! (dbconf.json)\nExiting!');
	process.exit(0);
}

if(!mongoConf.user)
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

require('./setupMongoose.js')(mongoUri);
mongoose.connect(mongoUri, { useNewUrlParser: true, auto_reconnect:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true });