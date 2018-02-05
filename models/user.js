const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserModel = new mongoose.Schema({
	full_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique:true
	},
	password: {
		type: String,
		required: true
	},
	phone : {
		type: Number,
		default: 0
	},
	address : {
		type: String,
		default: ""
	},
	gender:{
		type: String,
		default: 'Male'
	},
	birthday:{
		type: Date,
		default: Date.now
	},
	level : {
		type: String,
		default: 'User'
	},
	created_at:{
		type:Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User',UserModel,'User')