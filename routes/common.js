var express = require('express');
var router = express.Router();
var commonController  = require('../controllers/commonController');

router.get('/subjects', commonController.getSubjects);
router.post('/switch', commonController.switchAccount);

module.exports = router;