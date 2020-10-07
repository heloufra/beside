var express = require('express');
var router = express.Router();
var studentController  = require('../controllers/studentController');
const auth = require("../middleware/auth");

router.get('/', studentController.studentView);
router.get('/all', studentController.getAllStudents);
router.get('/one', studentController.getStudent);
router.get('/subscriptions', studentController.getSubscriptions);
router.post('/save', studentController.saveStudent);
router.post('/update', studentController.updateStudent);
router.post('/absence', studentController.saveAbsence);
router.post('/absence/remove', studentController.deleteAbsence);
router.post('/attitude', studentController.saveAttitude);
router.post('/attitude/remove', studentController.deleteAttitude);
router.post('/student/remove', studentController.deleteStudent);

module.exports = router;