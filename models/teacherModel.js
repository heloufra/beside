var connection  = require('../lib/db');

var AdTeacher = "SELECT absencesanddelays.* FROM `absencesanddelays` INNER JOIN users ON users.User_ID = absencesanddelays.User_ID INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN academicyear ac ON(ac.Institution_ID = institutionsusers.Institution_ID) WHERE absencesanddelays.User_Type = 'Teacher' AND users.User_ID = ?  AND institutionsusers.Institution_ID = ? AND users.User_Status = 1 AND institutionsusers.IU_Status = 1 AND absencesanddelays.AD_Status = 1 And ac.AY_ID = ? ";

var teacherModel = {
  findClasses: function(Teacher_ID , AY_ID ) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT DISTINCT classes.Classe_Label,classes.Classe_ID FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID LEFT JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID LEFT JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID WHERE users.User_ID = ? AND institutionsusers.User_Role = 'Teacher' AND teachersubjectsclasses.TSC_Status <> 0 AND institutionsusers.IU_Status <> 0 And teachersubjectsclasses.AY_ID = ? And classes.Classe_Status = 1 And users.User_Status = 1 ", [Teacher_ID , AY_ID ], (err, classesResult, fields) => {
       if (err) reject(err);
        else resolve(classesResult);
      });
    })
  },
   findSubjects: function(Teacher_ID  , AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT DISTINCT subjects.Subject_Label FROM `teachersubjectsclasses` INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID  WHERE teachersubjectsclasses.Teacher_ID = ? AND teachersubjectsclasses.TSC_Status<>0 And subjects.Subject_Status = 1 And teachersubjectsclasses.AY_ID = ? ", [Teacher_ID , AY_ID], (err, classesResult, fields) => {
       if (err) reject(err);
        else resolve(classesResult);
      });
    })
  },
   findUser: function(Email,instution_id) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT users.*,institutionsusers.User_Role as role FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID WHERE `User_Email` = ? AND institutionsusers.Institution_ID = ? AND institutionsusers.IU_Status<>0", [Email,instution_id], (err, user, fields) => {
       if (err) reject(err);
        else resolve(user);
      });
    })
  },
  getAllClasses: function(Subject_ID,AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query(`SELECT DISTINCT c.* , l.Level_Label FROM classes c INNER JOIN levelsubjects ls ON (ls.Level_ID = c.Level_ID) INNER JOIN levels l 
      ON (l.Level_ID = ls.Level_ID)
      WHERE 
      (c.Classe_ID IN (SELECT tsc.Classe_ID FROM teachersubjectsclasses tsc ) 
       OR c.Classe_ID NOT IN (SELECT tsc2.Classe_ID FROM teachersubjectsclasses tsc2))
       AND c.Classe_Status=1 And l.Level_Status = 1 And ls.LS_Status = 1 AND c.AY_ID=? AND ls.Subject_ID=? ORDER by ls.Level_ID , c.Classe_ID `, [AY_ID,Subject_ID], (err, classes, fields) => {
             if (err) reject(err);
              else resolve(classes);
            });
          })
  },
  findUserById: function(Id) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT users.User_Name FROM `users`  WHERE `User_ID` = ? ", [Id], (err, user, fields) => {
       if (err) reject(err);
        else resolve(user);
      });
    })
  },
   findSubTeacher: function(teacher_id,subject_id,classe_id,AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM `teachersubjectsclasses` WHERE `Teacher_ID`=? AND `Subject_ID`=? AND `Classe_ID`=? And teachersubjectsclasses.AY_ID = ? And teachersubjectsclasses.TSC_Status = 1 ", [teacher_id,subject_id,classe_id,AY_ID], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
  saveUser: function(req) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO users(User_Name, User_Image, User_Email,User_Birthdate, User_Phone,User_Address,User_Gender,User_Role) VALUES(?,?,?,?,?,?,?,?)", [JSON.stringify({first_name:req.body.first_name, last_name:req.body.last_name}), req.body.profile_image,req.body.email,  req.body.birthdate,  req.body.phone_number,req.body.teacher_address,req.body.teacher_gender,"Teacher"], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
  saveTeacher: function(first_name, last_name,email,birthdate,  phone_number,teacher_address,teacher_gender,Institution_ID) {
     return new Promise((resolve, reject) => {

          User_Image="assets/images/profiles/avatar_teacher_female.svg";

          if(teacher_gender == "Male"){
            User_Image="assets/images/profiles/avatar_teacher_male.svg";
          }

          connection.query("INSERT INTO users(User_Name, User_Image,User_Email,User_Birthdate, User_Phone,User_Address,User_Gender,User_Role) VALUES(?,?,?,?,?,?,?,?)", [JSON.stringify({first_name, last_name}), User_Image ,email,birthdate,  phone_number,teacher_address,teacher_gender,"Teacher"], (err, teacher, fields) => {
            if (err){ 
              reject(err);
            }else {
                  connection.query("SELECT AY_ID , Institution_Name FROM academicyear ac INNER JOIN institutions ins on(ac.Institution_ID = ins.Institution_ID) WHERE ins.Institution_ID = ? LIMIT 1", [Institution_ID], (err, academic, fields) => {
                      if (err){ 
                        reject(err); 
                      }else{
                        teacher.Institution_Name = academic[0].Institution_Name;
                        resolve(teacher);
                      }
                  });
              }
          });

      });
  },
  saveIU: function(Institution_ID,userId) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO `institutionsusers`(`Institution_ID`, `User_ID`, `User_Role`) VALUES (?,?,?)",[Institution_ID,userId,"Teacher"], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
  updateTeacher: function(first_name,last_name,email,birthdate,phone_number,teacher_address,teacher_gender,userId) {
     return new Promise((resolve, reject) => {
      connection.query("UPDATE `users` SET User_Name=?,User_Birthdate = ?, User_Address = ?, User_Gender=? WHERE User_ID = ?", [JSON.stringify({first_name, last_name}),email,birthdate, phone_number,teacher_address,teacher_gender,userId], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
  getTeachersAbsenceDelay:function(Teacher_ID,Institution_ID,AY_ID) {

    return new Promise((resolve, reject) => {

      var absenceArray = [];
      var retardArray  = [];
      var studentArray = {};

      var AD_FromTo = 0;

      var Today = new Date();
      Today = Today.toISOString().slice(0,10);

      connection.query(AdTeacher, [Teacher_ID,Institution_ID,AY_ID] ,async (err, absencesS, fields) => {

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

module.exports = teacherModel;