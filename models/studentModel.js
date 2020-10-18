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
};

module.exports = studentModel;