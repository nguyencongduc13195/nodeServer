const controller = require('../controllers/author');
const express = require('express');
const router = express.Router();

router.route('/add').post(controller.add);
router.route('/all').get(controller.all);
// router.route('/:slug?').get(controller.getProductsBySlug);
router.route('/find/:id?').get(controller.findOne);
router.route('/findBooks/:name?').get(controller.findBooksByName);
router.route('/update/:id?').put(controller.update);
router.route('/booksOfAuthor/:id?').get(controller.booksOfAuthor);
router.route('/bestAuthor').get(controller.bestAuthor);
router.route('/delete/:id?').delete(controller.delete);

module.exports = router; 