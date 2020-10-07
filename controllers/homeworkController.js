var connection  = require('../lib/db');
var homeworkQuery = `INSERT INTO homeworks(TSC_ID,  Homework_Title, Homework_Deatils, Homework_DeliveryDate) VALUES(?,?,?,?)`;
var selectHomeworks = 'SELECT homeworks.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color FROM `homeworks` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = homeworks.TSC_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID';
var selectHomework = 'SELECT homeworks.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color FROM `homeworks` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.TSC_ID = homeworks.TSC_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE homeworks.Homework_ID = ?';
/*
INSERT INTO `teachersubjectsclasses`(`Teacher_ID`, `Subject_ID`, `Classe_ID`, `AY_ID`) VALUES (1,1,1,1),(1,1,2,1),(1,2,1,1),(1,2,2,1),(1,1,3,1),(1,2,4,1)
*/
var homeworkController = {
  homeworkView: function(req, res, next) {
      connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
        connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
          connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
            connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
              connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                 connection.query("SELECT * FROM `subjects`", (err, subjects, fields) => {
                  res.render('homework', { title: 'Homeworks' , user: user[0], institution:institutions[0], classes:classes,subjects:subjects,levels:levels});
                })
              })
            })
          })
        })
      })
  },
  saveHomework: function(req, res, next) {
    console.log()
    connection.query("SELECT teachersubjectsclasses.TSC_ID FROM `teachersubjectsclasses` INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE subjects.Subject_Label = ? AND classes.Classe_Label = ?  LIMIT 1", [req.body.homework_subject,req.body.homework_classe], (err, tsc, fields) => {
      connection.query(homeworkQuery, [tsc[0].TSC_ID,  req.body.homework_name,  req.body.homework_description, req.body.homework_deliverydate], (err, homework, fields) => {
         if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "List homeworks Error"
                }]});
            } else 
            {
              res.json({saved : true});
            }
       })
    })
  },
  getHomeworks: function(req, res, next) {
    connection.query(selectHomeworks, (err, homeworks, fields) => {
      res.json({
                homeworks:homeworks,
              });
    })
  },
  getHomework: function(req, res, next) {
    connection.query(selectHomework,[req.query.homework_id], (err, homework, fields) => {
      res.json({
                homework:homework,
              });
    })
  },
  deleteHomework: function(req, res, next) {
    connection.query("DELETE FROM `homeworks` WHERE `Homework_ID` = ?", [req.body.id], (err, student, fields) => {
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
  updateHomework: function(req, res, next) {
    console.log(req.body)
    connection.query("UPDATE `homeworks` SET `Homework_Title` = ?,`Homework_Deatils` = ?, `Homework_DeliveryDate` = ? WHERE Homework_ID = ?", [req.body.homework_name,req.body.homework_description,req.body.homework_date,req.body.id], (err, student, fields) => {
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

module.exports = homeworkController;