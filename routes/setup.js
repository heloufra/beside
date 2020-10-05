var express = require('express');
var router = express.Router();
var setupController  = require('../controllers/setupController');

router.get('/', setupController.setupView);
router.get('/subjects', setupController.getSubjects);
router.post('/save', setupController.setupSave);

module.exports = router;
