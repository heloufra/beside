var connection  = require('../lib/db');

var studentModel = {
   findLe: function(Id,studentID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM `studentsubscribtion` WHERE `LE_ID` = ? AND Student_ID = ?", [Id,studentID], (err, le_id, fields) => {
       if (err) reject(err);
        else resolve(le_id);
      });
    })
  },
  findHomeworkFiles: function(Id) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM homeworks_attachement WHERE HA_Status <> '0' AND  Homework_ID = ?", [Id], (err, files, fields) => {
       if (err) reject(err);
        else resolve(files);
      });
    })
  },
};

module.exports = studentModel;