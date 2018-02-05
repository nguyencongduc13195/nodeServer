const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
router.route('/register').post(controller.register);
router.route('/update').put(controller.checkAuthenticate, controller.updateUser);
router.route('/update-user/:id').put(controller.updateUserByAdmin);
router.route('/all').get(controller.all);
router.route('/find/:id?').get(controller.getOne);
router.route('/login').post(controller.login);
router.route('/forgot-password').post(controller.forgotPassword);
router.route('/checkemail/:email?').get(controller.checkExistEmail);
router.route('/delete-user/:id?').delete(controller.deleteUser);
router.route('/information').get(controller.checkAuthenticate, controller.information);
router.route('/check-password/:opw?').get(controller.checkAuthenticate, controller.checkPassword);

module.exports = router;