var connection  = require('../lib/db');
var date = new Date();

var dashboardController = {
  dashboardView:function(req, res, next) {
    connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'", [req.userId], (err, accounts, fields) => {
        connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ?", [req.Institution_ID,req.userId], (err, users, fields) => {                
          connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
              connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
                connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                  connection.query("SELECT * FROM `expenses` WHERE AY_ID = ?", [academic[0].AY_ID], (err, expenses, fields) => {
                    connection.query("SELECT COUNT(DISTINCT absencesanddelays.User_ID) as total FROM `absencesanddelays` INNER JOIN institutionsusers ON institutionsusers.User_ID = absencesanddelays.User_ID WHERE MONTH( absencesanddelays.`AD_Addeddate` ) = ? AND absencesanddelays.User_Type = 'teacher'AND institutionsusers.Institution_ID = ?", [(date.getMonth() + 1),req.Institution_ID], (err, teacherAD, fields) => {
                      connection.query("SELECT COUNT(DISTINCT absencesanddelays.User_ID) as total FROM `absencesanddelays` INNER JOIN institutionsusers ON institutionsusers.User_ID = absencesanddelays.User_ID WHERE MONTH( absencesanddelays.`AD_Addeddate` ) = ? AND absencesanddelays.User_Type = 'Student'AND institutionsusers.Institution_ID = ?", [(date.getMonth() + 1),req.Institution_ID], (err, studentAD, fields) => {
                        connection.query("SELECT COUNT(*) as total FROM `institutionsusers` WHERE `Institution_ID`=? AND `User_Role`='Teacher'", [req.Institution_ID], (err, percentageT, fields) => {
                          connection.query("SELECT COUNT(*) as total FROM `students` WHERE `Institution_ID`=? ", [req.Institution_ID], (err, percentageS, fields) => {
                            connection.query("SELECT SUM(levelexpenses.Expense_Cost) as total FROM `studentspayments` INNER JOIN studentsubscribtion ON studentsubscribtion.SS_ID = studentspayments.SS_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID WHERE MONTH( studentspayments.`SP_Addeddate` ) = ? AND studentsubscribtion.AY_ID = ?", [date.getMonth() + 1,academic[0].AY_ID], (err, totalPay, fields) => {
                              connection.query("SELECT SUM(levelexpenses.Expense_Cost) as total FROM `studentspayments` INNER JOIN studentsubscribtion ON studentsubscribtion.SS_ID = studentspayments.SS_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID WHERE studentsubscribtion.AY_ID = ?", [academic[0].AY_ID], (err, percentagePay, fields) => {
                                res.render('dashboard', { 
                                  title: 'Dashboard' , 
                                  user: user[0], 
                                  institution:institutions[0], 
                                  classes:classes,levels:levels,
                                  accounts,users,expenses,
                                  role:req.role,
                                  teacherAD:teacherAD[0].total,
                                  studentAD:studentAD[0].total,
                                  totalPay:totalPay[0].total,
                                  percentageT:(teacherAD[0].total * 100)/percentageT[0].total ,
                                  percentageS:(studentAD[0].total * 100)/percentageS[0].total ,
                                  percentagePay:(totalPay[0].total * 100)/percentagePay[0].total
                                });
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
          })
        })
      })
    })
  },
};

module.exports = dashboardController;