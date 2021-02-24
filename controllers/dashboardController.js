var connection  = require('../lib/db');
var date = new Date();
var commonModel  = require('../models/commonModel');

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];

var Total_Expense ='select SUM(le.Expense_Cost) as `total` from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) where ss.SS_Status = 1 and le.AY_ID = ? ';

var Total_Month_Paied_Expenses ='select SUM(le.Expense_Cost) as `total` from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) where ss.SS_Status = 1 And MONTH( sp.`SP_Addeddate` ) = ?  And le.AY_ID = ? ';


var PaymentsQuery = 'SELECT students.*,levelexpenses.Expense_Cost , studentspayments.SP_Addeddate,studentspayments.SP_PaidPeriod,classes.Classe_Label FROM `students` LEFT JOIN studentsubscribtion ON studentsubscribtion.Student_ID = students.Student_ID LEFT JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID LEFT JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID LEFT JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID  WHERE `Institution_ID`= ?'
var AdTeacher = "SELECT DISTINCT users.*, absencesanddelays.* FROM `absencesanddelays` LEFT JOIN users ON users.User_ID = absencesanddelays.User_ID LEFT JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID LEFT JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID WHERE institutionsusers.Institution_ID = ? AND absencesanddelays.User_Type ='teacher'";
var teacherModel  = require('../models/teacherModel');
var AdStudent = "SELECT absencesanddelays.*,students.*,classes.Classe_Label FROM `absencesanddelays` INNER JOIN students ON students.Student_ID = absencesanddelays.User_ID INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID WHERE absencesanddelays.User_Type = 'Student' AND students.Institution_ID = ? AND students.Student_Status<>0 AND absencesanddelays.AD_Status<>0";
var dashboardController = {
  dashboardView: async function(req, res, next) {
    connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], async (err, user, fields) => {
      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'", [req.userId], async (err, accounts, fields) => {
        connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status <> 0", [req.Institution_ID,req.userId], async (err, users, fields) => {                
          connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], async (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], async (err, academic, fields) => {

                  // Absence & deelay teacher 
                  const teacherAD = await commonModel.getAllTeachersAbsenceDelay(req.Institution_ID,academic[0].AY_ID);

                  console.log("teacherAD",teacherAD);

                  // Absence & deelay Students
                  const studentAD = await commonModel.getAllStudentsAbsenceDelay(req.Institution_ID , academic[0].AY_ID);
                  console.log("studentAD",studentAD);

                  connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, Allclasses, fields) => {
                    connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                      connection.query("SELECT * FROM `expenses` WHERE AY_ID = ?", [academic[0].AY_ID], (err, expenses, fields) => {
                          connection.query("SELECT COUNT(*) as total FROM `institutionsusers` WHERE `Institution_ID`=? AND `User_Role`='Teacher' and `IU_Status` = 1 ", [req.Institution_ID], (err, percentageT, fields) => {
                              connection.query("SELECT COUNT(*) as total FROM `students` WHERE `Institution_ID`=? And `student_Status` = 1 ", [req.Institution_ID], (err, percentageS, fields) => {
                                connection.query(Total_Month_Paied_Expenses, [date.getMonth() + 1,academic[0].AY_ID], (err, totalPay, fields) => {
                                  connection.query(Total_Expense, [academic[0].AY_ID], (err, percentagePay, fields) => {
                                      var  Total_Month_Expenses = ((percentagePay[0].total * 1) -  (totalPay[0].total*1)) ;
                                      res.render('dashboard', { 
                                        title:'Dashboard', 
                                        user:user[0], 
                                        institution:institutions[0], 
                                        classes:Allclasses,
                                        levels:levels,
                                        accounts,
                                        users,
                                        expenses,
                                        role:req.role,
                                        teacherAdAbsences:teacherAD.Total_Absences,
                                        teacherAdRetards:teacherAD.Total_Retards,
                                        studentAdAbsences:studentAD.Total_Absences,
                                        studentAdRetards:studentAD.Total_Retards,
                                        studentsTotal:percentageS[0].total,
                                        teachersTotal:percentageT[0].total,
                                        totalPay:totalPay[0].total,
                                        percentageT:(100 - ((teacherAD.Total_Absences + teacherAD.Total_Retards) * 100)/percentageT[0].total) ,
                                        percentageS:(100 - ((studentAD.Total_Absences + studentAD.Total_Retards) * 100)/percentageS[0].total) ,
                                        percentagePay: (totalPay[0].total * 100) / Total_Month_Expenses
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
  getAllAbsences:function(req, res, next) {
    var teachersArray = [];
    var studentArray = [];
    connection.query(AdTeacher, [req.Institution_ID], (err, absencesT, fields) => {
      connection.query(AdStudent, [req.Institution_ID],async (err, absencesS, fields) => {
         for (var i = absencesT.length - 1; i >= 0; i--) {  
            var classes = await teacherModel.findClasses(absencesT[i].User_ID);
            var reportedBy = await teacherModel.findUserById(absencesT[i].Declaredby_ID);
            teachersArray.push({teacher:absencesT[i],classes:classes,reportedBy:reportedBy[0]});
          }

          for (var i = absencesS.length - 1; i >= 0; i--) {  
            var reportedBy = await teacherModel.findUserById(absencesS[i].Declaredby_ID);
            studentArray.push({student:absencesS[i],reportedBy:reportedBy[0]});
          }
          res.json({
            absencesT:teachersArray,
            absencesS:studentArray,
          })
      })
    })
  },
  getAllPayments:function(req, res, next) {
    connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query(PaymentsQuery, [req.Institution_ID], (err, payments, fields) => {
       connection.query('SELECT ss.*,le.Expense_Cost,e.Expense_PaymentMethod FROM studentsubscribtion ss INNER JOIN levelexpenses le ON le.LE_ID = ss.LE_ID INNER JOIN expenses e ON e.Expense_ID = le.Expense_ID  WHERE ss.AY_ID=? AND ss.SS_Status=1', [academic[0].AY_ID], (err, studentsSub, fields) => {
          res.json({
            payments,
            studentsSub
          })
        })
      })
    })
  }
};

module.exports = dashboardController;