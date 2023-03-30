var express = require('express');
var router = express.Router();
var setupController = require('../controllers/setupController');
var commonController  = require('../controllers/commonController');

router.get('/', setupController.setupView);
router.get('/subjects', setupController.getSubjects);
router.post('/save', setupController.setupSave);

router.post('/categories', commonController.getInstitutionCategories);
router.post('/subCategories', commonController.getInstitutionSubCategories);

module.exports = router;
