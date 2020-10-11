var connection  = require('../lib/db');
var selectSubject = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE classes.Classe_Label = ?";

var commonController = {
  getSubjects: function(req, res, next) {
  	if (req.query.classe === 'All')
	  	connection.query("SELECT * FROM subjects",[req.query.classe], (err, subjects, fields) => {
	      res.json({
	                subjects:subjects,
	              });
	    })
    else
	    connection.query(selectSubject,[req.query.classe], (err, subjects, fields) => {
	      res.json({
	                subjects:subjects,
	              });
	    })
  },
};

module.exports = commonController;