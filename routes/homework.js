var express = require('express');
var router = express.Router();
var homeworkController  = require('../controllers/homeworkController');
const authTeacher = require("../middleware/teacherAuth");

router.get('/', homeworkController.homeworkView);
router.post('/save',authTeacher, homeworkController.saveHomework);
router.get('/all', homeworkController.getHomeworks);
router.get('/one', homeworkController.getHomework);
router.post('/remove',authTeacher, homeworkController.deleteHomework);
router.post('/update',authTeacher, homeworkController.updateHomework);

module.exports = router;