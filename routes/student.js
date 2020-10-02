var express = require('express');
var router = express.Router();
var studentController  = require('../controllers/studentController');
const auth = require("../middleware/auth");

router.get('/', studentController.studentView);
router.get('/all', studentController.getAllStudents);
router.get('/one', studentController.getStudent);
router.get('/subscriptions', studentController.getSubscriptions);
router.post('/save', studentController.saveStudent);
router.post('/absence', studentController.saveAbsence);
router.post('/attitude', studentController.saveAttitude);

module.exports = router;