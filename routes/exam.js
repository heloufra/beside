var express = require('express');
var router = express.Router();
var examController  = require('../controllers/examController');

router.get('/', examController.examView);
router.get('/all', examController.getExams);
router.post('/save', examController.saveExams);

module.exports = router;