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
};

module.exports = teacherModel;