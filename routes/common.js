var express = require('express');
var router = express.Router();
var commonController  = require('../controllers/commonController');

router.get('/subjects', commonController.getSubjects);
router.post('/switch', commonController.switchAccount);
router.post('/roles', commonController.switchRole);

module.exports = router;