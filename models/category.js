const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	slug: String,
	description: String,
	image: {
		type: String,
		default: ''
	},
	status: {
		type: Boolean,
		default: false
	},
	created_at: {
		type:Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Category',CategorySchema,'Category');