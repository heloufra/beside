const connection = require("../lib/db");

function fetchData(req, callback = () => {}) {
  connection.query(
    "SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1",
    [req.userId],
    (err, users) => {
      connection.query(
        "SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1",
        [req.Institution_ID],
        (err, institutions) => {
          connection.query(
            "SELECT students.* FROM `students` INNER join studentsparents on studentsparents.Student_ID = students.Student_ID Inner join parents on studentsparents.Parent_ID = parents.Parent_ID WHERE parents.Parent_Email = ?",
            [users[0].User_Email],
            (err, students) => {
              callback(
                users,
                users[0],
                institutions[0],
                req.role,
                students.find(student => student.Student_ID == req.currentStudentId),
                students
              );
            }
          );
        }
      );
    }
  );
}

const parentController = {
  absences: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student, students) => {
      res.render("student/absences", {
        title: "Absences",
        user,
        users,
        institution,
        role,
        student,
        students
      });
    }),
  finances: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student, students) => {
      res.render("student/finances", {
        title: "Finance",
        users,
        user,
        institution,
        role,
        student,
        students
      });
    }),
  grades: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student, students) => {
      res.render("student/grades", {
        title: "Grades",
        users,
        user,
        institution,
        role,
        student,
        students
      });
    }),
  exams: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student, students) => {
      res.render("student/exams", {
        title: "Exams",
        user,
        users,
        institution,
        role,
        student,
        students
      });
    }),
  homework: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student, students) => {
      res.render("student/homework", {
        title: "Homework",
        user,
        users,
        institution,
        role,
        student,
        students
      });
    }),
  attitudes: (req, res, next) =>
    fetchData(req, (users, user, institution, role, student, students) => {
      res.render("student/attitudes", {
        title: "Attitudes",
        user,
        users,
        institution,
        role,
        student,
        students
      });
    }),
};

module.exports = parentController;
