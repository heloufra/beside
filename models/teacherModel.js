var connection  = require('../lib/db');

var teacherModel = {
  findClasses: function(Teacher_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT DISTINCT classes.Classe_Label FROM `teachersubjectsclasses` INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID  WHERE teachersubjectsclasses.Teacher_ID = ?", [Teacher_ID], (err, classesResult, fields) => {
       if (err) reject(err);
        else resolve(classesResult);
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
      connection.query("INSERT INTO users(User_Name, User_Image, User_Email,User_Birthdate, User_Phone,User_Address,User_Role) VALUES(?,?,?,?,?,?,?)", [JSON.stringify({first_name:req.body.first_name, last_name:req.body.last_name}), req.body.profile_image,req.body.email,  req.body.birthdate,  req.body.phone_number,req.body.teacher_address,"Teacher"], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
};

module.exports = teacherModel;