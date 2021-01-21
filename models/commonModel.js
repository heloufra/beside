var connection  = require('../lib/db');

var commonModel = {
  userUniqueTel: function(Phone,User_Id,Institution_Id) {
     return new Promise((resolve, reject) => {
         // User unique email  
          connection.query("SELECT Count(*) as 'Tel_Count' , User_Phone FROM users u inner join institutionsusers iu on(u.User_ID = iu.User_ID)  WHERE `User_Phone` = ? AND User_Status = 1 AND u.User_ID <> ? AND iu.Institution_ID = ?  ", [ Phone , User_Id , Institution_Id ], (err, userTel, fields) => {
                if (err){
                 reject(err);
               } else { 
                // unique email
                resolve(JSON.parse(JSON.stringify(userTel)));
               }

          });
    })
  },
  userUniqueEmail: function(Email,User_Id,Institution_Id) {
     return new Promise((resolve, reject) => {
         // User unique email  
          connection.query("SELECT Count(*) as 'Email_Count' , User_Email FROM users u inner join institutionsusers iu on(u.User_ID = iu.User_ID)  WHERE `User_Email` = ? AND User_Status = 1 AND u.User_ID <> ? AND iu.Institution_ID = ?  ", [ Email , User_Id , Institution_Id ], (err, userEmail, fields) => {
                if (err){
                 reject(err);
               } else { 
                // unique email
                resolve(JSON.parse(JSON.stringify(userEmail)));
               }

          });
    })
  }
};

module.exports = commonModel;


