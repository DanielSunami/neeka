const
	utils = require(rootDir+'/lib/utils'),
	fecha = require('fecha');

const permissions = new PermissionGroup([PERMISSION.ALTER_USERS]);

module.exports = [
/*
function(req, res, next) {
	if(req.session.user.id == req.params.id || (req.session.user.id != req.params.id && permissions.allow(req.session.user.permissions)) ) {
		next();
	} else {
		res.status(401).end('unauthorized');
	}
},
*/

utils.bodyTrim,

// Validate req.body.birthday
function(req, res, next) {
	let toDate = fecha.parse(req.body.birthday, 'regular');
	if(!toDate) {
		res.status(400).json({ ok: false, msg: 'Invalid Date Format' });
		return;
	} else {
		req.body.birthday = toDate;
		next();
	}
},

function(req, res){

	let update = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		website: req.body.website,
		birthday: req.body.birthday,
		preferences: {
			editor: req.body.preferences_editor
		},
		last_update: new Date()
	}

	if(req.body.password) update.password = utils.criptoSenha(req.body.password);

	const options = {
		new: true,
		lean: true,
		upsert: false
	}

	model.user.findByIdAndUpdate(req.params.id, update, options, function(err, updatedUser) {
		if(err) {
			console.error('[MongoDBError] POST /admin/user/' + req.params.id + ' - ', err);
			res.status(500).json({ ok: false });
		} else if(!updatedUser) {
			console.log('[UserNotFound] POST /admin/user/' + req.params.id);
			res.status(404).json({ ok: false });
		} else
			res.json({ ok: true });
	});
}
];