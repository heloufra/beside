var express = require('express');
var router = express.Router();
var teacherController  = require('../controllers/teacherController');
var connection  = require('../lib/db');

router.get('/', teacherController.teacherView);
router.get('/all', teacherController.getAllteachers);
router.get('/one', teacherController.getTeacher);
router.get('/classes', teacherController.getClasses);
router.post('/save', teacherController.saveTeacher);
router.post('/absence', teacherController.saveAbsence);
router.post('/update', teacherController.updateTeacher);
router.post('/absence/remove', teacherController.deleteAbsence);
router.post('/one/remove', teacherController.deleteteacher);

module.exports = router;