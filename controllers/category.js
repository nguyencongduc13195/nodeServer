const model = require('../models/category');
const product_model = require('../models/product');
const slug = require('../method/slug');
const path = require('path');
const fs = require('fs');

exports.add = (req, res)=>{
	let newCate = new model({
		name : req.body.txtName,
		slug: slug.MakeSeoTitle(req.body.txtName),
		description: req.body.txtDescription,
		image: req.body.txtImage
	});
	newCate.save((err, success)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		return res.json({
			success: true,
			msg: 'Thêm danh mục thành công.'
		});
	});
}
exports.booksOfCate = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã danh mục.'
		});
	}
	product_model.find({category: req.params.id}).count().exec((err, count)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		return res.json({
			success: true,
			data: count
		});
	})
}
exports.update = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã danh mục.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, product)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!product){
			return res.json({
				success: false,
				msg: 'Không tìm thấy sản phẩm'
			});
		}
		product.name = req.body.txtName || product.name;
		product.slug = slug.MakeSeoTitle(req.body.txtName) || product.slug;
		product.description = req.body.txtDescription || product.description;
		product.save((err, success)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Cập nhật danh mục thành công.'
			});
		});
	});
}
exports.getAll = (req, res)=>{
	model.find({}).exec((err, categories)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		return res.json({
			success: true,
			data: categories
		});
	});
}
exports.findOne = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã danh mục.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, product)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!product){
			return res.json({
				success: false,
				msg: 'Không tìm thấy.'
			});
		}
		return res.json({
			success: true,
			data: product
		});
	})
}
exports.findOneBySlug = (req, res)=>{
	if(!req.params.slug){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã danh mục.'
		});
	}
	model.findOne({slug: req.params.slug}).exec((err, product)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(product.length <= 0){
			return res.json({
				success: false,
				msg: 'Không tìm thấy.'
			});
		}
		return res.json({
			success: true,
			data: product
		});
	})
}
exports.getProductsBySlug = (req, res)=>{
	let pageIndex = parseInt(req.query.pageIndex) || 1;
	let pageSize = parseInt(req.query.pageSize) || 4;
	if(!req.params.slug){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã danh mục.'
		});
	}
	model.findOne({slug: req.params.slug}).exec((err, category)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!category){
			return res.json({
				success: false,
				msg: err
			});
		}
		product_model.count({category: category._id})
					.populate('category')
					.exec((err, count)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			if(count.length <= 0){
				return res.json({
					success: false,
					msg: 'Sách đang được cập nhật.'
				});
			}
			let totalPage = Math.ceil(count / pageSize);
			let start = (pageIndex - 1) * pageSize;
			product_model.find({category: category._id}).skip(start).limit(pageSize).exec((err, data)=>{
				if(err){
					return res.json({
						success: false,
						msg: err
					});
				}
				if(data.length <= 0){
					return res.json({
						success: false,
						msg: 'Không tìm thấy sản phẩm'
					});
				}
				return res.json({
					success: true,
					data: data,
					totalPage: totalPage,
					pageSize: pageSize,
					pageIndex: pageIndex,
					count: count
				});
			});
		});
	});
}

exports.delete = (req, res) =>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã danh mục.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, category)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		category.remove((err)=>{
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
		})
	});
}

exports.getNameImage = (req, res)=>{
	if(!req.params.name){
        return res.json({
            success: false,
            msg: 'Vui lòng nhập tên ảnh.'
        }); 
    }
    return res.sendFile(path.join(__dirname,`../public/uploads/categories/${req.params.name}`));
}

exports.deleteImage = (req, res)=>{
	if(!req.params.name){
        return res.json({
            success: false,
            msg: 'Vui lòng nhập tên ảnh.'
        }); 
    }
    return fs.unlink(path.join(__dirname,`../public/uploads/categories/${req.params.name}`), (err)=>{
        if (err) {
            return res.json({
                success: false,
                msg: err
            }); 
        }
    });
}