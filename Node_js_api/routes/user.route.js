const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.route('/list')
    .get(userController.list)
router.route('/signup')
    .post(userController.registerUser)
router.route('/login')
    .post(userController.loginUser)
router.route('/create')
    .post(userController.createCart)
router.route('/listcart')
    .get(userController.listCart)
router.route('/upload')
    .post(userController.uploadFile)
router.route('/contact')
    .post(userController.createcontact)

module.exports = router;
