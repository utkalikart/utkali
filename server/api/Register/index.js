/**
 * Created by Bestray3 on 11/1/2016.
 */
'use strict';

var express = require('express');
var regController = require('./register.controller');
var loginController = require('./login.controller');
var validatemailController=require('./validatemail.controller');
var router = express.Router();

router.post('/registerProcess', regController.registerProcess);
router.post('/loginProcess', loginController.loginProcess);
router.post('/validateMailParam', validatemailController.validateMailParam);
router.post('/forgotPasswordProcess', loginController.forgotPasswordProcess);
router.post('/confirmPasswordProcess', loginController.confirmPasswordProcess);
router.post('/logOutProcess', loginController.logOutProcess);


module.exports = router;
