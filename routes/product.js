const controller = require('../controllers/product');
const user_controller = require('../controllers/user');
const express = require('express');
const router = express.Router();
const multer  = require('multer');
var storageDetail = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./public/uploads/detail-products/');
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
var uploadDetail = multer({ storage: storageDetail, fileFilter: extendsionFile }).array('imageDetail',3);
var upload = multer({ storage: storageDetail, fileFilter: extendsionFile }).single('txtImage');
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
router.post('/upload-images-detail', function (req, res, next) {
    uploadDetail(req, res, function (err) {
        if (err) {
            return res.json({
              succes: false,
              msg: err
            })
        }  
        var arrayImage = []
        for (var i = 0; i < req.files.length; i++) {
           arrayImage.push(req.files[i]['filename']); 
        }
        return res.json({
            success: true,
            name: arrayImage
        }); 
    });     
});
router.route('/img/:name').get(controller.getNameImage);
router.route('/images-detail/:name').get(controller.getDetailNameImage);
router.route('/delete-image/:name').get(controller.deleteImage);
router.route('/findProductsByGender/:gender?').get(controller.findProductsByGender);
router.route('/findProductsBySize/:size?').get(controller.findProductsBySize);
router.route('/findProductsByColor/:color?').get(controller.findProductsByColor);
router.route('/findProductsByPrice/:price?').get(controller.findProductsByPrice);
router.route('/findProducts/:name?').get(controller.findProductsByUse);
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