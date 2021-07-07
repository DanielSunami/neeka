let mongoose = require('mongoose'),
	db = mongoose.connection,
	tries = 0;

module.exports = function(mongoUri) {

	db.on('connecting', function() {
		console.info('[MongoDB] Connecting...');
	});

	db.on('error', function(error) {
		console.error('[MongoDB] Error in connection: ' + error);
		mongoose.disconnect();
	});

	db.on('connected', function() {
		tries = 0;
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
		if(tries < 20) setTimeout(function(){mongoose.connect(mongoUri, { useNewUrlParser: true, auto_reconnect:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true });}, 1000);
		else {
			console.log('[MongoDB] Unable to connect. Exiting neeka...');
			process.exit();
		}
	});
};