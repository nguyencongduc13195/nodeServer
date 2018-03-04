const model = require('../models/product');
const cate_model = require('../models/category');
const brand_model = require('../models/brand');
const user_model = require('../models/user');
const order_model = require('../models/order');
const slug = require('../method/slug');
const path = require('path');
const fs = require('fs');

exports.findProductsByGender = (req, res)=>{
	if (!req.params.gender) {
      	return res.json({
        	success: false,
        	msg: 'Vui lòng nhập giới tính.'
      	});
    }
    model.find({"gender.slug": req.params.gender}).exec((err, data)=>{
	    if (err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    if(data.length<=0){
	    	return res.json({
	        	success: false,
	        	msg: 'Không có sản phẩm.'
	      	});
	    }
	    return res.json({
	    	success: true,
	    	data: data
	  	});
	});
}
exports.findProductsBySize = (req, res)=>{
	if (!req.params.size) {
      	return res.json({
        	success: false,
        	msg: 'Vui lòng nhập kích cỡ.'
      	});
    }
    let params = req.params.size.split(',');
    model.find({size:{$all:params}}).exec((err, data)=>{
	    if (err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    if(data.length<=0){
	    	return res.json({
	        	success: false,
	        	msg: 'Không có sản phẩm.'
	      	});
	    }
	    return res.json({
	    	success: true,
	    	data: data
	  	});
	});
}
exports.findProductsByColor = (req, res)=>{
	if (!req.params.color) {
      	return res.json({
        	success: false,
        	msg: 'Vui lòng nhập màu sắc.'
      	});
    }
    let params = req.params.color.split(',');
    model.find({color: {$all:params}}).exec((err, data)=>{
	    if (err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    if(data.length<=0){
	    	return res.json({
	        	success: false,
	        	msg: 'Không có sản phẩm.'
	      	});
	    }
	    return res.json({
	    	success: true,
	    	data: data
	  	});
	});
}
exports.findProductsByColorAndSize = (req, res)=>{
	if(req.query.color){
    	var paramsColor = req.query.color.split(',');
	}
	if(req.query.size){
    	var paramsSize = req.query.size.split(',');
	}
    model.find(
    	{$and:[
    		{color: {$all:paramsColor}},
    		{size:{$all:paramsSize}}
    	]}).exec((err, data)=>{
	    if (err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    if(data.length<=0){
	    	return res.json({
	        	success: false,
	        	msg: 'Không có sản phẩm.'
	      	});
	    }
	    return res.json({
	    	success: true,
	    	data: data
	  	});
	});
}
exports.findProductsByPrice = (req, res)=>{
	if (!req.params.price) {
      	return res.json({
        	success: false,
        	msg: 'Vui lòng nhập giá tiền.'
      	});
    }
    model.find(
    	{$and:[
    		{promotion_price: {$gte:req.params.price}},
    		{promotion_price: {$lt:20000000}}
    	]}).sort({promotion_price: 1}).exec((err, data)=>{
	    if (err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    if(data.length<=0){
	    	return res.json({
	        	success: false,
	        	msg: 'Không có sản phẩm.'
	      	});
	    }
	    return res.json({
	    	success: true,
	    	data: data
	  	});
	});
}
exports.findProductsByUse = (req, res)=>{
	if (!req.params.name) {
      	return res.json({
        	success: false,
        	msg: 'Vui lòng nhập công dụng.'
      	});
    }
    model.find({tag_array:(req.params.name)}).exec((err, data)=>{
	    if (err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    if(data.length<=0){
	    	return res.json({
	        	success: false,
	        	msg: 'Không có sản phẩm.'
	      	});
	    }
	    return res.json({
	    	success: true,
	    	data: data
	  	});
	});
}

exports.mostLikes = (req, res)=>{
	model.find({}).sort({likes: -1, created_at:-1}).limit(4).exec((err, products)=>{
		if(err){
			return res.json({
                success: false,
                err: err
            });
		}
		if(products.length <=0){
			return res.json({
                success: false,
                err: 'Không tìm thấy sản phẩm.'
            });
		}
		return res.json({
            success: true,
            data: products
        });
	})
}	
exports.mostViews = (req, res)=>{
	model.find({}).limit(4).sort({view_count: -1}).exec((err, products)=>{
		if(err){
			return res.json({
                success: false,
                err: err
            });
		}
		if(products.length <=0){
			return res.json({
                success: false,
                err: 'Không tìm thấy sản phẩm.'
            });
		}
		return res.json({
            success: true,
            data: products
        });
	})
}
exports.newestProduct = (req, res)=>{
	model.find({}).limit(8).sort({created_at: -1}).exec((err, products)=>{
		if(err){
			return res.json({
                success: false,
                err: err
            });
		}
		if(products.length <=0){
			return res.json({
                success: false,
                err: 'Không tìm thấy sản phẩm.'
            });
		}
		return res.json({
            success: true,
            data: products
        });
	})
}
exports.searchItem = (req, res)=>{
    if(!req.params.search){
        return res.json({
            success: false,
            msg:'Vui lòng nhập từ khóa.'
        });
    }
    model.find({$text: {$search: req.params.search}}).exec((err, data)=>{
        if(err){
            return res.json({
                success: false,
                err: err
            });
        }
        if(data.length <=0){
            return res.json({
                success: false,
                msg: 'Không có sản phẩm'
            });
        }
        return res.json({
            success: true,
            data: data
        });
    });
}
exports.updateBrand = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập ID'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, data)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		data.brand = req.params.newbrand || data.brand;
		data.save((err)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Thành công'
			})
		})

	});
}
exports.updateCate = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập ID'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, data)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		data.category = req.params.newcate || data.category;
		data.save((err)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Thành công'
			})
		})

	});
}

exports.update = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập ID'
		});
	}
	model.findOne({_id:req.params.id}).exec((err, product)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!product){
			return res.json({
				success: false,
				msg: 'Không tìm thấy sản phẩm.'
			});
		}
		product.name = req.body.txtName || product.name;
		product.slug = slug.MakeSeoTitle(req.body.txtName) || product.slug;
		product.body = req.body.txtBody || product.body;
		product.description = req.body.txtDescription || product.description;
		product.image = req.body.txtImage || product.image;
		product.category = req.body.sltCategory || product.category;
		product.brand = req.body.sltBrand || product.brand;
		product.price = req.body.txtPrice || product.price;
		product.promotion_price = (req.body.txtPromotionPrice ? req.body.txtPromotionPrice : 
									(req.body.txtPrice ? req.body.txtPrice : product.promotion_price)) ;
		product.stockitems = req.body.txtStockItems || product.stockitems;
		product.save((err, success)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Cập nhật sản phẩm thành công.'
			});
		});
	})
}

exports.add = (req, res)=>{
	const newProduct = new model({
		name: req.body.txtName,
		slug: slug.MakeSeoTitle(req.body.txtName),
		body: req.body.txtBody,
		description: req.body.txtDescription,
		image: req.body.txtImage,
		category: req.body.sltCategory,
		brand: req.body.sltBrand,
		tag_array: req.body.txtUseArray,
		image_Detail: req.body.imageDetail,
		gender:{
			name: req.body.txtGender,
			slug: slug.MakeSeoTitle(req.body.txtGender)
		},
		color: req.body.txtColor,
		size: req.body.txtSize,
		price: req.body.txtPrice,
		promotion_price: req.body.txtPromotionPrice || req.body.txtPrice,
		stockitems: req.body.txtStockItems
	});
	newProduct.save((err, success)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		return res.json({
			success: true,
			msg: 'Thêm sản phẩm thành công.'
		});
	});
}

exports.likeProduct = (req, res) => {
    if (!req.params.id) {
        return res.json({
            success: false,
            msg: 'Vui lòng nhập mã'
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
		if(product.likeBy.includes(req.decoded.full_name)){
			return res.json({
	            success: false,
	            msg: 'Bạn đã thích sản phẩm rồi'
	        });
		}else 
			if(product.dislikeBy.includes(req.decoded.full_name)){
				product.dislikeBy.splice(product.dislikeBy.indexOf(req.decoded.full_name), 1);
				product.dislikes--;
				product.likes++;
				product.likeBy.push(req.decoded.full_name);
				product.save((err, data)=>{
					if(err){
						return res.json({
				            success: false,
				            msg: err
				        });
					}
					return res.json({
			            success: true,
			            data: data,
			            msg: 'Bạn đã thích sản phẩm.'
			        });
				});
			}
		else {
			product.likes++;
			product.likeBy.push(req.decoded.full_name);
			product.save((err, data)=>{
				if(err){
					return res.json({
			            success: false,
			            msg: err
			        });
				}
				return res.json({
		            success: true,
		            data: data,
		            msg: 'Bạn đã thích sản phẩm.'
		        });
			});
		}
	});
}
exports.dislikeProduct = (req, res) => {
    if (!req.params.id) {
        return res.json({
            success: false,
            msg: 'Vui lòng nhập mã'
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
		if(product.dislikeBy.includes(req.decoded.full_name)){
			return res.json({
	            success: false,
	            msg: 'Bạn đã không thích sản phẩm rồi'
	        });
		}else 
			if(product.likeBy.includes(req.decoded.full_name)){
				product.likeBy.splice(product.dislikeBy.indexOf(req.decoded.full_name), 1);
				product.likes--;
				product.dislikes++;
				product.dislikeBy.push(req.decoded.full_name);
				product.save((err, data)=>{
					if(err){
						return res.json({
				            success: false,
				            msg: err
				        });
					}
					return res.json({
			            success: true,
			            data: data,
			            msg: 'Bạn không thích sản phẩm.'
			        });
				});
			}
		else {
			product.dislikes++;
			product.dislikeBy.push(req.decoded.full_name);
			product.save((err, data)=>{
				if(err){
					return res.json({
			            success: false,
			            msg: err
			        });
				}
				return res.json({
		            success: true,
			        data: data,
		            msg: 'Bạn không thích sản phẩm.'
		        });
			});
		}
	});
}
exports.totalProduct = (req, res)=>{
    model.count().exec((err, count)=>{
    	if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		cate_model.count().exec((err, count_cate)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			brand_model.count().exec((err, count_brand)=>{
				if(err){
					return res.json({
						success: false,
						msg: err
					});
				}
				user_model.count().exec((err, count_user)=>{
				if(err){
					return res.json({
						success: false,
						msg: err
					});
				}
				order_model.count().exec((err, count_order)=>{
					if(err){
						return res.json({
							success: false,
							msg: err
						});
					}
					return res.json({
						success: true,
						count_product: count,
						count_brand: count_brand,
						count_cate: count_cate,
						count_user: count_user,
						count_order: count_order
					});
				})
			});
			});
  	 	});
	});
}
exports.getAll = (req, res)=>{
	let pageIndex = parseInt(req.query.pageIndex) || 1;
    let pageSize = parseInt(req.query.pageSize) || 8;
    model.count().exec((err, count)=>{
    	if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(count <= 0){
			return res.json({
				success: false,
				msg: 'Không tìm thấy sản phẩm'
			});
		}
		let totalPage = Math.ceil(count / pageSize);
		let start = (pageIndex - 1) * pageSize;
		model.find({}).populate('brand').populate('category').populate('author').skip(start).limit(pageSize).sort({created_at:-1}).exec((err, products)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			if(products.length <= 0){
				return res.json({
					success: false,
					msg: 'Không tìm thấy sản phẩm'
				});
			}
			return res.json({
				success: true,
				data: products,
				totalPage: totalPage,
				pageSize: pageSize,
				pageIndex: pageIndex
			});
		});
    });
}
exports.findProductById = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã sản phẩm.'
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
				msg: 'Không tìm thấy sản phẩm.'
			});
		}
		return res.json({
			success: true,
			data: product
		});
	});
}
exports.deleteProduct = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã sản phẩm.'
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
				msg: 'Không tìm thấy sản phẩm.'
			});
		}
		product.remove((err)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Xóa sản phẩm thành công.'
			});
		});
		
	});
}
exports.findOne = (req, res)=>{
	if(!req.params.slug){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã sản phẩm.'
		});
	}
	model.findOne({slug: req.params.slug}).populate('brand').exec((err, product)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!product){
			return res.json({
				success: false,
				msg: 'Không có sản phẩm.'
			});
		}
		product.view_count = product.view_count + 1;
		product.save((err)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				data: product
			});
		});
 	});
}

exports.addReview = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mã sản phẩm.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, product)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		let review = {
			full_name: req.decoded.full_name,
			comment: req.body.txtComment,
			rating: req.body.txtRating,
			created_at: Date.now()
		}
		product.reviews.push(review);
		product.save((err, success)=>{
			if(err){
				return res.json({
					success: false,
					msg: err
				});
			}
			return res.json({
				success: true,
				msg: 'Cảm ơn bạn đã đóng góp ý kiến.',
				data: review
			});
		});
	});
}

exports.getNameImage = (req, res)=>{
    if(!req.params.name){
        return res.json({
            success: false,
            msg: 'Vui lòng nhập tên ảnh.'
        }); 
    }
    return res.sendFile(path.join(__dirname,`../public/uploads/products/${req.params.name}`));
}
exports.getDetailNameImage = (req, res)=>{
    if(!req.params.name){
        return res.json({
            success: false,
            msg: 'Vui lòng nhập tên ảnh.'
        }); 
    }
    return res.sendFile(path.join(__dirname,`../public/uploads/detail-products/${req.params.name}`));
}
exports.deleteImage = (req, res)=>{
	if(!req.params.name){
        return res.json({
            success: false,
            msg: 'Vui lòng nhập tên ảnh.'
        }); 
    }
    return fs.unlink(path.join(__dirname,`../public/uploads/products/${req.params.name}`), (err)=>{
        if (err) {
            return res.json({
                success: false,
                msg: err
            }); 
        }
    });
}

exports.relatedProduct = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg:'Vui lòng nhập ID'
		})
	}
	model.findOne({_id: req.params.id}).exec((err, product)=>{
		if (err) {
            return res.json({
                success: false,
                msg: err
            }); 
        }
        model.find({category: product.category, _id: {$ne: req.params.id}}).limit(4).exec((err, product)=>{
        	if (err) {
	            return res.json({
	                success: false,
	                msg: err
	            }); 
	        }
	        return res.json({
                success: true,
                data: product
            }); 
        })
	});
}
exports.diffirentProduct = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg:'Vui lòng nhập ID'
		})
	}
	model.findOne({_id: req.params.id}).exec((err, product)=>{
		if (err) {
            return res.json({
                success: false,
                msg: err
            }); 
        }
        model.find({category: {$ne:product.category}, _id: {$ne: req.params.id}}).limit(4).exec((err, product)=>{
        	if (err) {
	            return res.json({
	                success: false,
	                msg: err
	            }); 
	        }
	        return res.json({
                success: true,
                data: product
            }); 
        })
	});
}