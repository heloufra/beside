var connection  = require('../lib/db');

var employeeModel = {
   findUser: function(Email,instution_id) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT users.*,institutionsusers.User_Role as role FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID WHERE `User_Email` = ? AND institutionsusers.Institution_ID = ? AND institutionsusers.IU_Status<>0", [Email,instution_id], (err, user, fields) => {
       if (err) reject(err);
        else resolve(user);
      });
    })
  },
  findUserById: function(Id) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT users.User_Name FROM `users`  WHERE `User_ID` = ? ", [Id], (err, user, fields) => {
       if (err) reject(err);
        else resolve(user);
      });
    })
  },
  saveUser: function(req) {
     return new Promise((resolve, reject) => {
      console.log("saveUser =>",req.body);
      connection.query("INSERT INTO users(User_Name, User_Image, User_Email,User_Birthdate, User_Phone,User_Address,User_Gender,User_Role) VALUES(?,?,?,?,?,?,?,?)", [JSON.stringify({first_name:req.body.first_name, last_name:req.body.last_name}), req.body.profile_image,req.body.email,req.body.birthdate,req.body.phone_number,req.body.employee_address,req.body.employee_gender,req.body.employee_functionality], (err, employee, fields) => {
       if (err){
         reject(err);
       } 
        else{
           resolve(employee);
        }
      });
    })
  },
  saveIU: function(Institution_ID,userId,use_Role) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO `institutionsusers`(`Institution_ID`, `User_ID`, `User_Role`) VALUES (?,?,?)",[Institution_ID,userId,use_Role], (err, teacher, fields) => {
       if (err) reject(err);
        else resolve(teacher);
      });
    })
  },
  dateConvert:function(date) {
      return  date = date.split("/").reverse().join("-");
  },
  dateBetween:function(from,to,check) {

    var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }

    return false;

  }
};

module.exports = employeeModel;