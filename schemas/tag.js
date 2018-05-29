var Schema = require('mongoose').Schema;

var tag = {
	name: { type: String, lowercase: true, trim: true, unique: true },
	created_on: { type: Date, default: Date.now }
}
 
module.exports = new Schema(tag);