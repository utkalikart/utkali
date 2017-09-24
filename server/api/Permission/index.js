/**
 * Created by dell on 1/7/2017.
 */
'use strict';

var express = require('express');
var permissionController = require('./permission.controller');
var router = express.Router();

router.post('/getRoles_Permissions', permissionController.getRoles_Permissions);
router.post('/permissionSavedProcess', permissionController.permissionSavedProcess);
router.post('/permissionUpdateProcess', permissionController.permissionUpdateProcess);
router.post('/permDeleteProcess', permissionController.permDeleteProcess);

module.exports = router;



