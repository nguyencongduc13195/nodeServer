const model = require('../models/user');
const bcrypt = require('bcryptjs');
const titlecase = require('../method/titlecase');
const jwt = require('jsonwebtoken');

exports.forgotPassword = (req, res)=>{
	model.findOne({email: req.body.txtEmail.toLowerCase()}).exec((err, user)=>{
		if(err){
			return res.json({
	        	success: false,
	        	msg: err
	      	});
		}
		if(!user){
			return res.json({
	        	success: false,
	        	msg: 'Email không tìm thấy.'
	      	});
		}
		if(user.full_name !== titlecase.titleCase(req.body.txtFullName)){
			return res.json({
	        	success: false,
	        	msg: 'Họ tên không trùng khớp thông tin.'
	      	});
		}
		if(user.phone !== req.body.txtPhone){
			return res.json({
	        	success: false,
	        	msg: 'Số điện thoại không trùng khớp thông tin.'
	      	});
		}
      	user.password = req.body.txtPassword;
      	bcrypt.genSalt(10, function(err, salt) {
	      	bcrypt.hash(user.password, salt, function(err, hash) {
	        	user.password = hash;
	        	user.save((err, user) => {
	          		if (err) {
	            		return res.json({
	              			success: false,
	              			msg: err
	            		});
	          		}
	          		return res.json({
	            		success: true,
	            		msg: 'Cập nhật mật khẩu thành công.'
	          		});
	        	});
	      	})
	    })
	})
}

exports.updateUser = (req, res)=>{
	model.findOne({ _id: req.decoded.user }).exec((err, data) => {
    if(err) {
      	return res.json({
        	success: false,
        	msg: err
      	});
    }
    data.full_name = req.body.txtFullName || data.fullname;
    data.phone = req.body.txtPhone || data.phone;
    data.address = req.body.txtAddress || data.address;
    data.birthday = req.body.txtBirthday || data.birthday;
    data.gender = req.body.rdoGender || data.gender;
   	data.save((err, user) => {
  		if (err) {
    		return res.json({
      			success: false,
      			msg: err
    		});
  		}
  		return res.json({
    		success: true,
    		msg: 'Cập nhật thành công.'
  		});
	});
  });
}
exports.updateUserByAdmin = (req, res)=>{
	model.findOne({ _id: req.params.id }).exec((err, data) => {
	    if(err) {
	      	return res.json({
	        	success: false,
	        	msg: err
	      	});
	    }
	    data.full_name = req.body.txtFullName || data.fullname;
	    data.email = req.body.txtEmail || data.email;
	    data.phone = req.body.txtPhone || data.phone;
	    data.address = req.body.txtAddress || data.address;
	    data.birthday = req.body.txtBirthday || data.birthday;
	    data.gender = req.body.txtGender || data.gender;
	    data.level = req.body.txtLevel || data.level;
    	data.save((err, user) => {
      		if (err) {
        		return res.json({
          			success: false,
          			msg: err
        		});
      		}
      		return res.json({
        		success: true,
        		msg: 'Cập nhật thành công.'
      		});
    	});
  	});
}
exports.register = (req, res)=>{
	let newUser = new model({
		email: req.body.txtEmail,
		full_name: titlecase.titleCase(req.body.txtFullName),
		password: req.body.txtPassword,
		phone: req.body.txtPhone,
		gender: req.body.rdoGender,
		birthday: req.body.txtBirthday,
		address: req.body.txtAddress
	});
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	    	newUser.password = hash; // hash pw
	        newUser.save((err,data)=>{
				if(err){
					if(err.code == 11000){
						return res.json({
							success: false,
							msg: 'Email hoặc tên người dùng đã tồn tại.'
						})
					}else{
						return res.json({
							success: false,
							msg: err
						});
					}
				}
				else{
					return res.json({
						success: true,
						msg: 'Đăng ký thành công... Vui lòng chờ đang chuyển trang.'
					})
				}
			}); 
	    });
	});
}
exports.checkExistEmail = (req, res)=>{
	if(!req.params.email){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập Email.'
		});
	}
	model.findOne({email: req.params.email}).exec((err, email)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!email){
			return res.json({
				success: true,
				msg: 'Email có thể sử dụng.'
			});
		}else{
			return res.json({
				success: false,
				data: email
			});
		}
	})
}
exports.login = (req, res)=>{
	model.findOne({email: req.body.txtEmail.toLowerCase()}).exec((err, user)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!user){
			return res.json({
				success: false,
				msg: 'Email chưa được đăng ký.'
			});
		}
		bcrypt.compare(req.body.txtPassword, user.password, function(err, matched) {
		    if(err) throw  err;
		    if(!matched){
		    	return res.json({
		    		success: false,
		    		msg: 'Mật khẩu không đúng.'
		    	});
		    }
		    let token = jwt.sign(
		    	{user: user._id, full_name: user.full_name},
		    	'nguyencongduc!@#$%^&*()_+|',
		    	{expiresIn: 6000});
		    return res.json({
		    	success: true,
		    	msg: 'Đăng nhập thành công.',
		    	token: token,
		    	// full_name: user.full_name,
		    	// level: user.level
		    });
		});
	})
}

exports.all = (req, res)=>{
	model.find({}).exec((err, users)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		return res.json({
			success: true,
			data: users
		});
	});
}
exports.information = (req, res)=>{
	model.findOne({_id: req.decoded.user}).exec((err, user)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		return res.json({
			success: true,
			data: user
		});
	});
}
exports.deleteUser = (req, res)=>{
	model.findOne({_id: req.params.id}).exec((err, user)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		user.remove((err)=>{
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
exports.checkPassword = (req, res)=>{
	if(!req.params.opw){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập mật khẩu cũ.'
		});
	}
	model.findOne({_id: req.decoded.user}).exec((err, user)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!user){
			return res.json({
				success: false,
				msg: 'Không tìm thấy người dùng'
			});
		}
		bcrypt.compare(req.params.opw, user.password, function(err, isMatch) {
      	if (err) throw err;
      	if (!isMatch) {
        	return res.json({
          		success: false,
          		msg: 'Mật khẩu không đúng.'
        	});
      	} else {
        	return res.json({
          		success: true,
          		msg: 'Mật khẩu đúng'
        	});
      	}
    	});
	})
}
exports.checkAuthenticate  = (req,res,next)=>{
	// var token = req.body.token || req.param('token') || req.headers['authorization'];
	var token = req.headers['authorization'];
	if(token){
		jwt.verify(token,'nguyencongduc!@#$%^&*()_+|', (err,decoded)=>{
			if(err){
    			res.json({ 
    				msg: 'Xác thực không thành công', 
    				des: 'Token đã hết hạn'
    			});	
			}else{
				// console.log(decoded);
				req.decoded = decoded;
				next();
			}
		});
	}else{
    	res.json({ msg: 'Vui lòng đăng nhập' });	
	}
}

exports.getOne = (req, res)=>{
	if(!req.params.id){
		return res.json({
			success: false,
			msg: 'Vui lòng nhập ID.'
		});
	}
	model.findOne({_id: req.params.id}).exec((err, user)=>{
		if(err){
			return res.json({
				success: false,
				msg: err
			});
		}
		if(!user){
			return res.json({
				success: false,
				msg: 'Không tìm thấy.'
			});
		}
		return res.json({
			success: true,
			data: user
		})
	})
}