var express = require('express');
var router = express.Router();
var commonController  = require('../controllers/commonController');


router.get('/subjects', commonController.getSubjects);
router.post('/subjects', commonController.postSubjects);

router.post('/switch', commonController.switchAccount);
router.post('/roles', commonController.switchRole);
router.post('/student', commonController.switchStudent);
router.get('/me', commonController.getUser);
router.post('/me/update', commonController.updateUser);

module.exports = router;