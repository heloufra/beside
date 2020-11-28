var connection  = require('../lib/db');
var selectSubject = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE classes.Classe_Label = ? AND teachersubjectsclasses.TSC_Status<>0";
var selectSubjectTeacher = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE classes.Classe_Label = ? AND teachersubjectsclasses.Teacher_ID = ? AND teachersubjectsclasses.TSC_Status<>0";
var selectSubjectTeacherAll = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE teachersubjectsclasses.Teacher_ID = ? AND teachersubjectsclasses.TSC_Status<>0";
const jwt = require('jsonwebtoken');
const config = require('../config');

var commonController = {
  getSubjects: function(req, res, next) {
  	if (req.query.classe === 'All')
      if (req.role === 'Admin')
  	  	connection.query("SELECT * FROM subjects",[req.query.classe], (err, subjects, fields) => {
  	      res.json({
  	                subjects:subjects,
  	              });
  	    })
      else
        connection.query(selectSubjectTeacherAll,[req.userId], (err, subjects, fields) => {
          res.json({
                    subjects:subjects,
                  });
        })
    else
      if(req.role === 'Admin')
  	    connection.query(selectSubject,[req.query.classe], (err, subjects, fields) => {
  	      res.json({
  	                subjects:subjects,
  	              });
  	    })
      else
        connection.query(selectSubjectTeacher,[req.query.classe,req.userId], (err, subjects, fields) => {
          res.json({
                    subjects:subjects,
                  });
        })
  },
  switchAccount: function(req, res, next) {
    var token = jwt.sign({
          userId:req.userId,
          role: req.role,
          Institution_ID:req.body.id
        }, config.privateKey);
    req.session.token = token;
    res.json({
      switched:true
    })
  }, 
  switchRole: function(req, res, next) {
    var token = jwt.sign({
          userId:req.userId,
          role: req.body.role,
          Institution_ID:req.Institution_ID
        }, config.privateKey);
    req.session.token = token;
    res.json({
      switched:true
    })
  },
   getUser: function(req, res, next) {
    connection.query("SELECT `User_Name`,`User_Email`,`User_Phone`,`User_Image`,`User_Address`,`User_Birthdate`,User_Gender FROM `users` WHERE User_ID=?", [req.userId], (err, user, fields) => {
       res.json({
        user:user[0]
      })
    })
  },
  updateUser: function(req, res, next) {
    var name;
    connection.query("SELECT `User_Name` FROM `users` WHERE User_ID=?", [req.userId], (err, user, fields) => {
      if (req.body.user_fname === "")
        name = user[0].User_Name;
      else
        name = JSON.stringify({first_name:req.body.user_fname, last_name:req.body.user_lname});
      connection.query("UPDATE `users` SET  `User_Name` = ?,`User_Email` = ?,`User_Phone` = ?,`User_Image` = ?,`User_Address` = ?,`User_Birthdate` = ?, `User_Gender` = ? WHERE `User_ID` = ?", [name,req.body.user_email,req.body.user_phone,req.body.user_image,req.body.user_address,req.body.user_date,req.body.user_gender,req.userId], (err, teacher, fields) => {
         if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "Cannot Remove it"
                }]});
            } else 
            {
              res.json({update : true});
            }
       })
    })
  }
};

module.exports = commonController;