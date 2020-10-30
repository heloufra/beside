var connection  = require('../lib/db');
var selectSubject = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE classes.Classe_Label = ?";
var selectSubjectTeacher = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE classes.Classe_Label = ? AND teachersubjectsclasses.Teacher_ID = ?";
var selectSubjectTeacherAll = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE teachersubjectsclasses.Teacher_ID = ?";
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
};

module.exports = commonController;