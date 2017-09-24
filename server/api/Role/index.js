/**
 * Created by dell on 1/7/2017.
 */
'use strict';

var express = require('express');
var roleController = require('./role.controller');
var router = express.Router();

router.post('/getRoles_Permissions', roleController.getRoles_Permissions);
router.post('/roleUpdateProcess', roleController.roleUpdateProcess);
router.post('/roleSavedProcess', roleController.roleSavedProcess);
router.post('/roleDeleteProcess', roleController.roleDeleteProcess);


module.exports = router;



