var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
var reviewSchema = require('./review');

var productSchema = new mongoose.Schema({
	name: {
		required: true,
		type: String
	},
	slug: {
		required: true,
		type: String
	},
	description: {
		required: true,
		type: String
	},
	body: {
		required: true,
		type: String
	},
	image: {
		type:String,
		default:''
	},
	price: {
		required: true,
		type: Number
	},
	promotion_price: {
		required: true,
		type: Number
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	},
	brand: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Brand'
	},
	writer_name:{
		type: String,
		required: true
	},
	writer_slug: String
	,
	status: {
		type: Boolean,
		default: true
	},
	created_at: {
		type:Date,
		default: Date.now
	},
	view_count: {
		type: Number,
		default: 0
	},
	hot_flag: {
		type:Boolean,
		default: false
	},
	likes: {
		type:Number,
		default: 0
	},
	likeBy: {
		type: Array
	},
	dislikes: {
		type:Number,
		default: 0
	},
	dislikeBy: {
		type: Array
	},
	stockitems: {
		type: Number,
		default: 0
	},
	reviews: [reviewSchema]  //sub document,

});
productSchema.plugin(random);
productSchema.index({name:'text'})
module.exports = mongoose.model('Product',productSchema,'Product');
								// tên Collection , giá trị, ? tên thay thế nếu đã tồn tại 