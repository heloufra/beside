var express = require('express');
var router = express.Router();
var homeworkController  = require('../controllers/homeworkController');

router.get('/', homeworkController.homeworkView);
router.post('/save', homeworkController.saveHomework);
router.get('/all', homeworkController.getHomeworks);
router.get('/one', homeworkController.getHomework);
router.post('/remove', homeworkController.deleteHomework);
router.post('/update', homeworkController.updateHomework);

module.exports = router;