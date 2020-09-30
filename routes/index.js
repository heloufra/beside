var express = require('express');
var router = express.Router();
var loginController  = require('../controllers/loginController');

/* GET home page. */
router.get('/', loginController.loginView);

router.post('/verify', loginController.checkEmail);
router.post('/login', loginController.checkCode);

module.exports = router;
