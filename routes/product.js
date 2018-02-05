const controller = require('../controllers/product');
const user_controller = require('../controllers/user');
const express = require('express');
const router = express.Router();
const multer  = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./public/uploads/products/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
})
function extendsionFile(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
        return cb(new Error('Vui lòng nhập file ảnh'));
    } else {
        cb(null, true);
    }
}
var upload = multer({ storage: storage, fileFilter: extendsionFile }).single('txtImage');
router.post('/uploadimage', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
          	return res.json({
          		succes: false,
          		msg: err
          	})
        }  
        let name = req.file.filename
        return res.json({
          	success: true,
          	name: name
        }); 
  	});     
});
router.route('/img/:name').get(controller.getNameImage);
router.route('/delete-image/:name').get(controller.deleteImage);
router.route('/add').post(controller.add);
router.route('/delete/:id').delete(controller.deleteProduct);
router.route('/update/:id').put(controller.update);
router.route('/update-brand/:id?/:newbrand?').get(controller.updateBrand);
router.route('/update-cate/:id?/:newcate?').get(controller.updateCate);
router.route('/all').get(controller.getAll);
router.route('/mostLikes').get(controller.mostLikes);
router.route('/mostViews').get(controller.mostViews);
router.route('/newstProduct').get(controller.newestProduct);
router.route('/total-product').get(controller.totalProduct);
router.route('/:slug').get(controller.findOne);
router.route('/find/:id').get(controller.findProductById);
router.route('/like/:id').get(user_controller.checkAuthenticate, controller.likeProduct);
router.route('/dislike/:id').get(user_controller.checkAuthenticate, controller.dislikeProduct);
router.route('/addreview/:id').post(user_controller.checkAuthenticate, controller.addReview);
router.route('/related/:id?').get(controller.relatedProduct);
router.route('/diffirent/:id?').get(controller.diffirentProduct);
router.route('/search/:search?').get(controller.searchItem);

module.exports = router;