const express = require('express');
const router = express.Router();
const controller = require('../controllers/order');
const user_controller = require('../controllers/user');
router.route('/add').post(user_controller.checkAuthenticate, controller.add);
router.route('/myorder').get(user_controller.checkAuthenticate, controller.myOrder);
router.route('/all').get(controller.findAll);
router.route('/find/:id?').get(controller.findDetailOrder);
router.route('/update-confirm/:id?').get(controller.updateConfirm);
router.route('/delete/:id?').delete(controller.deleteOrder);
module.exports = router;