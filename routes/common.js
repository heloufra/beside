var express = require('express');
var router = express.Router();
var commonController = require('../controllers/commonController');
var apiVerifyToken = require('../middleware/apiVerifyToken');


router.get('/subjects', commonController.getSubjects);
router.post('/subjects', commonController.postSubjects);

router.post('/switch', commonController.switchAccount);
router.post('/roles', commonController.switchRole);
router.post('/student', commonController.switchStudent);
router.get('/me', commonController.getUser);
router.post('/me/update', commonController.updateUser);

router.get('/unpaidSubscription', commonController.getStudentMonthlyUnpaidSubscriptions);

/****** Api v1 *******/

router.post('/Api/v1/userInfo', commonController.getUserInfo);
router.post('/Api/v1/userSingleNotification', commonController.getUserSingleNotification);
router.post('/Api/v1/readNotification', commonController.setReadNotification);

/****** Api v1 *******/
router.post('/userInfo',commonController.getUserInfo);
router.post('/userSingleNotification', commonController.getUserSingleNotification);
router.post('/readNotification', commonController.setReadNotification);

router.post('/unpaidSubscription',apiVerifyToken,commonController.getStudentMonthlyUnpaidSubscriptions);

module.exports = router;