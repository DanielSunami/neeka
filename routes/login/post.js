let sessionManager = require(rootDir+'/lib/sessionManager.js');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapeUser } = require(rootDir+'/lib/pageData');

module.exports = function(req, res){
	const db = sqlite.open();
	const row = db.prepare(`SELECT * FROM users WHERE email = ?`).get(
		(req.body.email || '').toLowerCase().trim()
	);

	if(row && utils.checkPassword(req.body.password, row.password)){
		const user = shapeUser(row);
		res.setHeader("Set-Cookie", sessionManager.createSession({
			user: {
				id: user._id,
				name: user.fullName,
				permissions: user.permissions
			}
		}));
		res.json({ok:true});
	} else {
		res.json({ok:false});
	}
};
