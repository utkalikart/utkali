/**
 * Created by nrusingh on 2/24/2017.
 */

'use strict';

var express = require('express');
var cuController = require('./createuser.controller');
var router = express.Router();
router.post('/getUsers_Roles', cuController.getUsers_Roles);
router.post('/userUpdateProcess', cuController.userUpdateProcess);
router.post('/createUserAdminProcess', cuController.createUserAdminProcess);
router.post('/userDeleteProcess', cuController.userDeleteProcess);
router.post('/imageUploadAdminProcess', cuController.imageUploadAdminProcess);
router.post('/fileUploadProcess', cuController.fileUploadProcess);
router.post('/getAllImage', cuController.getAllImage);
router.post('/getProductDetails', cuController.getProductDetails);
router.post('/sortPriceLowToHighProcess', cuController.sortPriceLowToHighProcess);
router.post('/sortPriceHighToLowProcess', cuController.sortPriceHighToLowProcess);
router.post('/continueRegistrationProcess', cuController.continueRegistrationProcess);
router.post('/continueLoginProcess', cuController.continueLoginProcess);
router.post('/saveDeliveryAddressProcess', cuController.saveDeliveryAddressProcess);
router.post('/checkDeliveryPinProcess', cuController.checkDeliveryPinProcess);
router.post('/savedDoctorRegistrationProcess', cuController.savedDoctorRegistrationProcess);
router.post('/searchAllItemProcess', cuController.searchAllItemProcess);
router.post('/findProductsProcess', cuController.findProductsProcess);
router.post('/doctorUpdateProcess', cuController.doctorUpdateProcess);
router.post('/doctorDeleteProcess', cuController.doctorDeleteProcess);
router.post('/subCategoryRegistrationProcess', cuController.subCategoryRegistrationProcess);
router.post('/subCategoryUpdateProcess', cuController.subCategoryUpdateProcess);
router.post('/subCategoryDeleteProcess', cuController.subCategoryDeleteProcess);
router.post('/sortInStockProductProcess', cuController.sortInStockProductProcess);
router.post('/sortOutOfStockProductProcess', cuController.sortOutOfStockProductProcess);
router.post('/sorBothProductProcess', cuController.sorBothProductProcess);
router.post('/brandUpdateProcess', cuController.brandUpdateProcess);
router.post('/brandRegistrationProcess', cuController.brandRegistrationProcess);
router.post('/brandDeleteProcess', cuController.brandDeleteProcess);
router.post('/sizeRegistrationProcess', cuController.sizeRegistrationProcess);
router.post('/sizeUpdateProcess', cuController.sizeUpdateProcess);
router.post('/sizeDeleteProcess', cuController.sizeDeleteProcess);
router.post('/sortItemBrandWiseProcess', cuController.sortItemBrandWiseProcess);
router.post('/sortItemSizeWiseProcess', cuController.sortItemSizeWiseProcess);
router.post('/sortItemColorWiseProcess', cuController.sortItemColorWiseProcess);
router.post('/sortPriceRangeProcess', cuController.sortPriceRangeProcess);
router.post('/updateDealsOfTheDayDetails', cuController.updateDealsOfTheDayDetails);

module.exports = router;
