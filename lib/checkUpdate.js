var fs = require('fs');

if(fs.existsSync(rootDir+"/dbconf.json") && fs.existsSync(rootDir+"/neekaconf.json")) {
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

	deleteFolderRecursive(rootDir+"/routes/install");
}