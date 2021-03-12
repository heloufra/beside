const express = require('express');
const router = express.Router();
const studentController  = require('../controllers/studentController');
const authAdmin = require("../middleware/adminAuth");
const upload  = require('../middleware/uploadFile');

router.get('/', studentController.studentView);
router.get('/all', studentController.getAllStudents);
router.get('/one', studentController.getStudent);
router.get('/list', studentController.getStudentsByClasse);
router.get('/subscriptions', studentController.getSubscriptions);
router.post('/save',authAdmin, studentController.saveStudent);
router.post('/update',authAdmin, studentController.updateStudent);
router.post('/payment',authAdmin, studentController.savePayments);
router.post('/absence', studentController.saveAbsence);
router.post('/absence/remove', studentController.deleteAbsence);
router.post('/absence/update', studentController.updateAbsence);
router.post('/attitude', studentController.saveAttitude);
router.post('/attitude/remove', studentController.deleteAttitude);
router.post('/attitude/update', studentController.updateAttitude);
router.post('/one/remove',authAdmin, studentController.deleteStudent);
router.post('/upload/file',[authAdmin,upload.single('file')], studentController.importFile);

module.exports = router;