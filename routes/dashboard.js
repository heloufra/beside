var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
var dashboardController  = require('../controllers/dashboardController');
const authAdmin = require("../middleware/adminAuth");
/* GET users listing. */
router.get('/',authAdmin, dashboardController.dashboardView);
router.get('/absences',authAdmin, dashboardController.getAllAbsences);
router.get('/payments',authAdmin, dashboardController.getAllPayments);

router.get('/monthlyExpenses',authAdmin,dashboardController.getMonthsExpenses);

module.exports = router;