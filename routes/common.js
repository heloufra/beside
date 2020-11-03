var express = require('express');
var router = express.Router();
var commonController  = require('../controllers/commonController');
const auth = require("../middleware/auth");

router.get('/subjects', commonController.getSubjects);
router.post('/switch', commonController.switchAccount);
router.post('/roles', commonController.switchRole);
router.get('/me', commonController.getUser);
router.post('/me/update', commonController.updateUser);

module.exports = router;