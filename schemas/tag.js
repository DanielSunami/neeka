var Schema = require('mongoose').Schema;

var tag = {
	name: { type: String, lowercase: true, trim: true },
	created_on: { type: Date, default: Date.now }
}
 
module.exports = new Schema(tag);