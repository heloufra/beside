var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
const authAdmin = require("../middleware/adminAuth");
const apiVerifyToken = require("../middleware/apiVerifyToken");
var websiteController = require('../controllers/websiteController');
var commonController  = require('../controllers/commonController');
const { json } = require('body-parser');


router.get('/',authAdmin,websiteController.websiteView);
router.get('/get/details',authAdmin,websiteController.getDetails);
router.get('/get/gallery',authAdmin,websiteController.getGallery);
router.get('/get/amenties',authAdmin,websiteController.getAmenties);
router.get('/get/displaySettings', authAdmin, websiteController.getDisplaySettings);

router.post('/update/details',authAdmin,websiteController.updateDetails);
router.post('/update/gallery',authAdmin,websiteController.updateGallery);
router.post('/update/amenties',authAdmin,websiteController.updateAmenties);
router.post('/update/displaySettings', authAdmin, websiteController.updateDisplaySettings);


/*** Api v1 *********************/

router.get('/All/institutionApiInfo', apiVerifyToken, websiteController.getInstitutionApiInfo);

module.exports = router;