let fs = require('fs');

if(fs.existsSync(rootDir+"/data/neeka.sqlite") && fs.existsSync(rootDir+"/neekaconf.json")) {
	let deleteFolderRecursive = function (path) {
		if( fs.existsSync(path) ) {
			fs.readdirSync(path).forEach(function(file,index){
				let curPath = path + "/" + file;
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