const model = require('../models/author');
const productModel = require('../models/product');
const slug = require('../method/slug');

exports.bestAuthor = (req, res)=>{
  	productModel.find({}, 'name').sort({author:1}).limit(5).exec((err, data)=>{
	    if (err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    return res.json({
	    	success: true,
	    	data: data
	  	});
	});
}
exports.findBooksByName = (req, res)=>{
	if (!req.params.name) {
      	return res.json({
        	success: false,
        	msg: err
      	});
    }
    productModel.find({writer_slug: req.params.name}).exec((err, data)=>{
	    if (err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    if(data.length<=0){
	    	return res.json({
	        	success: false,
	        	msg: 'Không có sách.'
	      	});
	    }
	    return res.json({
	    	success: true,
	    	data: data
	  	});
	});
}

exports.add = (req, res)=>{
	let newAuthor = new model({
		name: req.body.txtName,
		slug: slug.MakeSeoTitle(req.body.txtName),
		description: req.body.txtDescription
	});
	newAuthor.save((err, success)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		return res.json({
			success: true,
			msg: 'Thêm tác giả thành công.'
		});
	});
}
exports.booksOfAuthor = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã tác giả.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, author)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!author){
			return res.json({
				success: false,
				msg: 'Không tìm thấy tác giả.'
			});
		}
		productModel.count({author: author._id}).exec((err, products)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			if(products.length <= 0){
				return res.json({
					success: false,
					msg: 'Tác giả chưa có sản phẩm.'
				});
			}
			return res.json({
				success: true,
				data: products
			});
		})
		
	})
}
exports.all = (req, res)=>{
	model.find().exec((err, authors)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(authors.length<=0){
			return res.json({
				success: false,
				msg: 'Không tìm thấy tác giả.'
			});
		}
		return res.json({
			success: true,
			data: authors
		});
	})
}
exports.findOne = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, author)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(author.length <= 0){
			return res.json({
				success: false,
				msg: 'Không tìm thấy tác giả.'
			});
		}
		return res.json({
			success:true,
			data: author
		})
	});
}
exports.update = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, author)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!author){
			return res.json({
				success: false,
				msg: 'Không tìm thấy tác giả.'
			});
		}
		author.name = req.body.txtName || author.name;
		author.slug = slug.MakeSeoTitle(req.body.txtName) || author.slug;
		author.description = req.body.txtDescription || author.description;
		author.save((err, success)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Cập nhật tác giả thành công'
			});
		});
	});
}
exports.delete = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, author)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!author){
			return res.json({
				success: false,
				msg: 'Không tìm thấy sản phẩm.'
			});
		}
		author.remove((err, success)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Xóa thành công.'
			});
		});
	});
}
