var connection  = require('../lib/db');


var setupModel = {
  saveLevels: function(Level_Label,AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO levels(Level_Label, AY_ID) VALUES(?,?)", [Level_Label,AY_ID], (err, levelResult, fields) => {
       if (err) reject(err);
        else resolve(levelResult);
      });
    })
  },
  saveSubjects: function(Subject_Label) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO subjects(Subject_Label) VALUES (?) ON DUPLICATE KEY UPDATE `Subject_Label` = `Subject_Label`; SELECT Subject_ID FROM subjects WHERE `Subject_Label` = ?", [Subject_Label,Subject_Label], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(subjectResult[0].insertId === 0 ? subjectResult[1][0].Subject_ID : subjectResult[0].insertId);
      });
    })
  },
  saveLevelsSubjects: function(Level_ID, Subject_ID, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO levelsubjects(Level_ID, Subject_ID, AY_ID) VALUES (?,?,?);", [Level_ID, Subject_ID, AY_ID], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(subjectResult);
      });
    })
  },
  saveExpenses: function(Expense_Label, Expense_PaymentMethod, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO expenses(Expense_Label, Expense_PaymentMethod, AY_ID) VALUES (?,?,?);", [Expense_Label, Expense_PaymentMethod, AY_ID], (err, expensesResult, fields) => {
       if (err) reject(err);
        else resolve(expensesResult);
      });
    })
  },
  saveLevelExpenses: function(Level_ID, Expense_ID, Expense_Cost, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO levelexpenses(Level_ID, Expense_ID, Expense_Cost, AY_ID) VALUES (?,?,?,?);", [Level_ID, Expense_ID, Expense_Cost, AY_ID], (err, expensesResult, fields) => {
       if (err) reject(err);
        else resolve(expensesResult);
      });
    })
  },
  findExpenseID: function(Expense_Label, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT Expense_ID FROM expenses WHERE Expense_Label = ? AND AY_ID = ?", [Expense_Label, AY_ID], (err, expensesResult, fields) => {
       if (err) reject(err);
        else resolve(expensesResult[0].Expense_ID);
      });
    })
  },
};

module.exports = setupModel;