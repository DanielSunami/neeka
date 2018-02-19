var Schema = require('mongoose').Schema;

var forgot = new Schema({
	id: String,
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	created_on: { type: Date, default: Date.now, expires: 60*60*48 }
});

forgot.query = {

	/**
	 * 
	 */

	getUser: function(param){
		return this.findOne({ id: param }).populate('user');
	}
}

module.exports = forgot;