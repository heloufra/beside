var express = require('express');
var router = express.Router();
var financeController  = require('../controllers/financeController');
const authAdmin = require("../middleware/adminAuth");

router.get('/',authAdmin,financeController.financeView);
router.get('/all',authAdmin, financeController.getAllStudents);

module.exports = router;