var express = require('express');
var router = express.Router();
var loginController  = require('../controllers/loginController');
const auth = require("../middleware/auth");
const homeMiddleware = require('../middleware/home');

/* GET home page. */
router.get('/', loginController.loginView);

router.get('/home', homeMiddleware);

router.post('/verify', loginController.checkEmail);
router.post('/login', loginController.checkCode);
router.post('/token', loginController.checkToken);
router.get('/logout',auth, loginController.logout);


/*_____________ api v1 _____________*/

router.post('/Api/v1/verify', loginController.checkEmailMobile);
router.post('/Api/v1/login', loginController.checkCodeMobile);
 
module.exports = router;
