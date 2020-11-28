var express = require('express');
var router = express.Router();
var teacherController  = require('../controllers/teacherController');
var connection  = require('../lib/db');
const authAdmin = require("../middleware/adminAuth");
var upload  = require('../middleware/uploadFile');

router.get('/',authAdmin, teacherController.teacherView);
router.get('/all',authAdmin, teacherController.getAllteachers);
router.get('/one',authAdmin, teacherController.getTeacher);
router.get('/classes',authAdmin, teacherController.getClasses);
router.get('/list',authAdmin, teacherController.getTeachersByClasse);
router.post('/save',authAdmin, teacherController.saveTeacher);
router.post('/absence',authAdmin, teacherController.saveAbsence);
router.post('/update',authAdmin, teacherController.updateTeacher);
router.post('/absence/remove',authAdmin, teacherController.deleteAbsence);
router.post('/absence/update',authAdmin, teacherController.updateAbsence);
router.post('/one/remove',authAdmin, teacherController.deleteteacher);
router.post('/upload/file',[authAdmin,upload.single('file')], teacherController.importFile);

module.exports = router;