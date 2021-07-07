var render = require(rootDir+'/render');

module.exports = function(req, res){

	let mongoConf = {};
	try{
		mongoConf = require(rootDir+'/dbconf.json');
	} catch(err) { 
		mongoConf = {
			user: '',
			password: '',
			hostname: '',
			port: '',
			dbname: ''
		}
	}

	// user and password never send to browser for security reasons
	mongoConf.user = '';
	mongoConf.password = '';

	let pageData = {
		title: "Administration",
		subtitle: "",
		site: {
			name: NEEKA.name,
			url: NEEKA.url,
			description: NEEKA.description,
			keywords: NEEKA.keywords,
			gaUID: NEEKA.google_analytics,
			template: NEEKA.template
		},
		db: mongoConf,
		url: NEEKA.url+"/admin/databaseConf"
	};

	res.send(render.admin_db_conf(pageData));
};