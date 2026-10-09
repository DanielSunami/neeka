'use strict';

global.rootDir = __dirname;
global.NEEKA = {};
global.mailer = {};
global.zeroLeftMask = function (n) {
	n = parseInt(n, 10);
	return (n < 10 ? '0' : '') + n;
}

Date.prototype.toString = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}
Date.prototype.toJSON = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}

require('./lib/setupFecha.js');
require('./lib/checkUpdate.js');
require('./lib/permissions.js');
let http = require('http'),
	app = require('./lib/app.js');

let httpServer = http.createServer(app);

httpServer.listen(8081, function() {
	console.log('Listening on port %d', httpServer.address().port);
});
