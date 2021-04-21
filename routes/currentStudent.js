const express = require("express");
const router = express.Router();
const studentController = require("../controllers/currentStudentController");
const parentController = require("../controllers/parentController");
const studentAuth = require("../middleware/studentAuth");
const parentAuth = require("../middleware/parentAuth");

router.get("/my-absences", studentAuth, studentController.absences);
router.get("/my-finances", studentAuth, studentController.finances);
router.get("/my-grades", studentAuth, studentController.grades);
router.get("/my-exams", studentAuth, studentController.exams);
router.get("/my-homework", studentAuth, studentController.homework);
router.get("/my-attitudes", studentAuth, studentController.attitudes);

router.get("/student-absences", parentAuth, parentController.absences);
router.get("/student-finances", parentAuth, parentController.finances);
router.get("/student-grades", parentAuth, parentController.grades);
router.get("/student-exams", parentAuth, parentController.exams);
router.get("/student-homework", parentAuth, parentController.homework);
router.get("/student-attitudes", parentAuth, parentController.attitudes);

module.exports = router;
