var express = require('express');
var router = express.Router();
var expenceController  = require('../controllers/expenceController');
var connection  = require('../lib/db');
const authAdmin = require("../middleware/adminAuth");
var upload  = require('../middleware/uploadFile');

router.get('/',authAdmin, expenceController.expencesView);
router.get('/all',authAdmin, expenceController.getAllExpences);
router.get('/one',authAdmin, expenceController.getExpence);
router.post('/save',authAdmin, expenceController.saveExpence);
router.post('/update',authAdmin, expenceController.updateExpence);
router.post('/one/remove',authAdmin, expenceController.deleteExpence);
router.post('/executePayement',authAdmin, expenceController.executeExpencePayement);

module.exports = router;