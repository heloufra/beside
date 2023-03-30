var connection = require("../lib/db");

var arrLang = require("../languages/languages.js");
var commonModel = require("../models/commonModel");

var examQuery = `INSERT INTO exams(TSC_ID,  Exam_Title, Exam_Deatils, Exam_Date,Exam_Status) VALUES(?,?,?,?,1)`;
var selectExams =
  'SELECT DISTINCT exams.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color,users.User_Name FROM `institutionsusers` INNER JOIN users ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN exams ON exams.TSC_ID = teachersubjectsclasses.TSC_ID WHERE exams.Exam_Status <> "0" AND teachersubjectsclasses.AY_ID = ?';
var selectExamsTeacher =
  'SELECT DISTINCT exams.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color,users.User_Name FROM `institutionsusers` INNER JOIN users ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN exams ON exams.TSC_ID = teachersubjectsclasses.TSC_ID WHERE exams.Exam_Status <> "0" AND teachersubjectsclasses.AY_ID = ? AND teachersubjectsclasses.Teacher_ID = ?';
var selectExam =
  'SELECT exams.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color,users.User_Name FROM `institutionsusers` INNER JOIN users ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN exams ON exams.TSC_ID = teachersubjectsclasses.TSC_ID WHERE exams.Exam_Status <> "0" AND institutionsusers.Institution_ID = ? AND exams.Exam_ID = ?';
var selectScore =
  "SELECT students.*,grads.Exam_Score,grads.Grad_ID,classes.Classe_Label FROM `exams` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = exams.TSC_ID INNER JOIN studentsclasses ON studentsclasses.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN students ON students.Student_ID = studentsclasses.Student_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID LEFT JOIN grads ON grads.Student_ID = students.Student_ID AND grads.Exam_ID = exams.Exam_ID WHERE exams.Exam_ID = ?  AND students.Student_Status <> 0";
var teacherModel = require("../models/teacherModel");

var examController = {
  examView: function (req, res, next) {
    connection.query(
      "SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1",
      [req.session.userId],
      (err, user, fields) => {
        connection.query(
          "SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'",
          [req.session.userId],
          (err, accounts, fields) => {
            connection.query(
              "SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status <> 0",
              [req.session.Institution_ID, req.session.userId],
              (err, users, fields) => {
                connection.query(
                  "SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1",
                  [req.session.Institution_ID],
                  (err, institutions, fields) => {
                    connection.query(
                      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
                      [req.session.Institution_ID],
                      (err, academic, fields) => {
                        connection.query(
                          "SELECT * FROM `classes` WHERE AY_ID = ?",
                          [academic[0].AY_ID],
                          (err, classes, fields) => {
                            connection.query(
                              "SELECT * FROM `levels` WHERE AY_ID = ?",
                              [academic[0].AY_ID],
                              (err, levels, fields) => {
                                connection.query(
                                  "SELECT * FROM `subjects` where Institution_ID = ? AND Subject_Status = 1 ",
                                  [req.session.Institution_ID],
                                  async (err, subjects, fields) => {
                                    if (req.role === "Teacher") {
                                      classes = await teacherModel.findClasses(
                                        req.session.userId,
                                        academic[0].AY_ID
                                      );
                                      subjects =
                                        await teacherModel.findSubjects(
                                          req.session.userId,
                                          academic[0].AY_ID
                                        );
                                    }
                                    res.render("exam", {
                                      title: "Exams",
                                      user: user[0],
                                      institution: institutions[0],
                                      classes: classes,
                                      subjects: subjects,
                                      levels: levels,
                                      accounts,
                                      users,
                                      role: req.role,
                                    });
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  },

  saveExams: async function (req, res, next) {
    connection.query(
      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      async (err, academic, fields) => {
        connection.query(
          "SELECT teachersubjectsclasses.TSC_ID ,u.* FROM `teachersubjectsclasses` INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN users u ON(teachersubjectsclasses.Teacher_ID = u.User_ID )     WHERE subjects.Subject_Label = ? AND classes.Classe_Label = ? AND teachersubjectsclasses.Teacher_ID = ? AND User_Status = 1 AND teachersubjectsclasses.AY_ID LIMIT 1",
          [
            req.body.exam_subject,
            req.body.exam_classe,
            req.session.userId,
            academic[0].AY_ID,
          ],
          (err, tsc, fields) => {
            connection.query(
              examQuery,
              [
                tsc[0].TSC_ID,
                req.body.exam_name,
                req.body.exam_description,
                req.body.exam_date,
              ],
              async (err, exam, fields) => {
                if (err) {
                  console.log(err);
                  res.json({
                    errors: [
                      {
                        field: "Access denied",
                        errorDesc: "List exams Error",
                      },
                    ],
                  });
                } else {
                  /*____ Notification_____*/

                  const StudentList = await commonModel.getStudentsList(
                    academic[0].AY_ID,
                    tsc[0].TSC_ID,
                    "Exams"
                  );

                  console.log("StudentList", StudentList);

                  const Receivers = await commonModel.getReceivers(StudentList);

                  console.log("Receivers =>", Receivers);

                  if (Receivers.length > 0) {
                    for (r = 0; r < Receivers.length; r++) {
                      Receivers[r].map(async (Receiver) => {
                        if (Receiver.User_Role == "Student") {
                          //add Notifications
                          await commonModel.addNotifications(
                            Receiver.User_ID,
                            Receiver.User_Role,
                            exam.insertId,
                            5
                          );
                          //send Notification
                          //const strippedString = (String(req.body.exam_description).substring(0,45));
                          //await commonModel.sendPushNotification(Receiver.User_Expo_Token,req.body.exam_name,strippedString,tsc[0].User_Name);

                          var notificationBody =
                            tsc[0].User_Gender == "Female"
                              ? arrLang["fr"]["A_Ajoutee"]
                              : arrLang["fr"]["A_Ajoute"];
                          notificationBody +=
                            " " +
                            arrLang["fr"]["Nouveau"] +
                            " " +
                            arrLang["fr"]["Notification_Exam"];

                          var name = JSON.parse(tsc[0].User_Name);
                          if (name.first_name) {
                            name = name.first_name + " " + name.last_name;
                          } else {
                            name = tsc[0].User_Name;
                          }

                          await commonModel.sendPushNotification(
                            Receiver.User_Expo_Token,
                            name,
                            notificationBody
                          );
                        } else {
                          //add Notifications
                          await commonModel.addNotifications(
                            Receiver.User_ID,
                            Receiver.User_Role,
                            exam.insertId,
                            5,
                            Receiver.Parent_Child_ID
                          );
                          //send Notification
                          const childName = Receiver.Child_Full_Name;
                          const notificationBody =
                            arrLang["fr"]["Nouveau"] +
                            " " +
                            arrLang["fr"]["Notification_Exam"] +
                            " " +
                            arrLang["fr"]["A_Ete_Ajoute"];
                          await commonModel.sendPushNotification(
                            Receiver.User_Expo_Token,
                            childName,
                            notificationBody
                          );
                        }
                      });
                    }
                  }

                  /*____End Notification_____*/

                  res.json({ saved: true });
                }
              }
            );
          }
        );
      }
    );
  },
  saveScores: function (req, res, next) {
    for (var i = req.body.scores.length - 1; i >= 0; i--) {
      if (req.body.scores[i].gradid === "") {
        connection.query(
          "INSERT INTO grads(Exam_ID, Student_ID, Exam_Score) VALUES(?,?,?)",
          [
            req.body.examId,
            req.body.scores[i].student,
            req.body.scores[i].score,
          ]
        );
      } else {
        connection.query(
          "UPDATE `grads` SET `Exam_Score` = ? WHERE Grad_ID = ?",
          [req.body.scores[i].score, req.body.scores[i].gradid]
        );
      }
    }
    res.json({ saved: true });
  },
  getExams: function (req, res, next) {
    connection.query(
      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, academic, fields) => {
        if (req.role === "Admin")
          connection.query(
            selectExams,
            [academic[0].AY_ID],
            (err, exams, fields) => {
              res.json({
                exams: exams,
              });
            }
          );
        else
          connection.query(
            selectExamsTeacher,
            [academic[0].AY_ID, req.session.userId],
            (err, exams, fields) => {
              res.json({
                exams: exams,
              });
            }
          );
      }
    );
  },
  getExam: function (req, res, next) {
    connection.query(
      "SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, institutions, fields) => {
        connection.query(
          selectExam,
          [req.session.Institution_ID, req.query.exam_id],
          (err, exam, fields) => {
            connection.query(
              selectScore,
              [req.query.exam_id],
              (err, score, fields) => {
                connection.query(
                  "SELECT AVG(grads.Exam_Score) as average FROM `exams` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = exams.TSC_ID INNER JOIN studentsclasses ON studentsclasses.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN students ON students.Student_ID = studentsclasses.Student_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID LEFT JOIN grads ON grads.Exam_ID = exams.Exam_ID WHERE exams.Exam_ID = ?  AND students.Student_Status <> 0",
                  [req.query.exam_id],
                  (err, average, fields) => {
                    res.json({
                      exam: exam,
                      score: score,
                      average: average[0],
                      role: req.role,
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  },
  deleteExam: function (req, res, next) {
    connection.query(
      "UPDATE `exams` SET `Exam_Status` = 0 WHERE `Exam_ID` = ?",
      [req.body.id],
      (err, student, fields) => {
        if (err) {
          console.log(err);
          res.json({
            errors: [
              {
                field: "Access denied",
                errorDesc: "Cannot Remove it",
              },
            ],
          });
        } else {
          res.json({ removed: true });
        }
      }
    );
  },
  updateExam: function (req, res, next) {
    connection.query(
      "UPDATE `exams` SET `Exam_Title` = ?,`Exam_Deatils` = ?, `Exam_Date` = ? WHERE Exam_ID = ?",
      [
        req.body.exam_name,
        req.body.exam_description,
        req.body.exam_date,
        req.body.id,
      ],
      (err, student, fields) => {
        if (err) {
          console.log(err);
          res.json({
            errors: [
              {
                field: "Access denied",
                errorDesc: "Cannot Remove it",
              },
            ],
          });
        } else {
          res.json({ updated: true });
        }
      }
    );
  },
};

module.exports = examController;
