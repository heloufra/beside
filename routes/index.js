var express = require('express');
var router = express.Router();
var loginController  = require('../controllers/loginController');
const auth = require("../middleware/auth");

/* GET home page. */
router.get('/', loginController.loginView);

router.post('/verify', loginController.checkEmail);
router.post('/login', loginController.checkCode);
router.post('/token', loginController.checkToken);
router.get('/logout',auth, loginController.logout);

module.exports = router;
