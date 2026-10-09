let path = require('path'),
	fs = require('fs');

function req(name) {
	let module = require("./" + name);
	delete exports[name];
	return exports[name] = module;
}

fs.readdirSync(__dirname).forEach(function(file) {
	if ((file === 'index.js')) { return; }
	let ext = path.extname(file);
	let stats = fs.statSync(__dirname + '/' + file);
	if (stats.isFile() && !(ext in require.extensions)) { return; }
	let basename = path.basename(file, '.js');
  	exports.__defineGetter__(basename, function(){ return req(basename); });
});