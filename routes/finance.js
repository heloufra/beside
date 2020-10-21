var express = require('express');
var router = express.Router();
var financeController  = require('../controllers/financeController');

router.get('/',financeController.financeView);
router.get('/all', financeController.getAllStudents);

module.exports = router;