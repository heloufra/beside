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
   findUser: function(Email) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT users.*,institutionsusers.User_Role as role FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID WHERE `User_Email` = ? AND institutionsusers.IU_Status<>0", [Email], (err, user, fields) => {
       if (err) reject(err);
        else resolve(user);
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
      connection.query("INSERT INTO users(User_Name, User_Image, User_Email,User_Birthdate, User_Phone,User_Address,User_Gender,User_Role) VALUES(?,?,?,?,?,?,?)", [JSON.stringify({first_name:req.body.first_name, last_name:req.body.last_name}), req.body.profile_image,req.body.email,  req.body.birthdate,  req.body.phone_number,req.body.teacher_address,req.body.teacher_gender,"Teacher"], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
};

module.exports = teacherModel;