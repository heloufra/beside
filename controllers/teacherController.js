var connection  = require('../lib/db');
var teacherModel  = require('../models/teacherModel');
var queryteachers = "SELECT teachers.*,levels.Level_Label,classes.Classe_Label FROM teachers INNER JOIN teachersclasses ON teachersclasses.teacher_ID = teachers.teacher_ID INNER JOIN classes ON teachersclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE teachersclasses.Classe_ID = ? AND teachersclasses.AY_ID = ? AND teachers.teacher_Status <>'0';"
var queryAllteachers = "SELECT teachers.*,levels.Level_Label,classes.Classe_Label FROM teachers INNER JOIN teachersclasses ON teachersclasses.teacher_ID = teachers.teacher_ID INNER JOIN classes ON teachersclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE teachersclasses.AY_ID = ?  AND teachers.teacher_Status <>'0';"
var querySearch = "SELECT teachers.*,levels.Level_Label,classes.Classe_Label FROM teachers INNER JOIN teachersclasses ON teachersclasses.teacher_ID = teachers.teacher_ID INNER JOIN classes ON teachersclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE (teachersclasses.Classe_ID = ? OR teachers.teacher_FirstName LIKE ?) AND teachersclasses.AY_ID = ?;"
var queryParents = "SELECT parents.* FROM parents INNER JOIN teachersparents ON teachersparents.Parent_ID = parents.Parent_ID INNER JOIN teachers ON teachersparents.teacher_ID = teachers.teacher_ID WHERE teachers.teacher_ID = ?;"
var querySubteacher = "SELECT levelexpenses.Expense_Cost,expenses.Expense_Label,expenses.Expense_PaymentMethod FROM teachers INNER JOIN teachersubscribtion ON teachers.teacher_ID = teachersubscribtion.teacher_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = teachersubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID WHERE teachers.teacher_ID = ?;"
var queryAllSub = "SELECT expenses.*,levelexpenses.Expense_Cost,classes.Classe_Label FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID INNER JOIN classes ON classes.Level_ID = levelexpenses.Level_ID WHERE levelexpenses.AY_ID = ?"
var querySubclasse = "SELECT levelexpenses.Expense_Cost,expenses.Expense_Label,expenses.Expense_PaymentMethod FROM classes INNER JOIN levels ON levels.Level_ID = classes.Level_ID INNER JOIN levelexpenses ON levelexpenses.Level_ID = levels.Level_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID WHERE classes.Classe_ID = ? AND classes.AY_ID = ?"
var querySubscriptions = "SELECT expenses.*,levelexpenses.Expense_Cost,levelexpenses.LE_ID FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID WHERE levelexpenses.Level_ID = ? AND levelexpenses.AY_ID = ?;"
var teacherQuery = 'INSERT INTO users(User_Name, User_Image, User_Email,User_Birthdate, User_Phone,User_Address,User_Role) VALUES(?,?,?,?,?,?,?)';
var absenceQuery = `INSERT INTO absencesanddelays(User_ID,  User_Type,  AD_Type,  AD_FromTo, AD_Date,AD_Status, Declaredby_ID) VALUES(?,?,?,?,?,1,?)`;
var scQuery = `INSERT INTO teachersclasses(teacher_ID, Classe_ID, AY_ID) VALUES(?,?,?)`;
var queryAttitude = 'SELECT * FROM `attitude` WHERE `teacher_ID` = ? AND Attitude_Status <> 0';
var homeworkQuery = 'SELECT homeworks.*,subjects.Subject_Label,subjects.Subject_Color,classes.Classe_Label FROM `teachers` INNER JOIN teachersclasses On teachersclasses.teacher_ID = teachers.teacher_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = teachersclasses.Classe_ID INNER JOIN homeworks ON homeworks.TSC_ID = teachersubjectsclasses.TSC_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersclasses.Classe_ID WHERE teachers.teacher_ID = ? AND homeworks.Homework_Status <>0';
var examsQuery = 'SELECT exams.*,subjects.Subject_Label,subjects.Subject_Color,classes.Classe_Label,grads.Exam_Score FROM `teachers` INNER JOIN teachersclasses On teachersclasses.teacher_ID = teachers.teacher_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = teachersclasses.Classe_ID INNER JOIN exams ON exams.TSC_ID = teachersubjectsclasses.TSC_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersclasses.Classe_ID LEFT JOIN grads ON grads.teacher_ID = teachers.teacher_ID WHERE teachers.teacher_ID = ? AND exams.Exam_Status <> 0';
var adddate = 1;
var classeID;
//SELECT teachers.*,levels.Level_Label FROM teachers INNER JOIN teachersclasses ON teachersclasses.teacher_ID = teachers.teacher_ID INNER JOIN teachersubscribtion ON teachersubscribtion.teacher_ID = teachersclasses.teacher_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = teachersubscribtion.LE_ID INNER JOIN levels ON levels.Level_ID = levelexpenses.Level_ID WHERE teachersclasses.Classe_ID = ? AND teachersclasses.AY_ID = ?;
const addMonths = (date, months) => {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

var teacherController = {
  teacherView: function(req, res, next) {
      connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
        connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
          connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
            connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
              connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                connection.query("SELECT subjects.*,levelsubjects.Level_ID FROM subjects INNER JOIN levelsubjects ON levelsubjects.Subject_ID = subjects.Subject_ID WHERE levelsubjects.AY_ID = ?", [academic[0].AY_ID], (err, subjects, fields) => {
                  console.log("Subjects::",subjects);
                  res.render('teacher', { title: 'Teachers' , user: user[0], institution:institutions[0], classes:classes,levels:levels,subjects});
                })
              })
            })
          })
        })
      })
  },
  getTeacher: function(req, res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
       connection.query("SELECT * FROM `absencesanddelays` WHERE User_ID = ? AND Declaredby_ID = ? AND AD_Status <> 0", [req.query.id,req.userId], (err, absences, fields) => {
        connection.query("SELECT DISTINCT subjects.Subject_Label FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE users.User_ID = ? AND institutionsusers.Institution_ID = ? AND institutionsusers.User_Role = 'Teacher'", [req.query.id,institutions[0].Institution_ID],async (err, subjects, fields) => {
          connection.query("SELECT DISTINCT subjects.Subject_Label,classes.Classe_Label FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID WHERE users.User_ID = ? AND institutionsusers.Institution_ID = ? AND institutionsusers.User_Role = 'Teacher'", [req.query.id,institutions[0].Institution_ID],async (err, classes, fields) => {
            res.json({
                    subjects:subjects,
                    absences:absences,
                    classes:classes
                  });
           })
        })
      })
    })
  },
  getClasses: function(req, res, next) {
      connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
        connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {   
            connection.query("SELECT classes.*,levels.Level_Label FROM `classes` INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE classes.Level_ID = ? AND classes.AY_ID = ?", [req.query.level_id,academic[0].AY_ID], (err, classes, fields) => {
                res.json({
                      classes:classes,
                    });
             })
        })
    })
  },
  getAllteachers: function(req, res, next) {
    var teachersArray = [];
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
      connection.query("SELECT users.* FROM `institutionsusers` INNER JOIN users ON users.User_ID = institutionsusers.User_ID WHERE institutionsusers.`Institution_ID` = ? AND institutionsusers.User_Role = 'Teacher'", [institutions[0].Institution_ID],async (err, teachers, fields) => {
        for (var i = teachers.length - 1; i >= 0; i--) {  
          var classes = await teacherModel.findClasses(teachers[i].User_ID);
          teachersArray.push({teacher:teachers[i],classes:classes});
        }
        res.json({
                teachers:teachersArray,
              });
       })
    })
  },  
  saveTeacher: function(req, res, next) {
    console.log(req.body);
   connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
          connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
            connection.query(teacherQuery, [JSON.stringify({first_name:req.body.first_name, last_name:req.body.last_name}), req.body.profile_image,req.body.email,  req.body.birthdate,  req.body.phone_number,req.body.teacher_address,"Teacher"], (err, teacher, fields) => {
               if (err) {
                    console.log(err);
                      res.json({
                        errors: [{
                        field: "Access denied",
                        errorDesc: "Save teacher Error"
                      }]});
                } else 
                {
                  connection.query("INSERT INTO `institutionsusers`(`Institution_ID`, `User_ID`, `User_Role`) VALUES (?,?,?)",[institutions[0].Institution_ID,teacher.insertId,"Teacher"])
                  for (var i = req.body.subjects.length - 1; i >= 0; i--) {
                    for (var j =  req.body.subjects[i].classes.length - 1; j >= 0; j--) {
                       connection.query("INSERT INTO `teachersubjectsclasses`( `Teacher_ID`, `Subject_ID`, `Classe_ID`, `AY_ID`) VALUES (?,?,?,?)",[teacher.insertId,req.body.subjects[i].subject,req.body.subjects[i].classes[j],academic[0].AY_ID]);
                    }
                  }
                  res.json({saved:true})
                }
            })
        })
    })                    
  },
  saveAbsence: function(req, res, next) {
           connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
                  connection.query(absenceQuery, [req.body.user_id,  "teacher",  req.body.ad_type,  req.body.ad_fromto, req.body.ad_date, req.userId], (err, absence, fields) => {
                     if (err) {
                          console.log(err);
                            res.json({
                              errors: [{
                              field: "Access denied",
                              errorDesc: "List teachers Error"
                            }]});
                        } else 
                        {
                          res.json({saved : true,id:absence.insertId});
                        }
                   })
            })
          })
  },
  deleteAbsence: function(req, res, next) {
    connection.query("UPDATE `absencesanddelays` SET  `AD_Status`=0 WHERE `AD_ID` = ?", [req.body.id], (err, teacher, fields) => {
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
  deleteteacher: function(req, res, next) {
    connection.query("UPDATE `teachers` SET `teacher_Status`=0 WHERE `teacher_ID` = ?", [req.body.id], (err, teacher, fields) => {
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
  updateteacher: function(req, res, next) {
    console.log(req.body)
    connection.query("UPDATE `teachers` SET `teacher_FirstName`=?,`teacher_LastName`=?,`teacher_Image`=?,`teacher_birthdate`=?,`teacher_Address`=?,`teacher_Phone`=? WHERE teacher_ID = ?", [req.body.teacher_fname,req.body.teacher_lname,req.body.teacher_img,req.body.teacher_birthdat,req.body.teacher_address,req.body.teacher_phone,req.body.id], (err, teacher, fields) => {
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

module.exports = teacherController;