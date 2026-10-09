const sqlite = require(rootDir+'/lib/sqlite');

let permissions = new PermissionGroup([PERMISSION.DELETE_USERS]);

module.exports = function(req, res){
	if(req.session.user.id == req.params.id || (req.session.user.id != req.params.id && permissions.allow(req.session.user.permissions)) ) {
		const db = sqlite.open();
		try {
			db.prepare(`DELETE FROM users WHERE id = ?`).run(req.params.id);
			res.json({ok: true});
		} catch (err) {
			res.json({ok: false});
		}
	} else {
		res.status(401).end('unauthorized');
	}
};
