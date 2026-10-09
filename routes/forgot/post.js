const sqlite = require(rootDir+'/lib/sqlite');
const { shapeUser } = require(rootDir+'/lib/pageData');
const { randomId } = require(rootDir+'/lib/utils');

module.exports = function(req, res){
	const db = sqlite.open();
	const row = db.prepare(`SELECT * FROM users WHERE email = ? COLLATE NOCASE`).get(req.body.email);

	if(row) {
		const user = shapeUser(row);
		const id = randomId();
		try {
			db.prepare(`INSERT INTO forgots (id, user_id, created_on) VALUES (?, ?, ?)`).run(
				id,
				user._id,
				sqlite.now()
			);
			mailer.sendMail('forgot', {dest: req.body.email, nome: user.fullName, id: id});
			res.json({ok : true});
		} catch (err) {
			res.json({ok : false});
		}
	} else {
		res.json({ok : false})
	}
};
