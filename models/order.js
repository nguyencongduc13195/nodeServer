const mongoose = require('mongoose');
const orderItem = require('./order_item');
const orderSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	userID:{
		type: String
	},
	phone: {
		type: Number,
		required: true
	},
	note: String,
	paymentOption: Number,
	orderItem: [orderItem],
	confirm: {
		type: Boolean,
		default: false
	},
	total:{
		type: Number,
		default: 0
	},
	created_at:{
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Order', orderSchema, 'Order');