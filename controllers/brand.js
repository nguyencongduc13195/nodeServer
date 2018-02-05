const model = require('../models/brand');
const slug = require('../method/slug');
const product_model = require('../models/product');
const fs = require('fs');
const path = require('path');

exports.add = (req, res)=>{
	let newBrand = new model({
		name: req.body.txtName,
		slug: slug.MakeSeoTitle(req.body.txtName),
		description: req.body.txtDescription,
		image: req.body.txtImage
	});
	newBrand.save((err, success)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		return res.json({
			success: true,
			msg: 'Thêm nhà xuất bản thành công'
		});
	});
}
exports.booksOfBrand = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã nhà xuất bản.'
		});
	}
	product_model.find({brand: req.params.id}).count().exec((err, count)=>{
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
exports.getProductsBySlug = (req, res)=>{
	if(!req.params.slug){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã danh mục.'
		});
	}
	model.findOne({slug: req.params.slug}).exec((err, brand)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		product_model.find({brand: brand._id}).populate('brand').exec((err, products)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			if(products.length == 0){
				return res.json({
					success: false,
					msg: 'Không tồn tại sản phẩm.'
				});
			}
			return res.json({
				success: true,
				data: products
			});
		});
	});
}
exports.findOne = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, brand)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!brand){
			return res.json({
				success: false,
				msg: 'Không tìm thấy nhà xuất bản.'
			});
		}
		return res.json({
			success:true,
			data: brand
		})
	});
}
exports.findOneBySlug = (req, res)=>{
	if(!req.params.slug){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã.'
		});
	}
	model.findOne({slug: req.params.slug}).exec((err, brand)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!brand){
			return res.json({
				success: false,
				msg: 'Không tìm thấy nhà xuất bản.'
			});
		}
		return res.json({
			success:true,
			data: brand
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
	model.findOne({_id: req.params.id}).exec((err, brand)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!brand){
			return res.json({
				success: false,
				msg: 'Không tìm thấy nhà xuất bản.'
			});
		}
		brand.name = req.body.txtName || brand.name;
		brand.slug = slug.MakeSeoTitle(req.body.txtName) || brand.slug;
		brand.description = req.body.txtDescription || brand.description;
		brand.image = req.body.txtImage || brand.image;
		brand.save((err, success)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Cập nhật nhà xuất bản thành công'
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
	model.findOne({_id: req.params.id}).exec((err, brand)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!brand){
			return res.json({
				success: false,
				msg: 'Không tìm thấy sản phẩm.'
			});
		}
		brand.remove((err, success)=>{
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

exports.all = (req, res)=>{
	model.find().exec((err, brands)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(brands.length<=0){
			return res.json({
				success: false,
				msg: 'Không tìm thấy nhà xuất bản.'
			});
		}
		return res.json({
			success: true,
			data: brands
		});
	})
}

exports.getNameImage = (req, res)=>{
	if(!req.params.name){
        return res.json({
            success: false,
            msg: 'Vui lòng nhập tên ảnh.'
        }); 
    }
    return res.sendFile(path.join(__dirname,`../public/uploads/brands/${req.params.name}`));
}

exports.deleteImage = (req, res)=>{
	if(!req.params.name){
        return res.json({
            success: false,
            msg: 'Vui lòng nhập tên ảnh.'
        }); 
    }
    return fs.unlink(path.join(__dirname,`../public/uploads/brands/${req.params.name}`), (err)=>{
        if (err) {
            return res.json({
                success: false,
                msg: err
            }); 
        }
    });
}