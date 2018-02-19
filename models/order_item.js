const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
	quantity: Number,
	slug: String,
	color: String
});

