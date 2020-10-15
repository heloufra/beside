var connection  = require('../lib/db');

var studentModel = {
   findLe: function(Id) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM `studentsubscribtion` WHERE `LE_ID` = ?", [Id], (err, le_id, fields) => {
       if (err) reject(err);
        else resolve(le_id);
      });
    })
  },
};

module.exports = studentModel;