var connection  = require('../lib/db');

var getRandomColor =() => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var settingModel = {

  saveSubjects: function(Subject_Label) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO subjects(Subject_Label,Subject_Color) VALUES (?,?) ON DUPLICATE KEY UPDATE `Subject_Label` = `Subject_Label`; SELECT Subject_ID FROM subjects WHERE `Subject_Label` = ?", [Subject_Label,getRandomColor(),Subject_Label], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(subjectResult[0].insertId === 0 ? subjectResult[1][0].Subject_ID : subjectResult[0].insertId);
      });
    })
  },
  saveLevelsSubjects: function(Level_ID, Subject_ID, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO levelsubjects(Level_ID, Subject_ID, AY_ID) VALUES (?,?,?);", [Level_ID, Subject_ID, AY_ID], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(subjectResult);
      });
    })
  },
  findLevelsSubjects: function(Level_ID, Subject_ID, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT Count(*) as 'LS_Count' , LS_Status from levelsubjects WHERE Level_ID = ? And Subject_ID = ? And AY_ID = ? ", [Level_ID, Subject_ID, AY_ID], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(JSON.parse(JSON.stringify(subjectResult)));
      });
    })
  }
};

module.exports = settingModel;