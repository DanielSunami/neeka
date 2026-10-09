const sqlite = require(rootDir+'/lib/sqlite');

let permissions = new PermissionGroup([PERMISSION.CREATE_USERS]);

module.exports = function(req, res){
	if(!permissions.allow(req.session.user.permissions))
		res.status(401).end('unauthorized');
	else {
		const db = sqlite.open();
		const now = sqlite.now();
		try {
			db.prepare(`
				INSERT INTO users (firstname, lastname, website, email, password, birthday, permissions, editor, created_on, last_update)
				VALUES (?, ?, ?, ?, ?, ?, '[]', 'trix', ?, ?)
			`).run(
				req.body.firstname,
				req.body.lastname || '',
				req.body.website || '',
				(req.body.email || '').toLowerCase().trim(),
				utils.hashPassword(req.body.password),
				req.body.birthday || null,
				now,
				now
			);
			res.redirect('/admin/user');
		} catch (err) {
			console.log(err);
			res.status(500).end('Something broke!');
		}
	}
};
