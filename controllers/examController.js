var connection  = require('../lib/db');
var examQuery = `INSERT INTO exams(TSC_ID,  Exam_Title, Exam_Deatils, Exam_Date) VALUES(?,?,?,?)`;
var selectExams = 'SELECT exams.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color FROM `exams` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = exams.TSC_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID';
var selectExam = 'SELECT exams.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color FROM `exams` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = exams.TSC_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE exams.Exam_ID = ?';

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
  getExams: function(req, res, next) {
    connection.query(selectExams, (err, exams, fields) => {
      res.json({
                exams:exams,
              });
    })
  },
  getExam: function(req, res, next) {
    connection.query(selectExam,[req.query.exam_id], (err, exam, fields) => {
      res.json({
                exam:exam,
              });
    })
  },
  deleteExam: function(req, res, next) {
    connection.query("DELETE FROM `exams` WHERE `Exam_ID` = ?", [req.body.id], (err, student, fields) => {
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
    connection.query("UPDATE `Exams` SET `Exam_Title` = ?,`Exam_Deatils` = ?, `Exam_Date` = ? WHERE Exam_ID = ?", [req.body.exam_name,req.body.exam_description,req.body.exam_date,req.body.id], (err, student, fields) => {
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