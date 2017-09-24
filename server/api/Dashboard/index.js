'use strict';

var express = require('express');
var dashboardController = require('./dashboard.controller');
var router = express.Router();
router.get('/getclinicalCount', dashboardController.getclinicalCount);
router.post('/getAllScoredStudentData', dashboardController.getAllScoredStudentData);
router.post('/searchPatientProcess', dashboardController.searchPatientProcess);
router.post('/individualPaymentReceivedData', dashboardController.individualPaymentReceivedData);
router.post('/getAllSuccessfulTransaction', dashboardController.getAllSuccessfulTransaction);
router.post('/getGraphicalDataAccordingToProduct', dashboardController.getGraphicalDataAccordingToProduct);
router.post('/getGraphicalDataMonthWiseAccordingToProduct', dashboardController.getGraphicalDataMonthWiseAccordingToProduct);

module.exports = router;
