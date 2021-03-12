var connection  = require('../lib/db');
var queryAllStudents = "SELECT students.*,levels.Level_Label,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.AY_ID = ?  AND students.Student_Status ='1' ORDER BY students.Student_FirstName;"
var queryAllSub = "SELECT expenses.*,levelexpenses.Expense_Cost,studentsubscribtion.Student_ID,studentsubscribtion.* FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID INNER JOIN studentsubscribtion ON studentsubscribtion.LE_ID = levelexpenses.LE_ID WHERE studentsubscribtion.AY_ID = ? AND ( studentsubscribtion.SS_Status = 0 OR studentsubscribtion.SS_Status = 1) ";
var paymentsQuery = "SELECT studentsubscribtion.SS_ID,studentsubscribtion.Student_ID,studentsubscribtion.Subscription_StartDate,expenses.Expense_PaymentMethod,expenses.Expense_Label,studentspayments.*,levelexpenses.Expense_Cost FROM `studentsubscribtion` INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID WHERE studentsubscribtion.AY_ID = ?"

const queryStudent = "SELECT students.*,levels.Level_Label,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.AY_ID = ?  AND students.Student_Status ='1' and students.Student_ID = ? ORDER BY students.Student_FirstName;"

const queryStudentSubs = "SELECT expenses.*,levelexpenses.Expense_Cost,studentsubscribtion.Student_ID,studentsubscribtion.* FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID INNER JOIN studentsubscribtion ON studentsubscribtion.LE_ID = levelexpenses.LE_ID WHERE studentsubscribtion.AY_ID = ? AND ( studentsubscribtion.SS_Status = 0 OR studentsubscribtion.SS_Status = 1) AND studentsubscribtion.Student_ID=?;"

const queryStudentPayments = "SELECT studentsubscribtion.SS_ID,studentsubscribtion.Student_ID,studentsubscribtion.Subscription_StartDate,expenses.Expense_PaymentMethod,expenses.Expense_Label,studentspayments.*,levelexpenses.Expense_Cost FROM `studentsubscribtion` INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID WHERE studentsubscribtion.AY_ID = ? AND studentsubscribtion.Student_ID = ?"

var financeController = {
   financeView: function(req, res, next) {
    connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'", [req.userId], (err, accounts, fields) => {
        connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status = 1 ", [req.Institution_ID,req.userId], (err, users, fields) => {                
          connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
              connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
                connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                  connection.query("SELECT * FROM `expenses` WHERE AY_ID = ?", [academic[0].AY_ID], (err, expenses, fields) => {
                    res.render('finance', { title: 'Finance' , user: user[0], institution:institutions[0], classes:classes,levels:levels,accounts,users,expenses,role:req.role});
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
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query(queryAllStudents, [academic[0].AY_ID], (err, students, fields) => {
          connection.query(queryAllSub, [academic[0].AY_ID], (err, subscription, fields) => {
            connection.query(paymentsQuery, [academic[0].AY_ID], (err, payments, fields) => {
              res.json({
                    students:students,
                    subscription:subscription,
                    payments:payments,
                    start:academic[0].AY_Satrtdate,
                    end:academic[0].AY_EndDate,
                    academicyear:academic[0].AY_Label
                  });
              })
           })
       })
    })
  },  
  getStudentFinances: function (req, res, next) {
    console.log("student id is", req.query.studentId);
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query(queryStudent, [academic[0].AY_ID, req.query.studentId], (err, students, fields) => {
          connection.query(queryStudentSubs, [academic[0].AY_ID, req.query.studentId], (err, subscription, fields) => {
            connection.query(queryStudentPayments, [academic[0].AY_ID, req.query.studentId], (err, payments, fields) => {
              res.json({
                    students:students,
                    subscription:subscription,
                    payments:payments,
                    start:academic[0].AY_Satrtdate,
                    end:academic[0].AY_EndDate,
                    academicyear:academic[0].AY_Label
                  });
              })
           })
       })
    }) 
  }
};

module.exports = financeController;