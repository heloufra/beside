var connection  = require('../lib/db');
var setupModel  = require('../models/setupModel');
var studentModel  = require('../models/studentModel');
var queryStudents = "SELECT students.*,levels.Level_Label,classes.Classe_Label FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.Classe_ID = ? AND studentsclasses.AY_ID = ? AND students.Student_Status <>'0';"
var queryAllStudents = "SELECT students.*,levels.Level_Label,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.AY_ID = ?  AND students.Student_Status <>'0';"
var querySearch = "SELECT students.*,levels.Level_Label,classes.Classe_Label FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE (studentsclasses.Classe_ID = ? OR students.Student_FirstName LIKE ?) AND studentsclasses.AY_ID = ?;"
var queryParents = "SELECT parents.* FROM parents INNER JOIN studentsparents ON studentsparents.Parent_ID = parents.Parent_ID INNER JOIN students ON studentsparents.Student_ID = students.Student_ID WHERE students.Student_ID = ?;"
var querySubstudent = "SELECT levelexpenses.Expense_Cost,expenses.Expense_Label,expenses.Expense_PaymentMethod,studentsubscribtion.SS_ID FROM students INNER JOIN studentsubscribtion ON students.Student_ID = studentsubscribtion.Student_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID INNER JOIN academicyear ON academicyear.Institution_ID = students.Institution_ID WHERE students.Student_ID = ? AND students.Institution_ID = ? AND studentsubscribtion.Subscription_EndDate = academicyear.AY_EndDate"
var querySubstudentPay = "SELECT levelexpenses.Expense_Cost,expenses.Expense_Label,expenses.Expense_PaymentMethod,studentsubscribtion.* FROM students INNER JOIN studentsubscribtion ON students.Student_ID = studentsubscribtion.Student_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID INNER JOIN academicyear ON academicyear.Institution_ID = students.Institution_ID WHERE students.Student_ID = ? AND students.Institution_ID = ?"
var queryAllSub = "SELECT expenses.*,levelexpenses.Expense_Cost,levelexpenses.LE_ID,classes.Classe_Label FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID INNER JOIN classes ON classes.Level_ID = levelexpenses.Level_ID WHERE levelexpenses.AY_ID = ?"
var querySubclasse = "SELECT levelexpenses.Expense_Cost,expenses.Expense_Label,expenses.Expense_PaymentMethod FROM classes INNER JOIN levels ON levels.Level_ID = classes.Level_ID INNER JOIN levelexpenses ON levelexpenses.Level_ID = levels.Level_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID WHERE classes.Classe_ID = ? AND classes.AY_ID = ?"
var querySubscriptions = "SELECT expenses.*,levelexpenses.Expense_Cost,levelexpenses.LE_ID FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID WHERE levelexpenses.Level_ID = ? AND levelexpenses.AY_ID = ?;"
var studentQuery = `INSERT INTO students(Student_FirstName,  Student_LastName, Student_Image,  Student_birthdate,  Student_Address,  Student_Phone,Student_Status, Institution_ID) VALUES(?,?,?,?,?,?,1,?)`;
var absenceQuery = `INSERT INTO absencesanddelays(User_ID,  User_Type,  AD_Type,  AD_FromTo, AD_Date,AD_Status, Declaredby_ID) VALUES(?,?,?,?,?,1,?)`;
var paymentsQuery = `INSERT INTO studentspayments(SS_ID, SP_PaidPeriod) VALUES (?,?)`;
var attitudeQuery = `INSERT INTO attitude(Student_ID, Attitude_Interaction, Attitude_Note,Attitude_Addeddate,Attitude_Status, Declaredby_ID, AY_ID) VALUES(?,?,?,?,1,?,?)`;
var parentQuery = `INSERT INTO parents(Parent_Name,  Parent_Phone, Institution_ID) VALUES(?,?,?)`;
var spQuery = `INSERT INTO studentsparents(Student_ID, Parent_ID) VALUES(?,?)`; 
var ssQuery = `INSERT INTO studentsubscribtion(Student_ID, LE_ID, Subscription_StartDate, Subscription_EndDate, AY_ID) VALUES(?,?,?,?,?)`;
var scQuery = `INSERT INTO studentsclasses(Student_ID, Classe_ID, AY_ID) VALUES(?,?,?)`;
var queryAttitude = 'SELECT * FROM `attitude` WHERE `Student_ID` = ? AND Attitude_Status <> 0';
var homeworkQuery = 'SELECT homeworks.*,subjects.Subject_Label,subjects.Subject_Color,classes.Classe_Label FROM `students` INNER JOIN studentsclasses On studentsclasses.Student_ID = students.Student_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = studentsclasses.Classe_ID INNER JOIN homeworks ON homeworks.TSC_ID = teachersubjectsclasses.TSC_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID WHERE students.Student_ID = ? AND homeworks.Homework_Status <>0';
var examsQuery = 'SELECT exams.*,subjects.Subject_Label,subjects.Subject_Color,classes.Classe_Label,grads.Exam_Score FROM `students` INNER JOIN studentsclasses On studentsclasses.Student_ID = students.Student_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = studentsclasses.Classe_ID INNER JOIN exams ON exams.TSC_ID = teachersubjectsclasses.TSC_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID LEFT JOIN grads ON grads.Student_ID = students.Student_ID AND  grads.Exam_ID = exams.Exam_ID WHERE students.Student_ID = ? AND exams.Exam_Status <> 0';
var studentPayment = "SELECT studentsubscribtion.SS_ID,expenses.Expense_PaymentMethod,expenses.Expense_Label,studentspayments.*,levelexpenses.Expense_Cost FROM `studentsubscribtion` INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID WHERE studentsubscribtion.Student_ID = ?";
var adddate = 1;
var classeID;
//SELECT students.*,levels.Level_Label FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN studentsubscribtion ON studentsubscribtion.Student_ID = studentsclasses.Student_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN levels ON levels.Level_ID = levelexpenses.Level_ID WHERE studentsclasses.Classe_ID = ? AND studentsclasses.AY_ID = ?;
const addMonths = (date, months) => {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

var studentController = {
  studentView: function(req, res, next) {
    connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'", [req.userId], (err, accounts, fields) => {
        connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ?", [req.Institution_ID,req.userId], (err, users, fields) => {                
          connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
              connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
                connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                  res.render('student', { title: 'Students' , user: user[0], institution:institutions[0], classes:classes,levels:levels,accounts,users});
                })
              })
            })
          })
        })
      })
    })
  },
  getStudent: function(req, res, next) {
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
    connection.query(queryParents, [req.query.user_id], (err, parents, fields) => {
      connection.query("SELECT * FROM `absencesanddelays` WHERE User_ID = ? AND Declaredby_ID = ? AND AD_Status <> 0", [req.query.user_id,req.userId], (err, absences, fields) => {
          connection.query(queryAttitude, [req.query.user_id], (err, attitudes, fields) => {
            connection.query(querySubstudent, [req.query.user_id,req.Institution_ID], (err, substudent, fields) => {
              connection.query(querySubstudentPay, [req.query.user_id,req.Institution_ID], (err, substudentpay, fields) => {
                connection.query(homeworkQuery, [req.query.user_id], (err, homeworks, fields) => {
                  connection.query(examsQuery, [req.query.user_id], (err, exams, fields) => {
                    connection.query(studentPayment, [req.query.user_id], (err, payStudent, fields) => {
                      connection.query("SELECT AVG(grads.Exam_Score) as average FROM `students` INNER JOIN studentsclasses On studentsclasses.Student_ID = students.Student_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = studentsclasses.Classe_ID INNER JOIN exams ON exams.TSC_ID = teachersubjectsclasses.TSC_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID LEFT JOIN grads ON grads.Student_ID = students.Student_ID AND  grads.Exam_ID = exams.Exam_ID WHERE students.Student_ID = ? AND exams.Exam_Status <> 0", [req.query.user_id], (err, grade, fields) => {
                       if (err) {
                            console.log(err);
                              res.json({
                                errors: [{
                                field: "Access denied",
                                errorDesc: "List Students Error"
                              }]});
                          } else 
                          {
                             res.json({
                                parents:parents,
                                substudent:substudent,
                                substudentpay:substudentpay,
                                absences:absences,
                                attitudes:attitudes,
                                homeworks:homeworks,
                                exams:exams,
                                start:academic[0].AY_Satrtdate,
                                end:academic[0].AY_EndDate,
                                academicyear:academic[0].AY_Label,
                                average:grade[0].average,
                                payStudent:payStudent
                              });
                          }
                      })
                    })
                   })
                  })
               })
              })
          })
        })
     })
    })
  },  
  getAllStudents: function(req, res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
      connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
            connection.query(queryAllStudents, [academic[0].AY_ID], (err, students, fields) => {
                connection.query(queryAllSub, [academic[0].AY_ID], (err, subscription, fields) => {
                    res.json({
                          students:students,
                          subscription:subscription
                        });
                 })
             })
      })
    })
  },  
  getSubscriptions: function(req, res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
      connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
          connection.query("SELECT Level_ID FROM `levels` WHERE `Level_Label` = ? AND AY_ID = ? LIMIT 1", [req.query.level_label,academic[0].AY_ID], (err, level, fields) => {
            connection.query("SELECT * FROM `classes` WHERE `Level_ID` = ?", [level[0].Level_ID], (err, classes, fields) => {
              connection.query(querySubscriptions, [level[0].Level_ID,academic[0].AY_ID], (err, subscriptions, fields) => {
                 if (err) {
                      console.log(err);
                        res.json({
                          errors: [{
                          field: "Access denied",
                          errorDesc: "List Students Error"
                        }]});
                    } else 
                    {
                       res.json({
                          subscriptions:subscriptions,
                          classes:classes
                        });
                    }
               })
            })
          })
      })
    })
  },
  saveStudent: function(req, res, next) {
     connection.query("SELECT * FROM `students` WHERE `Student_FirstName` = ? AND `Student_LastName` = ? AND Student_Status <> '0'", [req.body.first_name,  req.body.last_name], (err, user, fields) => {
        if(user.length === 0)
        {
           connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
            connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
                  connection.query(studentQuery, [req.body.first_name,  req.body.last_name, req.body.profile_image,  req.body.birthdate,  req.body.student_address,  req.body.phone_number,req.Institution_ID], (err, student, fields) => {
                     if (err) {
                          console.log(err);
                            res.json({
                              errors: [{
                              field: "Access denied",
                              errorDesc: "List Students Error"
                            }]});
                        } else 
                        {
                          res.json({saved : true,user_id:student.insertId});
                           console.log("Student",student.insertId);
                           for (var i = req.body.parent_name.length - 1; i >= 0; i--) {
                             
                            connection.query(parentQuery, [req.body.parent_name[i],req.body.parent_phone[i],req.Institution_ID], (err, parent, fields) => {
                             if (err) {
                                  console.log(err);
                                    res.json({
                                      errors: [{
                                      field: "Access denied",
                                      errorDesc: "List Students Error"
                                    }]});
                                } else 
                                {
                                   console.log("PArent",parent.insertId)

                                   connection.query(spQuery, [student.insertId,parent.insertId], (err, spresult, fields) => {
                                     if (err) {
                                          console.log(err);
                                            res.json({
                                              errors: [{
                                              field: "Access denied",
                                              errorDesc: "List Students Error"
                                            }]});
                                        } else 
                                        {
                                           console.log("SP",spresult.insertId)
                                           
                                        }
                                    })
                                   
                                }
                            })
                           }

                           if (req.body.checkbox_sub)
                             for (var i = req.body.checkbox_sub.length - 1; i >= 0; i--) {
                                var startDate = new Date();
                                var endDate = addMonths(new Date(),12);
                                connection.query(ssQuery, [student.insertId,req.body.checkbox_sub[i].LE_ID,academic[0].AY_Satrtdate,academic[0].AY_EndDate,academic[0].AY_ID], (err, ssresult, fields) => {
                                   if (err) {
                                        console.log(err);
                                          res.json({
                                            errors: [{
                                            field: "Access denied",
                                            errorDesc: "List Students Error"
                                          }]});
                                      } else 
                                      {
                                         console.log("SS",ssresult.insertId)
                                         
                                      }
                                  })
                             }
                            connection.query("SELECT Classe_ID FROM `classes` WHERE `Classe_Label` = ? AND AY_ID = ? LIMIT 1", [req.body.classe,academic[0].AY_ID], (err, classe, fields) => {
                              connection.query(scQuery, [student.insertId,classe[0].Classe_ID,academic[0].AY_ID], (err, scresult, fields) => {
                                 if (err) {
                                      console.log(err);
                                        res.json({
                                          errors: [{
                                          field: "Access denied",
                                          errorDesc: "List Students Error"
                                        }]});
                                    } else 
                                    {
                                       console.log("Sc Result",scresult.insertId)
                                       
                                    }
                                })
                            })
                        }
                   })
            })
          })
        } else
          res.json({saved : false});
        });
  },
  saveAbsence: function(req, res, next) {
           connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
                  connection.query(absenceQuery, [req.body.user_id,  "Student",  req.body.ad_type,  req.body.ad_fromto, req.body.ad_date, req.userId], (err, absence, fields) => {
                     if (err) {
                          console.log(err);
                            res.json({
                              errors: [{
                              field: "Access denied",
                              errorDesc: "List Students Error"
                            }]});
                        } else 
                        {
                          res.json({saved : true,id:absence.insertId});
                        }
                   })
            })
          })
  },
  savePayments: function(req, res, next) {
    for (var i = req.body.payments.length - 1; i >= 0; i--) {
      if (req.body.payments[i].period)
        for (var j = req.body.payments[i].period.length - 1; j >= 0; j--) {
          connection.query(paymentsQuery, [req.body.payments[i].ssid, req.body.payments[i].period[j]]);
        }
    }
    res.json({saved : true});
  },
  saveAttitude: function(req, res, next) {
    //Student_ID, Attitude_Interaction, Attitude_Note, Declaredby_ID, AY_ID
     connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
                  connection.query(attitudeQuery, [req.body.user_id,  req.body.at_type,  req.body.at_note, req.body.at_date, req.userId,academic[0].AY_ID], (err, attitude, fields) => {
                     if (err) {
                          console.log(err);
                            res.json({
                              errors: [{
                              field: "Access denied",
                              errorDesc: "List Students Error"
                            }]});
                        } else 
                        {
                          res.json({saved : true,id:attitude.insertId});
                        }
                   })
            })
          })
  },
  deleteAttitude: function(req, res, next) {
    connection.query("UPDATE  `attitude` SET Attitude_Status = 0 WHERE `Attitude_ID` = ?", [req.body.id], (err, student, fields) => {
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
  deleteAbsence: function(req, res, next) {
    connection.query("UPDATE `absencesanddelays` SET  `AD_Status`=0 WHERE `AD_ID` = ?", [req.body.id], (err, student, fields) => {
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
  deleteStudent: function(req, res, next) {
    connection.query("UPDATE `students` SET `Student_Status`=0 WHERE `Student_ID` = ?", [req.body.id], (err, student, fields) => {
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
  updateStudent: function(req, res, next) {
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query("UPDATE `students` SET `Student_FirstName`=?,`Student_LastName`=?,`Student_Image`=?,`Student_birthdate`=?,`Student_Address`=?,`Student_Phone`=? WHERE Student_ID = ?", [req.body.student_fname,req.body.student_lname,req.body.student_img,req.body.student_birthdat,req.body.student_address,req.body.student_phone,req.body.id],async (err, student, fields) => {
         if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "Cannot Remove it"
                }]});
            } else 
            {
              connection.query("UPDATE `studentsclasses` SET `Classe_ID`=? WHERE `Student_ID` = ?", [req.body.student_classe,req.body.id]);
              for (var i = req.body.parent_name.length - 1; i >= 0; i--) {
                if (req.body.parent_name[i].id === 'null')
                {
                  connection.query(parentQuery, [req.body.parent_name[i].name,req.body.parent_phone[i].phone,req.Institution_ID], (err, parent, fields) => {
                     if (err) {
                          console.log(err);
                            res.json({
                              errors: [{
                              field: "Access denied",
                              errorDesc: "List Students Error"
                            }]});
                        } else 
                          {
                           connection.query(spQuery, [req.body.id,parent.insertId], (err, spresult, fields) => {
                             if (err) {
                                  console.log(err);
                                    res.json({
                                      errors: [{
                                      field: "Access denied",
                                      errorDesc: "List Students Error"
                                    }]});
                                } else 
                                {

                                }
                            })
                           
                        }
                      })
                }
                else
                  connection.query("UPDATE `parents` SET  Parent_Name = ?,Parent_Phone= ? WHERE `Parent_ID` = ?", [req.body.parent_name[i].name,req.body.parent_phone[i].phone,req.body.parent_name[i].id])
              }
              if (req.body.unchecked)
                for (var i = req.body.unchecked.length - 1; i >= 0; i--) {
                  connection.query("UPDATE `studentsubscribtion` SET `Subscription_EndDate`=? WHERE `LE_ID` = ?", [new Date(),req.body.unchecked[i]])
                }
              if (req.body.checked)
                for (var i = req.body.checked.length - 1; i >= 0; i--) {
                    var le_id = await studentModel.findLe(req.body.checked[i],req.body.id);
                    console.log("LEEE",le_id);
                    if (le_id.length === 0)
                    {
                      connection.query("INSERT INTO studentsubscribtion(Student_ID, LE_ID, Subscription_StartDate, Subscription_EndDate, AY_ID) VALUES(?,?,?,?,?)", [req.body.id,req.body.checked[i],academic[0].AY_Satrtdate,academic[0].AY_EndDate,academic[0].AY_ID])
                    } else 
                    {
                      connection.query("UPDATE `studentsubscribtion` SET Subscription_StartDate=? , `Subscription_EndDate`=? WHERE `LE_ID` = ?", [academic[0].AY_Satrtdate,academic[0].AY_EndDate,req.body.checked[i]])
                    }
                }
              res.json({updated : true});
            }
       })
    })
  },
  updateAttitude: function(req, res, next) {
    connection.query("UPDATE `attitude` SET  Attitude_Note = ?,Attitude_Addeddate= ? WHERE `Attitude_ID` = ?", [req.body.Attitude_Note,req.body.Attitude_Addeddate,req.body.id], (err, student, fields) => {
       if (err) {
            console.log(err);
              res.json({
                errors: [{
                field: "Access denied",
                errorDesc: "Cannot Update it"
              }]});
          } else 
          {
            res.json({updated : true});
          }
     })
  }, 
  updateAbsence: function(req, res, next) {
    connection.query("UPDATE `absencesanddelays` SET  AD_FromTo = ?, AD_Date = ? WHERE `AD_ID` = ?", [req.body.AD_FromTo,req.body.AD_Date,req.body.id], (err, absence, fields) => {
       if (err) {
            console.log(err);
              res.json({
                errors: [{
                field: "Access denied",
                errorDesc: "Cannot Update it"
              }]});
          } else 
          {
            res.json({updated : true});
          }
     })
  },
};

module.exports = studentController;