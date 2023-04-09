var connection  = require('../lib/db');
var studentQuery = `INSERT INTO students(Student_FirstName,  Student_LastName, Student_Image,  Student_birthdate,  Student_Address,  Student_Phone,Student_Gender,Student_Status,Student_Email,Institution_ID,Student_Code) VALUES(?,?,?,?,?,?,?,1,?,?,?)`;
var parentQuery = `INSERT INTO parents(Parent_Name,  Parent_Phone , Parent_Email , Institution_ID) VALUES(?,?,?,?)`;
var spQuery = `INSERT INTO studentsparents(Student_ID, Parent_ID) VALUES(?,?)`;
var ssQuery = `INSERT INTO studentsubscribtion(Student_ID, LE_ID, Subscription_StartDate, Subscription_EndDate, AY_ID) VALUES(?,?,?,?,?)`;
var scQuery = `INSERT INTO studentsclasses(Student_ID, Classe_ID, AY_ID) VALUES(?,?,?)`;

var AdStudent = "SELECT absencesanddelays.* FROM `absencesanddelays` INNER JOIN students ON students.Student_ID = absencesanddelays.User_ID INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID WHERE absencesanddelays.User_Type = 'Student' AND students.Student_ID = ?  AND students.Institution_ID = ? AND students.Student_Status<>0 AND absencesanddelays.AD_Status = 1 ";

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
  saveStudent: function(f_name,l_name,birthdate,address,phone,gender,email,Institution_ID,student_code) {

     return new Promise((resolve, reject) => {

      User_Image="assets/images/profiles/avatar_student_female.png";

      if(gender == "Male"){
        User_Image="assets/images/profiles/avatar_student_male.png";
      }

      connection.query(studentQuery, [f_name,l_name,User_Image, birthdate,address,phone,gender,email,Institution_ID,student_code],(err, student, fields) => {
       if (err) reject(err);
       else resolve(student); 
      });
    })
  },  
  saveStudentAsUser: function(f_name,l_name,birthdate,address,phone,gender,email) {
     return new Promise((resolve, reject) => {

      User_Image="assets/images/profiles/avatar_student_female.png";

      if(gender == "Male"){
        User_Image="assets/images/profiles/avatar_student_male.png";
      }
      connection.query("INSERT INTO users(User_Name, User_Image, User_Email,User_Birthdate,User_Phone,User_Address,User_Gender,User_Role) VALUES(?,?,?,?,?,?,?,?)",
        [JSON.stringify({first_name:f_name, last_name:l_name}), User_Image , email,  birthdate, phone ,address,gender,"Student"], (err, student, fields) => {
        if (err) reject(err);
        else resolve(student); 
      });
    })
  },
  saveParentAsUser: function(first_name,last_name,phone,email) {
     return new Promise((resolve, reject) => {
        User_Image="/assets/images/profiles/avatar_parent.png";
        connection.query("INSERT INTO users(User_Name, User_Image, User_Email, User_Phone, User_Role) VALUES(?,?,?,?,?)",
            [JSON.stringify({first_name:first_name, last_name:last_name}), User_Image, email, phone, "Parent"], (err, parent, fields) => {
            if (err) reject(err);
            else resolve(parent); 
        });
    })
  },
  saveParent: function(first_name,last_name,phone,email,Institution_ID) {
     return new Promise((resolve, reject) => {
      connection.query(parentQuery, [first_name+' '+last_name,phone,email,Institution_ID], (err, parent, fields) => {
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
    console.log("saveStudentSub ===>");
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
  studentUniqueCode: function(Code,Id,Institution_Id) {
      return new Promise((resolve, reject) => {
          connection.query("SELECT Count(*) as 'Code_Count' , Student_Code FROM `students` WHERE `Student_Code` = ? AND Student_Status = 1 AND Student_ID <> ? AND Institution_ID = ?  ", [ Code , Id , Institution_Id ], (err, studentCode, fields) => {
                if (err){
                  reject(err);
                } else { 
                  resolve(JSON.parse(JSON.stringify(studentCode)));
                }
          });
    })
  },

  getStudentsAbsenceDelay:function(Student_ID,Institution_ID) {

    return new Promise((resolve, reject) => {

      var absenceArray = [];
      var retardArray  = [];
      var studentArray = {};

      var AD_FromTo = 0;

      var Today = new Date();
      Today = Today.toISOString().slice(0,10);

      connection.query(AdStudent, [Student_ID,Institution_ID] ,async (err, absencesS, fields) => {

          try{

                for (var i = absencesS.length - 1; i >= 0; i--) {

                  if(absencesS[i].AD_Type == 2){

                      AD_FromTo = JSON.parse(absencesS[i].AD_FromTo);
                      AD_From   = AD_FromTo.from;
                      AD_To     = AD_FromTo.to;

                      AD_From =   this.dateConvert(AD_From);
                      AD_To   =   this.dateConvert(AD_To);

                      if(this.dateBetween(AD_From,AD_To,Today)){
                        absenceArray.push(absencesS[i]);
                      }                  

                  }else{

                      AD_FromTo  = absencesS[i].AD_Date;
                      AD_FromTo =   this.dateConvert(AD_FromTo);

                      if(absencesS[i].AD_Type == 0){

                        AD_FromTo  = absencesS[i].AD_Date;
                        AD_FromTo =   this.dateConvert(AD_FromTo);

                        if(this.dateBetween(AD_FromTo,AD_FromTo,Today)){
                          retardArray.push(absencesS[i]);
                        }

                      }else{

                        if(this.dateBetween(AD_FromTo,AD_FromTo,Today)){
                          absenceArray.push(absencesS[i]);
                        }

                      }


                }

                studentArray["Retards"]  = retardArray ;
                studentArray["Absences"] = absenceArray;

            }

            resolve(JSON.parse(JSON.stringify(studentArray)));

          }catch(e){
            console.log(e);
            reject(err);
          }

      });

    });

  },
  dateConvert:function(date) {
      return  date = date.split("/").reverse().join("-");
  },
  dateBetween:function(from,to,check) {

    var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }

    return false;

  }

};

module.exports = studentModel;