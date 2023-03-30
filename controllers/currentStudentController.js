const connection = require("../lib/db");

function fetchData(req, callback = () => {}) {
  connection.query(
    "SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1",
    [req.session.userId],
    (err, users) => {
      connection.query(
        "SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1",
        [req.session.Institution_ID],
        (err, institutions) => {
          connection.query(
            "SELECT * FROM `students` WHERE `Student_Email` = ? LIMIT 1",
            [users[0].User_Email],
            (err, students) => {
              callback(users, users[0], institutions[0], req.role, students[0]);
            }
          );
        }
      );
    }
  );
}

const studentController = {
  absences: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student) => {
      res.render("student/absences", {
        title: "Absences",
        user,
        users,
        institution,
        role,
        student,
        students: [],
      });
    }),
  finances: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student) => {
      res.render("student/finances", {
        title: "Finance",
        user,
        users,
        institution,
        role,
        student,
        students: [],
      });
    }),
  grades: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student) => {
      res.render("student/grades", {
        title: "Grades",
        user,
        users,
        institution,
        role,
        student,
        students: [],
      });
    }),
  exams: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student) => {
      res.render("student/exams", {
        title: "Exams",
        user,
        users,
        institution,
        role,
        student,
        students: [],
      });
    }),
  homework: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student) => {
      res.render("student/homework", {
        title: "Homework",
        user,
        users,
        institution,
        role,
        student,
        students: [],
      });
    }),
  attitudes: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student) => {
      res.render("student/attitudes", {
        title: "Attitudes",
        user,
        users,
        institution,
        role,
        student,
        students: [],
      });
    }),
};

module.exports = studentController;
