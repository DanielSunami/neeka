try {
	global.NEEKA = require(rootDir+'/neekaconf.json');
} catch(err) {
	console.error('App configuration file missing or invalid! (neekaconf.json)\nExiting!');
	process.exit(0);
}