/**
 * Created by nrusingh on 2/24/2017.
 */

'use strict';

var express = require('express');
var userController = require('./user.controller');
var router = express.Router();

router.post('/getUsers', userController.getUsers);
router.post('/', userController.getUsers);
router.post('/userSavedProcess', userController.userSavedProcess);


module.exports = router;
