var express = require('express');
var router = express.Router();
var employeeController  = require('../controllers/employeeController');
var connection  = require('../lib/db');
const authAdmin = require("../middleware/adminAuth");
var upload  = require('../middleware/uploadFile');

router.get('/',authAdmin, employeeController.employeeView);
router.get('/all',authAdmin, employeeController.getAllEmployees);
router.get('/one',authAdmin, employeeController.getEmployee);
router.post('/save',authAdmin, employeeController.saveEmployee);
router.post('/update',authAdmin, employeeController.updateEmployee);
router.post('/one/remove',authAdmin, employeeController.deleteEmployee);

module.exports = router;