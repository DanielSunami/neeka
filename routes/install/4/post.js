var mongoose = require('mongoose'),
	fs = require('fs');

module.exports = function(req, res, next){

	if(!req.body.name ||
	!req.body.url) {
		res.json({ok: false});
	} else {

		var obj = Object.assign(JSON.parse(fs.readFileSync(rootDir+'/neekaconf.json', 'utf8')), req.body);

		fs.writeFileSync(rootDir+'/neekaconf.json', JSON.stringify(obj)); 

		var deleteFolderRecursive = function (path) {
			if( fs.existsSync(path) ) {
				fs.readdirSync(path).forEach(function(file,index){
					var curPath = path + "/" + file;
					if(fs.lstatSync(curPath).isDirectory()) { // recurse
						deleteFolderRecursive(curPath);
					} else { // delete file
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			}
		};

		deleteFolderRecursive(rootDir+'/routes/install');

		global.NEEKA = obj;
		global.mailer = require(rootDir+'/lib/mailer.js');

		utils.installed = true;
		res.redirect('/');
	}
};