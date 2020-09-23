var express = require('express');
var router = express.Router();
var setupController  = require('../controllers/setupController');

router.get('/', setupController.setupView);
router.post('/detail', setupController.saveDetail)
router.post('/levels', setupController.saveLevels)
router.post('/academic',setupController.saveAcademic)
router.post('/classes', setupController.saveClasses)
router.post('/expenses', setupController.saveExpenses)
router.post('/costs', setupController.saveCosts)
router.post('/subjects', setupController.saveSubjects)

module.exports = router;
