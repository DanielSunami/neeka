let sessionManager = require(rootDir+'/lib/sessionManager.js');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapeUser } = require(rootDir+'/lib/pageData.js');

module.exports = function(req, res, next){

	if(!req.body.firstname ||
	!req.body.email ||
	!req.body.password) {
		res.json({ok: false});
	} else {
		try {
			const db = sqlite.open();
			const now = sqlite.now();
			const permissions = JSON.stringify([0,1,2,3,4,5,6,7,8,9]);
			const info = db.prepare(`
				INSERT INTO users (firstname, lastname, website, email, password, permissions, editor, created_on, last_update)
				VALUES (?, ?, ?, ?, ?, ?, 'trix', ?, ?)
			`).run(
				req.body.firstname,
				req.body.lastname || '',
				req.body.website || '',
				req.body.email.toLowerCase().trim(),
				utils.hashPassword(req.body.password),
				permissions,
				now,
				now
			);
			const user = shapeUser(db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid));
			res.setHeader("Set-Cookie", sessionManager.createSession({
				user: {
					id: user._id,
					name: user.fullName,
					permissions: user.permissions
				}
			}));
			res.json({ok: true});
		} catch (err) {
			console.log(err);
			res.json({ok:false});
		}
	}
};
