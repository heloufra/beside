var express = require('express');
var router = express.Router();
var studentController  = require('../controllers/studentController');
const auth = require("../middleware/auth");

router.get('/', studentController.studentView);
router.get('/list', studentController.getStudents);
router.get('/subscriptions', studentController.getSubscriptions);
router.post('/save', studentController.saveStudent);

module.exports = router;