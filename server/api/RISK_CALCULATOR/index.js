'use strict';

var express = require('express');
var riskCalculatorController = require('./risk_calculator.controller');
var router = express.Router();

router.post('/getScore', riskCalculatorController.getScore);

module.exports = router;


