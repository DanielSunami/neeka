'use strict';

global.rootDir = __dirname;
global.NEEKA = {};
global.mailer = {};
global.zeroLeftMask = function (number, size) {
	number = number.toString();
	for(; size - number.length > 0;) number = "0" + number;
	return number;
}

Date.prototype.toString = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}
Date.prototype.toJSON = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}

require('./lib/setupFecha.js');
require('./lib/checkUpdate.js');
require('./lib/permissions.js');
var http = require('http'),
	app = require('./lib/app.js');

var httpServer = http.createServer(app);

httpServer.listen(8081, function() {
	console.log('Listening on port %d', httpServer.address().port);
});