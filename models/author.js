const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const AuthorSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	slug: String,
	description: String,
	status: {
		type: Boolean,
		default: false
	},
	created_at: {
		type:Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Author',AuthorSchema,'Author');