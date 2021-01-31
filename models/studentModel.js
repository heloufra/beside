var connection  = require('../lib/db');
var studentQuery = `INSERT INTO students(Student_FirstName,  Student_LastName, Student_Image,  Student_birthdate,  Student_Address,  Student_Phone,Student_Gender,Student_Status, Institution_ID) VALUES(?,?,?,?,?,?,?,1,?)`;
var parentQuery = `INSERT INTO parents(Parent_Name,  Parent_Phone, Institution_ID) VALUES(?,?,?)`;
var spQuery = `INSERT INTO studentsparents(Student_ID, Parent_ID) VALUES(?,?)`;
var ssQuery = `INSERT INTO studentsubscribtion(Student_ID, LE_ID, Subscription_StartDate, Subscription_EndDate, AY_ID) VALUES(?,?,?,?,?)`;
var scQuery = `INSERT INTO studentsclasses(Student_ID, Classe_ID, AY_ID) VALUES(?,?,?)`;

var AdStudent = "SELECT absencesanddelays.*,students.*,classes.Classe_Label FROM `absencesanddelays` INNER JOIN students ON students.Student_ID = absencesanddelays.User_ID INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID WHERE absencesanddelays.User_Type = 'Student' AND students.Institution_ID = ? AND students.Student_Status<>0 AND absencesanddelays.AD_Status<>0";

var studentModel = {
  findLe: function(Id,studentID, AY_ID ) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM `studentsubscribtion` WHERE `LE_ID` = ? AND Student_ID = ? AND  AY_ID = ? AND  ( SS_Status = 1 OR SS_Status = 0 ) ", [Id,studentID,AY_ID], (err, le_id, fields) => {
       if (err) reject(err);
        else resolve(le_id);
      });
    })
  },
  findClasse: function(Classe_Label,AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT Classe_ID FROM `classes` WHERE `Classe_Label` = ? AND AY_ID = ? LIMIT 1", [Classe_Label,AY_ID], (err, classe, fields) => {
       if (err) reject(err);
        else resolve(classe);
      });
    })
  },
  findLeByLevel: function(expense,academicId,level) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT le.LE_ID FROM expenses e INNER JOIN levelexpenses le ON e.Expense_ID=le.Expense_ID INNER JOIN levels l ON l.Level_ID = le.Level_ID  WHERE e.Expense_Label=? AND le.AY_ID=? AND l.Level_Label=?", [expense,academicId,level], (err, le_id, fields) => {
       if (err) reject(err);
        else resolve(le_id);
      });
    })
  },
  findHomeworkFiles: function(Id) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM homeworks_attachement WHERE HA_Status = '1' AND  Homework_ID = ?", [Id], (err, files, fields) => {
       if (err) reject(err);
        else resolve(files);
      });
    })
  },
  saveStudent: function(f_name,l_name,birthdate,address,phone,gender,Institution_ID) {
     return new Promise((resolve, reject) => {
      connection.query(studentQuery, [f_name,l_name, "assets/icons/Logo_placeholder.svg", birthdate,address,phone,gender,Institution_ID],(err, student, fields) => {
       if (err) reject(err);
        else resolve(student);
      });
    })
  },
  saveParent: function(name,phone,Institution_ID) {
     return new Promise((resolve, reject) => {
      connection.query(parentQuery, [name,phone,Institution_ID], (err, parent, fields) => {
       if (err) reject(err);
        else resolve(parent);
      });
    })
  },
  saveStudentParent: function(studentID,parentID) {
     return new Promise((resolve, reject) => {
       connection.query(spQuery, [studentID,parentID], (err, spresult, fields) => {
       if (err) reject(err);
        else resolve(spresult);
      });
    })
  },
  saveStudentSub: function(studentID,LE_ID,startDate,AY_EndDate,AY_ID) {
     return new Promise((resolve, reject) => {
       connection.query(ssQuery, [studentID,LE_ID,startDate,AY_EndDate,AY_ID], (err, ssresult, fields) => {
       if (err) reject(err);
        else resolve(ssresult);
      });
    })
  },
  saveStudentClasse: function(studentID,Classe_ID,AY_ID) {
     return new Promise((resolve, reject) => {
       connection.query(scQuery, [studentID,Classe_ID,AY_ID], (err, scresult, fields) => {
       if (err) reject(err);
        else resolve(scresult);
      });
    })
  },
  studentParentUniqueEmail: function(Email,Id,Institution_Id) {
     return new Promise((resolve, reject) => {
         // Parent unique email  
          connection.query("SELECT Count(*) as 'Email_Count' , Parent_Email  FROM `parents` WHERE `Parent_Email` = ? AND Parent_Status = 1 AND Parent_ID <> ? AND Institution_ID = ?  ", [ Email , Id , Institution_Id ] , (err, parentEmail, fields) => {
                if (err){
                 reject(err);
               } else { 
                // unique email
                resolve(JSON.parse(JSON.stringify(parentEmail)));
               }

          });
    })
  },
  studentParentUniqueTel: function(Phone,Id,Institution_Id) {
     return new Promise((resolve, reject) => {
         // Parent unique email  
          connection.query("SELECT Count(*) as 'Tel_Count' , Parent_Phone FROM `parents` WHERE `Parent_Phone` = ? AND Parent_Status = 1 AND Parent_ID <> ? AND Institution_ID = ?  ", [ Phone , Id , Institution_Id ], (err, parentTel, fields) => {
                if (err){
                 reject(err);
               } else { 
                // unique email
                resolve(JSON.parse(JSON.stringify(parentTel)));
               }

          });
    })
  },
  studentUniqueTel: function(Phone,Id,Institution_Id) {
     return new Promise((resolve, reject) => {
         // Parent unique email  
          connection.query("SELECT Count(*) as 'Tel_Count' , Student_Phone FROM `students` WHERE `Student_Phone` = ? AND Student_Status = 1 AND Student_ID <> ? AND Institution_ID = ?  ", [ Phone , Id , Institution_Id ], (err, studentTel, fields) => {
                if (err){
                 reject(err);
               } else { 
                // unique email
                resolve(JSON.parse(JSON.stringify(studentTel)));
               }

          });
    })
  },
  studentUniqueEmail: function(Email,Id,Institution_Id) {
     return new Promise((resolve, reject) => {
         // Parent unique email  
          connection.query("SELECT Count(*) as 'Email_Count' , Student_Email FROM `students` WHERE `Student_Email` = ? AND Student_Status = 1 AND Student_ID <> ? AND Institution_ID = ?  ", [ Email , Id , Institution_Id ], (err, studentEmail, fields) => {
                if (err){
                 reject(err);
               } else { 
                // unique email
                resolve(JSON.parse(JSON.stringify(studentEmail)));
               }

          });
    })
  },

  getStudentsAbsenceDelay:function(Institution_ID) {

    return new Promise((resolve, reject) => {

      var studentArray = [];

      connection.query(AdStudent, [Institution_ID] ,async (err, absencesS, fields) => {

          try{

            for (var i = absencesS.length - 1; i >= 0; i--) {  
              studentArray.push({student:absencesS[i]});
            }

            console.log("studentArray ",studentArray);

            resolve(JSON.parse(JSON.stringify(studentArray)));

          }catch(e){
            console.log(e);
            reject(err);
          }

      });

    });

  }

};

module.exports = studentModel;