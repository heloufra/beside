var connection  = require('../lib/db');
var homeworkQuery = `INSERT INTO homeworks(TSC_ID,  Homework_Title, Homework_Deatils, Homework_DeliveryDate,Homework_Status) VALUES(?,?,?,?,1)`;
var homeworkFileQuery = `INSERT INTO homeworks_attachement(Homework_ID, Homework_Link, Homework_Title, HA_Status) VALUES(?,?,?,1)`;
var selectHomeworks = 'SELECT DISTINCT homeworks.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color,users.User_Name FROM `institutionsusers` INNER JOIN users ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN homeworks ON homeworks.TSC_ID = teachersubjectsclasses.TSC_ID WHERE homeworks.Homework_Status <> "0" AND teachersubjectsclasses.AY_ID = ?';
var selectHomeworksTeacher = 'SELECT DISTINCT homeworks.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color,users.User_Name FROM `institutionsusers` INNER JOIN users ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN homeworks ON homeworks.TSC_ID = teachersubjectsclasses.TSC_ID WHERE homeworks.Homework_Status <> "0" AND teachersubjectsclasses.AY_ID = ? AND teachersubjectsclasses.Teacher_ID = ?';
var selectHomework = 'SELECT homeworks.*,classes.Classe_Label,subjects.Subject_Label,subjects.Subject_Color,users.User_Name FROM `institutionsusers` INNER JOIN users ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN homeworks ON homeworks.TSC_ID = teachersubjectsclasses.TSC_ID WHERE homeworks.Homework_Status <> "0" AND institutionsusers.Institution_ID = ? AND homeworks.Homework_ID = ?';
var selectHomeworkFiles = 'SELECT * FROM homeworks_attachement WHERE HA_Status <> "0" AND  Homework_ID = ?';
var teacherModel  = require('../models/teacherModel');
var fs = require('fs');
/*
INSERT INTO `teachersubjectsclasses`(`Teacher_ID`, `Subject_ID`, `Classe_ID`, `AY_ID`) VALUES (1,1,1,1),(1,1,2,1),(1,2,1,1),(1,2,2,1),(1,1,3,1),(1,2,4,1)
*/
var homeworkController = {
  homeworkView:  function(req, res, next) {
    connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'", [req.userId], (err, accounts, fields) => {
        connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status <> 0", [req.Institution_ID,req.userId], (err, users, fields) => {
          connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {       
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
              connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
                connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                  connection.query("SELECT * FROM `subjects`",async (err, subjects, fields) => {
                    if (req.role === 'Teacher')
                      {
                        classes = await teacherModel.findClasses(req.userId);
                        subjects = await teacherModel.findSubjects(req.userId);
                      }
                    res.render('homework', { title: 'Homeworks' , user: user[0], institution:institutions[0], classes:classes,subjects:subjects,levels:levels,accounts,users,role:req.role});
                  })
                })
              })
            })
          })
        })
      })
    })
  },
  saveHomework: function(req, res, next) {
    connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query("SELECT teachersubjectsclasses.TSC_ID FROM `teachersubjectsclasses` INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE subjects.Subject_Label = ? AND classes.Classe_Label = ? AND teachersubjectsclasses.Teacher_ID = ? AND teachersubjectsclasses.AY_ID = ? LIMIT 1", [req.body.homework_subject,req.body.homework_classe,req.userId,academic[0].AY_ID], (err, tsc, fields) => {
        if (tsc[0])
        {

          connection.query(homeworkQuery, [tsc[0].TSC_ID,  req.body.homework_name,  req.body.homework_description, req.body.homework_deliverydate], (err, homework, fields) => {
            if (req.file)
              connection.query(homeworkFileQuery, [homework.insertId,req.file.path.replace(/\\/g, "/").replace('public',''),req.body.homework_name], (err, homeworkfile, fields) => {
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
            else
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
        }
      })
    })
  },
  getHomeworks: function(req, res, next) {
    connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      if (req.role === 'Admin')
        connection.query(selectHomeworks,[academic[0].AY_ID], (err, homeworks, fields) => {
          res.json({
                    homeworks:homeworks,
                  });
        })
      else
        connection.query(selectHomeworksTeacher,[academic[0].AY_ID,req.userId], (err, homeworks, fields) => {
          res.json({
                    homeworks:homeworks,
                  });
        })
    })
  },
  getHomework: function(req, res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
      connection.query(selectHomework,[req.Institution_ID,req.query.homework_id], (err, homework, fields) => {
        connection.query(selectHomeworkFiles,[req.query.homework_id], (err, homeworkFiles, fields) => {
          res.json({
                    homework,
                    homeworkFiles
                  });
        })
      })
    })
  },
  deleteHomework: function(req, res, next) {
    connection.query("UPDATE `homeworks` SET `Homework_Status` = 0 WHERE `Homework_ID` = ?", [req.body.id], (err, student, fields) => {
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
    connection.query("UPDATE `homeworks` SET `Homework_Title` = ?,`Homework_Deatils` = ?, `Homework_DeliveryDate` = ? WHERE Homework_ID = ?", [req.body.homework_name,req.body.homework_description,req.body.homework_date,req.body.id], (err, student, fields) => {
      if (req.file)
        connection.query(homeworkFileQuery, [req.body.id,req.file.path.replace(/\\/g, "/").replace('public',''),req.body.homework_name], (err, homeworkfile, fields) => {
         if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "List homeworks Error"
                }]});
            } else 
            {
              res.json({updated : true});
            }
       })
      else
        if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "List homeworks Error"
                }]});
            } else 
            {
              res.json({updated : true});
            }
    })
  },
};

module.exports = homeworkController;