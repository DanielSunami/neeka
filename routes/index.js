var path = require('path'),
	log = '',
	fs = require('fs'),
	util = require('util'),
	router = require('express').Router();

function req(method, path, file) {
	var handler = require(file);
	path = path.replace(/@/g,':');
	log += util.format('Mapping %s %s to %s \n', method.toUpperCase(), path.substring(__dirname.length, path.length), file);
	router[method](path.substring(__dirname.length, path.length), handler);
}

function treeWalker(dirs, parent){
	dirs.sort(function(a, b){
		if(a.match(/:.+|@.+/)) return 1;
		else if(a.match(/:.+|@.+/)) return -1;
		else return 0;
	});
	dirs.forEach(function(file) {
		var stats = fs.statSync(parent + '/' + file);
		if (!stats.isFile()) {
			treeWalker(fs.readdirSync(parent + '/' + file), parent + '/' + file);
		}
		else {
			var ext = path.extname(parent + '/' + file);
			if ( !(ext in require.extensions) ) { return; }
			var method = path.basename(parent + '/' + file, '.js');
			if(method != 'index') req(method, parent+'/', parent + '/' + file);
			return;
		}
	});
}

treeWalker(fs.readdirSync(__dirname), __dirname);

module.exports = router;
module.exports.log = log;