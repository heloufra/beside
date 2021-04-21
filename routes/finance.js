var express = require('express');
var router = express.Router();
var financeController  = require('../controllers/financeController');
const authAdmin = require("../middleware/adminAuth");

router.get('/',authAdmin,financeController.financeView);
router.get('/all',authAdmin, financeController.getAllStudents);
router.get('/one', financeController.getStudentFinances);

module.exports = router;