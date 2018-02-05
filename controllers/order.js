const order_model = require('../models/order');
const product_model = require('../models/product');

exports.myOrder = (req, res)=>{
	order_model.find({userID: req.decoded.user}).exec((err, orders)=>{
		if(err){
			return res.json({
				success: false,
				msg:err
			});
		}
		if(orders.length <= 0 ){
			return res.json({
				success: false,
				msg: 'Không có đơn hàng.'
			})
		}
		return res.json({
			success: true,
			data: orders
		});
	});
}
exports.findDetailOrder = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg:'Vui lòng nhập ID.'
		});
	}
	order_model.findOne({_id: req.params.id}).exec((err, order)=>{
		if(err){
			return res.json({
				success: false,
				msg:err
			});
		}
		if(order.length <= 0 ){
			return res.json({
				success: false,
				msg: 'Không có đơn hàng.'
			})
		}
		return res.json({
			success: true,
			data: order
		});
	});
}
exports.add = (req, res)=>{
	let order = new order_model({
		name: req.body.txtName,
		address: req.body.txtAddress,
		phone: req.body.txtPhone,
		note: req.body.txtNote || "",
		paymentOption: req.body.rdoPayment,
		userID: req.decoded.user,
		total: req.body.txtTotal
	});
	let order_item = ({
		quantity: req.body.txtQuantity,
		slug: req.body.txtSlug
	});
	order.orderItem.push(order_item);
	order.save((err, success)=>{
		if(err){
			return res.json({
				success: false,
				msg:err+''
			});
		}
		return res.json({
			success: true,
			msg: 'Bạn đã đặt hàng thành công.'
		})
	});
}

exports.findAll = (req, res)=>{
	order_model.find().exec((err, orders)=>{
		if(err){
			return res.json({
				success: false,
				msg:err
			});
		}
		return res.json({
			success: true,
			data:orders
		});
	})
}

exports.updateConfirm = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg:'Vui lòng nhập ID.'
		});
	}
	order_model.findOne({_id: req.params.id}).exec((err, order)=>{
		if(err){
			return res.json({
				success: false,
				msg:err
			});
		}
		if(order.length <= 0 ){
			return res.json({
				success: false,
				msg: 'Không có đơn hàng.'
			})
		}
		order.confirm = !order.confirm
		order.save((err)=>{
			if(err){
				return res.json({
					success: false,
					msg:err
				});
			}
			return res.json({
				success: true,
				msg: 'Cập nhật thành công.'
			})
		})
	});
}

exports.deleteOrder = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg:'Vui lòng nhập ID.'
		});
	}
	order_model.findOne({_id: req.params.id}).exec((err, order)=>{
		if(err){
			return res.json({
				success: false,
				msg:err
			});
		}
		if(!order){
			return res.json({
				success: false,
				msg: 'Không có đơn hàng.'
			})
		}
		order.remove((err)=>{
			if(err){
				return res.json({
					success: false,
					msg:err
				});
			}
			return res.json({
				success: true,
				msg: 'Xóa thành công'
			});
		})
	});
}