var express = require('express');
var router = express.Router();
var homeworkController  = require('../controllers/homeworkController');
const authTeacher = require("../middleware/teacherAuth");
var multer  = require('multer')
var upload  = require('../middleware/upload');

router.get('/', homeworkController.homeworkView);
router.post('/save',[authTeacher,upload.single('file')], homeworkController.saveHomework);
router.get('/all', homeworkController.getHomeworks);
router.get('/one', homeworkController.getHomework);
router.post('/remove',authTeacher, homeworkController.deleteHomework);
router.post('/update',[authTeacher,upload.single('file')], homeworkController.updateHomework);

module.exports = router;