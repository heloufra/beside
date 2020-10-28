var express = require('express');
var router = express.Router();
var examController  = require('../controllers/examController');
const authTeacher = require("../middleware/teacherAuth");

router.get('/', examController.examView);
router.get('/all', examController.getExams);
router.post('/save',authTeacher, examController.saveExams);
router.get('/one', examController.getExam);
router.post('/remove',authTeacher, examController.deleteExam);
router.post('/update',authTeacher, examController.updateExam);
router.post('/score',authTeacher, examController.saveScores);

module.exports = router;