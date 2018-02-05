const controller = require('../controllers/category');
const express = require('express');
const router = express.Router();
const multer  = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./public/uploads/categories/');
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
router.route('/delete-image/:name?').get(controller.deleteImage);
router.route('/booksOfCate/:id?').get(controller.booksOfCate);
router.route('/add').post(controller.add);
router.route('/all').get(controller.getAll);
router.route('/:slug?').get(controller.getProductsBySlug);
router.route('/find/:id?').get(controller.findOne);
router.route('/findSlug/:slug?').get(controller.findOneBySlug);
router.route('/update/:id').put(controller.update);
router.route('/delete/:id?').delete(controller.delete);

module.exports = router; 