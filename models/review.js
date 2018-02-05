var mongoose = require('mongoose');
var reviewSchema = new mongoose.Schema({
	full_name: String,
	comment: {
		type:String,
		required: true
	},
	created_at: {
		type:Date,
		default: Date.now
	},
	rating:{
		type: Number,
		required: true
	}
});

module.exports = reviewSchema;
