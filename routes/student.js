var express = require('express');
var router = express.Router();
var studentController  = require('../controllers/studentController');

router.get('/', studentController.studentView);
router.post('/save', studentController.studentSave);

module.exports = router;