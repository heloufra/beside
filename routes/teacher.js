var express = require('express');
var router = express.Router();
var teacherController  = require('../controllers/teacherController');
var connection  = require('../lib/db');

router.get('/', teacherController.teacherView);
router.get('/all', teacherController.getAllteachers);
router.get('/one', teacherController.getTeacher);
router.get('/classes', teacherController.getClasses);
router.post('/save', teacherController.saveteacher);
/*router.post('/update', teacherController.updateteacher);
router.post('/absence', teacherController.saveAbsence);
router.post('/absence/remove', teacherController.deleteAbsence);
router.post('/teacher/remove', teacherController.deleteteacher);*/

module.exports = router;