var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
const authAdmin = require("../middleware/adminAuth");
var settingsController  = require('../controllers/settingsController');

router.get('/',authAdmin,settingsController.settingsView);
router.post('/update/details',authAdmin,settingsController.updateDetails);
router.post('/update/academic',authAdmin,settingsController.updateAY);
router.post('/update/levels',authAdmin,settingsController.updateLevels);
router.post('/update/expenses',authAdmin,settingsController.updateExpenses);
router.post('/update/classes',authAdmin,settingsController.updateClasses);
router.post('/update/costs',authAdmin,settingsController.updateCosts);
router.post('/update/subjects',authAdmin,settingsController.updateSubjects);
router.get('/get/details',authAdmin,settingsController.getDetails);
router.get('/get/academic',authAdmin,settingsController.getAcademic);
router.get('/get/levels',authAdmin,settingsController.getLevels);
router.get('/get/classes',authAdmin,settingsController.getClasses);
router.get('/get/subjects',authAdmin,settingsController.getSubjects);
router.get('/get/expenses',authAdmin,settingsController.getExpenses);
router.get('/get/costs',authAdmin,settingsController.getCosts);

module.exports = router;