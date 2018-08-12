var mongoose = require('mongoose'),
	db = mongoose.connection,
	tries = 0;

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
	tries = 0;
});

db.on('reconnected', function () {
	console.info('[MongoDB] Reconnected!');
});

db.on('disconnected', function() {
	console.info('[MongoDB] Disconnected!');
	tries++;
	if(tries < 20) setTimeout(function(){mongoose.connect(global.mongoUri, {server:{auto_reconnect:true}});}, 1000);
	else {
		console.log('[MongoDB] Unable to connect. Exiting neeka...');
		process.exit();
	}
});