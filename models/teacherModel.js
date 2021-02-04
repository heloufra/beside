var connection  = require('../lib/db');

var teacherModel = {
  findClasses: function(Teacher_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT DISTINCT classes.Classe_Label,classes.Classe_ID FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID LEFT JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID LEFT JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID WHERE users.User_ID = ? AND institutionsusers.User_Role = 'Teacher' AND teachersubjectsclasses.TSC_Status <>0 AND institutionsusers.IU_Status<>0", [Teacher_ID], (err, classesResult, fields) => {
       if (err) reject(err);
        else resolve(classesResult);
      });
    })
  },
   findSubjects: function(Teacher_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT DISTINCT subjects.Subject_Label FROM `teachersubjectsclasses` INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID  WHERE teachersubjectsclasses.Teacher_ID = ? AND teachersubjectsclasses.TSC_Status<>0", [Teacher_ID], (err, classesResult, fields) => {
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
      connection.query(`SELECT DISTINCT * FROM classes c INNER JOIN levelsubjects ls ON (ls.Level_ID = c.Level_ID) 
      WHERE 
      (c.Classe_ID IN (SELECT tsc.Classe_ID FROM teachersubjectsclasses tsc WHERE tsc.TSC_Status=0) 
       OR c.Classe_ID NOT IN (SELECT tsc2.Classe_ID FROM teachersubjectsclasses tsc2))
       AND c.Classe_Status=1 AND c.AY_ID=? AND ls.Subject_ID=? ORDER by ls.Level_ID , c.Classe_ID `, [AY_ID,Subject_ID], (err, classes, fields) => {
             if (err) reject(err);
              else resolve(classes[0]);
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
   findSubTeacher: function(teacher_id,subject_id,classe_id) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM `teachersubjectsclasses` WHERE `Teacher_ID`=? AND `Subject_ID`=? AND `Classe_ID`=?", [teacher_id,subject_id,classe_id], (err, teacher, fields) => {
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
  saveTeacher: function(first_name, last_name,email,birthdate,  phone_number,teacher_address,teacher_gender) {
     return new Promise((resolve, reject) => {

      User_Image="assets/images/profiles/avatar_teacher_female.svg";

      if(teacher_gender == "Male"){
        User_Image="assets/images/profiles/avatar_teacher_male.svg";
      }

      connection.query("INSERT INTO users(User_Name, User_Image,User_Email,User_Birthdate, User_Phone,User_Address,User_Gender,User_Role) VALUES(?,?,?,?,?,?,?,?)", [JSON.stringify({first_name, last_name}), User_Image ,email,birthdate,  phone_number,teacher_address,teacher_gender,"Teacher"], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
  saveIU: function(Institution_ID,userId) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO `institutionsusers`(`Institution_ID`, `User_ID`, `User_Role`) VALUES (?,?,?)",[Institution_ID,userId,"Teacher"], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
  updateTeacher: function(first_name, last_name,email,birthdate,  phone_number,teacher_address,teacher_gender,userId) {
     return new Promise((resolve, reject) => {
      connection.query("UPDATE `users` SET User_Name=?,User_Birthdate = ?, User_Address = ?, User_Gender=? WHERE User_ID = ?", [JSON.stringify({first_name, last_name}),email,birthdate, phone_number,teacher_address,teacher_gender,userId], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
};

module.exports = teacherModel;