const controller = require('../controllers/brand');
const router = require('express').Router();
const multer  = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./public/uploads/brands/');
        // cb(null, './../src/uploads/')
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

router.route('/add').post(controller.add);
router.route('/booksOfBrand/:id?').get(controller.booksOfBrand);
router.route('/delete/:id').delete(controller.delete);
router.route('/update/:id').put(controller.update);
router.route('/find/:id').get(controller.findOne);
router.route('/findOne/:slug').get(controller.findOneBySlug);
router.route('/brands/:slug').get(controller.getProductsBySlug);
router.route('/all').get(controller.all);
router.route('/img/:name').get(controller.getNameImage);
router.route('/delete-image/:name').get(controller.deleteImage);
module.exports = router;