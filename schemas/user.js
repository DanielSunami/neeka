var Schema = require('mongoose').Schema;

var user = new Schema({
	firstname: { type: String, required: true },
	lastname: String,
	website: String,
	email: { type: String, lowercase: true, trim: true, required: true, unique: true },
	password: { type: String, required: true },
	birthday: Date,
	permissions:  { type: Array, default: [] },
	preferences: {
		editor: { type: String, default: 'trix' }
	},
	created_on: { type: Date, default: Date.now },
	last_update: { type: Date, default: Date.now }
});

user.statics = {
	
	auth: function(e, pass, cb) {
		return this.findOne( { email: e.toLowerCase().trim(), password: utils.criptoSenha(pass) }, function(err, doc){
			if(err) cb(err, doc);
			else if(doc) cb(err, doc);
			else cb(err, doc);
		});
	}
}

user.virtual('fullName').get(function () {
	return this.firstname + ' ' + this.lastname;
});

module.exports = user;