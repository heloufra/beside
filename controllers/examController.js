var connection  = require('../lib/db');
var examQuery = `INSERT INTO exams(TSC_ID,  Exam_Title, Exam_Deatils, Exam_Date,Exam_Status) VALUES(?,?,?,?,1)`;
var selectExams = 'SELECT exams.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color FROM `exams` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = exams.TSC_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE Exam_Status <> "0"';
var selectExam = 'SELECT exams.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color FROM `exams` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = exams.TSC_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE exams.Exam_ID = ?';
var selectScore = 'SELECT students.*,grads.Exam_Score,grads.Grad_ID,classes.Classe_Label FROM `exams` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = exams.TSC_ID INNER JOIN studentsclasses ON studentsclasses.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN students ON students.Student_ID = studentsclasses.Student_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID LEFT JOIN grads ON grads.Exam_ID = exams.Exam_ID WHERE exams.Exam_ID = ?  AND students.Student_Status <> 0'

var examController = {
  examView: function(req, res, next) {
      connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
        connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
          connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
            connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
              connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                connection.query("SELECT * FROM `subjects`", (err, subjects, fields) => {
                  res.render('exam', { title: 'Exams' , user: user[0], institution:institutions[0], classes:classes,subjects:subjects,levels:levels});
                })
              })
            })
          })
        })
      })
  },
  saveExams: function(req, res, next) {
    connection.query("SELECT teachersubjectsclasses.TSC_ID FROM `teachersubjectsclasses` INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE subjects.Subject_Label = ? AND classes.Classe_Label = ?  LIMIT 1", [req.body.exam_subject,req.body.exam_classe], (err, tsc, fields) => {
      connection.query(examQuery, [tsc[0].TSC_ID,  req.body.exam_name,  req.body.exam_description, req.body.exam_date], (err, exam, fields) => {
         if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "List exams Error"
                }]});
            } else 
            {
              res.json({saved : true});
            }
       })
    })
  },
  saveScores: function(req, res, next) {
    console.log(req.body)
    for (var i = req.body.scores.length - 1; i >= 0; i--) {
        if(req.body.scores[i].gradid === '')
      {
        connection.query("INSERT INTO grads(Exam_ID, Student_ID, Exam_Score) VALUES(?,?,?)", [req.body.examId,req.body.scores[i].student,req.body.scores[i].score])
      } else {
        connection.query("UPDATE `grads` SET `Exam_Score` = ? WHERE Grad_ID = ?", [req.body.scores[i].score,req.body.scores[i].gradid])
      }
    }
    res.json({saved : true});
  },
  getExams: function(req, res, next) {
    connection.query(selectExams, (err, exams, fields) => {
      res.json({
                exams:exams,
              });
    })
  },
  getExam: function(req, res, next) {
    connection.query(selectExam,[req.query.exam_id], (err, exam, fields) => {
      connection.query(selectScore,[req.query.exam_id], (err, score, fields) => {
        connection.query("SELECT AVG(grads.Exam_Score) as average FROM `exams` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = exams.TSC_ID INNER JOIN studentsclasses ON studentsclasses.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN students ON students.Student_ID = studentsclasses.Student_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID LEFT JOIN grads ON grads.Exam_ID = exams.Exam_ID WHERE exams.Exam_ID = ?  AND students.Student_Status <> 0",[req.query.exam_id], (err, average, fields) => {
          res.json({
                    exam:exam,
                    score:score,
                    average:average[0]
                  });
        })
      })
    })
  },
  deleteExam: function(req, res, next) {
    connection.query("UPDATE `exams` SET `Exam_Status` = 0 WHERE `Exam_ID` = ?", [req.body.id], (err, student, fields) => {
       if (err) {
            console.log(err);
              res.json({
                errors: [{
                field: "Access denied",
                errorDesc: "Cannot Remove it"
              }]});
          } else 
          {
            res.json({removed : true});
          }
     })
  },
  updateExam: function(req, res, next) {
    console.log(req.body)
    connection.query("UPDATE `exams` SET `Exam_Title` = ?,`Exam_Deatils` = ?, `Exam_Date` = ? WHERE Exam_ID = ?", [req.body.exam_name,req.body.exam_description,req.body.exam_date,req.body.id], (err, student, fields) => {
       if (err) {
            console.log(err);
              res.json({
                errors: [{
                field: "Access denied",
                errorDesc: "Cannot Remove it"
              }]});
          } else 
          {
            res.json({updated : true});
          }
     })
  },
};

module.exports = examController;