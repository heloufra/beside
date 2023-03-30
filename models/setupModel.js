var connection  = require('../lib/db');


var getRandomColor = () => {

  $subjectColors = ["#d8e9ff","#d2ebdc","#e7d9ff","#f5caca","#f1e1c2","#d1f6fc","#f6f1bd",
          "#e4e0e0","#d4e8b2","#f6d6ad","#d3e2e9","#d5d0e5","#f8d3ec","#ebd2d2"];

  return $subjectColors[Math.floor(Math.random() * $subjectColors.length)];
  
}

var setupModel = {
  saveLevels: function(Level_Label,AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO levels(Level_Label, AY_ID) VALUES(?,?)", [Level_Label,AY_ID], (err, levelResult, fields) => {
       if (err) reject(err);
        else resolve(levelResult);
      });
    })
  },
  saveSubjects: function(Subject_Label,Institution_ID) {
     return new Promise((resolve, reject) => {
        connection.query("SELECT Count(Subject_ID) as 'Subject_Count' , Subject_ID From subjects where Subject_Label = ? and Institution_ID = ? ", [Subject_Label,Institution_ID], (err, subjectResultCount , fields) => {
            if (err) {
              console.log("err subjectResultCount ",err);
              reject(err);
            } 
            else 
            {

              console.log("start inserting");
              subjectResultsCount = JSON.parse(JSON.stringify(subjectResultCount));
              if(subjectResultsCount[0].Subject_Count == 0 ){
                  connection.query("INSERT INTO subjects(Subject_Label,Subject_Color,Institution_ID) VALUES (?,?,?) ; SELECT Subject_ID FROM subjects WHERE `Subject_Label` = ? ", [Subject_Label,getRandomColor(),Institution_ID,Subject_Label], (err, subjectResult, fields) => {
                     if (err) {
                        console.log("err new inserting ",err);
                        reject(err);
                     } else {
                        console.log("subjectResultCount",subjectResultsCount);
                        console.log("subjectResultCount[0].subjectResultCount",subjectResultsCount[0].Subject_Count);
                        console.log("Subject_Label",Subject_Label);
                        resolve(subjectResult[0].insertId === 0 ? subjectResult[1][0].Subject_ID : subjectResult[0].insertId);
                     }
                  });

              }else{
                   console.log("subjectResultCount",subjectResultsCount);
                   resolve(subjectResultsCount[0].Subject_ID);
              }
            }
        });
    });
  },
  saveLevelsSubjects: function(Level_ID, Subject_ID, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO levelsubjects(Level_ID, Subject_ID, AY_ID) VALUES (?,?,?);", [Level_ID, Subject_ID, AY_ID], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(subjectResult);
      });
    })
  },
  saveExpenses: function(Expense_Label, Expense_PaymentMethod, AY_ID , Color_Index) {
     return new Promise((resolve, reject) => {

      var $subjectColors = ["#d8e9ff","#d2ebdc","#e7d9ff","#f5caca","#f1e1c2","#d1f6fc","#f6f1bd",
      "#e4e0e0","#d4e8b2","#f6d6ad","#d3e2e9","#d5d0e5","#f8d3ec","#ebd2d2"];

      connection.query("INSERT INTO expenses(Expense_Label, Expense_PaymentMethod, AY_ID , Expense_Color) VALUES (?,?,?,?);", [Expense_Label, Expense_PaymentMethod, AY_ID ,$subjectColors[Color_Index]], (err, expensesResult, fields) => {
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
  findUser: function(Email) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM `users` WHERE `User_Email` = ?", [Email], (err, user, fields) => {
       if (err) reject(err);
        else resolve(user);
      });
    })
  },
  saveUser: function(institutionsData) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO users(User_Name, User_Image, User_Email, User_Phone,User_Role) VALUES(?,?,?,?,?)", [JSON.stringify({first_name:institutionsData.school, last_name:""}), "assets/icons/Logo_placeholder.svg",institutionsData.email,institutionsData.phone,"Admin"], (err, user, fields) => {
       if (err) reject(err);
        else resolve(user);
      });
    })
  },
  defaultExpence: function(Institution_ID,AY_ID) {
     return new Promise((resolve, reject) => {
      var defaultExpenceQuery = `INSERT INTO internal_expences (Expence_Name, Expence_Image,Expence_Color,Expence_Type,Expence_Periode,Expence_For,Expence_Status, Institution_ID,AY_ID) VALUES ('Salaires','', '#ececf5', 'Fix', 'Monthly', 'Employees' , '-1',?,?)`;
      connection.query(defaultExpenceQuery, [Institution_ID,AY_ID], (err, user, fields) => {
       if (err) reject(err);
        else resolve(user);
      });
    })
  }
};

module.exports = setupModel;