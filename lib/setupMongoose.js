var mongoose = require('mongoose'),
	db = mongoose.connection;

db.on('connecting', function() {
	console.info('[MongoDB] Connecting...');
});

db.on('error', function(error) {
	console.error('[MongoDB] Error in connection: ' + error);
	mongoose.disconnect();
});

db.on('connected', function() {
	console.info('[MongoDB] Connected!');
});

db.once('open', function() {
	console.info('[MongoDB] Connection opened!');
});

db.on('reconnected', function () {
	console.info('[MongoDB] Reconnected!');
});

db.on('disconnected', function() {
	console.info('[MongoDB] Disconnected!');
	mongoose.connect(global.mongoUri, {server:{auto_reconnect:true}});
});