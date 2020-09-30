var connection  = require('../lib/db');
var setupModel  = require('../models/setupModel');
var queryStudents = "SELECT students.* FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID WHERE studentsclasses.Classe_ID = ? AND studentsclasses.AY_ID = ?;"
var querySubscriptions = "SELECT expenses.*,levelexpenses.Expense_Cost,levelexpenses.LE_ID FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID WHERE levelexpenses.Level_ID = ? AND levelexpenses.AY_ID = ?;"
var studentQuery = `INSERT INTO students(Student_FirstName,  Student_LastName, Student_Image,  Student_birthdate,  Student_Address,  Student_Phone, Institution_ID) VALUES(?,?,?,?,?,?,?)`;
var parentQuery = `INSERT INTO parents(Parent_Name,  Parent_Phone, Institution_ID) VALUES(?,?,?)`;
var spQuery = `INSERT INTO studentsparents(Student_ID, Parent_ID) VALUES(?,?)`;
var ssQuery = `INSERT INTO studentsubscribtion(Student_ID, LE_ID, Subscription_StartDate, Subscription_EndDate, AY_ID) VALUES(?,?,?,?,?)`;
var scQuery = `INSERT INTO studentsclasses(Student_ID, Classe_ID, AY_ID) VALUES(?,?,?)`;
var adddate = 1;
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
        connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
          connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
            connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
              connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                res.render('student', { title: 'Students' , user: user[0], institution:institutions[0], classes:classes,levels:levels});
              })
            })
          })
        })
      })
  },
  getStudents: function(req, res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
      connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
          connection.query("SELECT Classe_ID FROM `classes` WHERE `Classe_Label` = ? LIMIT 1", [req.query.classe_label], (err, classe, fields) => {
            connection.query(queryStudents, [classe[0].Classe_ID,academic[0].AY_ID], (err, students, fields) => {
              console.log(classe[0].Classe_ID);
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
                        students:students
                      });
                  }
             })
          })
      })
    })
  },
  getSubscriptions: function(req, res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
      connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
          connection.query("SELECT Level_ID FROM `levels` WHERE `Level_Label` = ? LIMIT 1", [req.query.level_label], (err, level, fields) => {
            connection.query(querySubscriptions, [academic[0].AY_ID,level[0].Level_ID], (err, subscriptions, fields) => {
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
                        subscriptions:subscriptions
                      });
                  }
             })
          })
      })
    })
  },
  saveStudent: function(req, res, next) {
     connection.query("SELECT * FROM `students` WHERE `Student_FirstName` = ? AND `Student_LastName` = ?", [req.body.first_name,  req.body.last_name], (err, user, fields) => {
        if(user.length === 0)
        {
           connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
                  connection.query(studentQuery, [req.body.first_name,  req.body.last_name, req.body.profile_image,  req.body.birthdate,  req.body.student_address,  req.body.phone_number,institutions[0].Institution_ID], (err, student, fields) => {
                     if (err) {
                          console.log(err);
                            res.json({
                              errors: [{
                              field: "Access denied",
                              errorDesc: "List Students Error"
                            }]});
                        } else 
                        {
                           console.log("Student",student.insertId);
                           for (var i = req.body.parent_name.length - 1; i >= 0; i--) {
                             
                            connection.query(parentQuery, [req.body.parent_name[i],req.body.parent_phone[i],institutions[0].Institution_ID], (err, parent, fields) => {
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

                                   connection.query(spQuery, [parent.insertId,student.insertId], (err, spresult, fields) => {
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

                           
                           for (var i = req.body.checkbox_sub.length - 1; i >= 0; i--) {
                              if (req.body.checkbox_sub[i].Expense_PaymentMethod === "Monthly")
                                adddate = 1
                              else
                                adddate = 12;
                              var startDate = new Date();
                              var endDate = addMonths(new Date(),adddate);
                              connection.query(ssQuery, [student.insertId,req.body.checkbox_sub[i].LE_ID,startDate,endDate,academic[0].AY_ID], (err, ssresult, fields) => {
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
                            connection.query("SELECT Classe_ID FROM `classes` WHERE `Classe_Label` = ? LIMIT 1", [req.body.classe], (err, classe, fields) => {
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
          res.json({saved : true});
        } else
          res.json({saved : false});
        });
  },
};

module.exports = studentController;