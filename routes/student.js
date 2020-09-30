var express = require('express');
var router = express.Router();
var studentController  = require('../controllers/studentController');
const auth = require("../middleware/auth");

router.get('/',auth, studentController.studentView);
router.post('/save', studentController.studentSave);

module.exports = router;