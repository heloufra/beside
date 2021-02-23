var connection  = require('../lib/db');

var AdStudent = "SELECT absencesanddelays.* FROM `absencesanddelays` INNER JOIN students ON students.Student_ID = absencesanddelays.User_ID INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID WHERE absencesanddelays.User_Type = 'Student' AND students.Institution_ID = ? AND students.Student_Status<>0 AND absencesanddelays.AD_Status = 1 ";

var AdTeacher = "SELECT absencesanddelays.* FROM `absencesanddelays` INNER JOIN users ON users.User_ID = absencesanddelays.User_ID INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID WHERE absencesanddelays.User_Type = 'Teacher' AND institutionsusers.Institution_ID = ? AND users.User_Status = 1 AND institutionsusers.IU_Status = 1 AND absencesanddelays.AD_Status = 1";

var commonModel = {
  userUniqueTel: function(Phone,User_Id,Institution_Id) {
     return new Promise((resolve, reject) => {
         // User unique email  
          connection.query("SELECT Count(*) as 'Tel_Count' , User_Phone , iu.User_Role FROM users u inner join institutionsusers iu on(u.User_ID = iu.User_ID)  WHERE `User_Phone` = ? AND User_Status = 1 AND u.User_ID <> ? AND iu.Institution_ID = ?  ", [ Phone , User_Id , Institution_Id ], (err, userTel, fields) => {
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
          connection.query("SELECT Count(*) as 'Email_Count' , User_Email , iu.User_Role FROM users u inner join institutionsusers iu on(u.User_ID = iu.User_ID)  WHERE `User_Email` = ? AND User_Status = 1 AND u.User_ID <> ? AND iu.Institution_ID = ?  ", [ Email , User_Id , Institution_Id ], (err, userEmail, fields) => {
                if (err){
                 reject(err);
               } else { 
                // unique email
                resolve(JSON.parse(JSON.stringify(userEmail)));
               }

          });
    })
  },
  getAllStudentsAbsenceDelay:function(Institution_ID) {

    return new Promise((resolve, reject) => {

      var absenceArray    = [];
      var retardArray     = [];
      var studentArray    = {};
      var studentIdAbsenceArray = [];
      var studentIdRetardArray  = [];

      var AD_FromTo = 0;

      var Today = new Date();
      Today = Today.toISOString().slice(0,10);

      connection.query(AdStudent,[Institution_ID] ,async (err, absencesS, fields) => {

          try{

                for (var i = absencesS.length - 1; i >= 0; i--) {

                  if(absencesS[i].AD_Type == 2){

                      AD_FromTo = JSON.parse(absencesS[i].AD_FromTo);
                      AD_From   = AD_FromTo.from;
                      AD_To     = AD_FromTo.to;

                      AD_From =   this.dateConvert(AD_From);
                      AD_To   =   this.dateConvert(AD_To);

                      if(this.dateBetween(AD_From,AD_To,Today)){
                        absenceArray.push(absencesS[i]);
                        studentIdAbsenceArray.push(absencesS[i].User_ID);
                      }                  

                  }else{

                      AD_FromTo  = absencesS[i].AD_Date;
                      AD_FromTo =   this.dateConvert(AD_FromTo);

                      if(absencesS[i].AD_Type == 0){

                        AD_FromTo  = absencesS[i].AD_Date;
                        AD_FromTo =   this.dateConvert(AD_FromTo);

                        if(this.dateBetween(AD_FromTo,AD_FromTo,Today)){
                          retardArray.push(absencesS[i]);
                          studentIdRetardArray.push(absencesS[i].User_ID);
                        }

                      }else{

                        if(this.dateBetween(AD_FromTo,AD_FromTo,Today)){
                          absenceArray.push(absencesS[i]);
                          studentIdAbsenceArray.push(absencesS[i].User_ID);
                        }

                      }
                }

                studentArray["Retards"]  = retardArray ;
                studentArray["Absences"] = absenceArray;

            }

            studentArray["studentIdAbsenceArray"] = [...new Set(studentIdAbsenceArray)];
            studentArray["studentIdRetardArray"]  = [...new Set(studentIdRetardArray)];

            studentArray["Total_Retards"]  = studentArray["studentIdRetardArray"].length;
            studentArray["Total_Absences"] = studentArray["studentIdAbsenceArray"].length;

            resolve(JSON.parse(JSON.stringify(studentArray)));

          }catch(e){
            console.log(e);
            reject(err);
          }

      });

    });

  },
  getAllTeachersAbsenceDelay:function(Institution_ID) {

    return new Promise((resolve, reject) => {

      var absenceArray    = [];
      var retardArray     = [];
      var studentArray    = {};
      var studentIdAbsenceArray = [];
      var studentIdRetardArray  = [];

      var AD_FromTo = 0;

      var Today = new Date();
      Today = Today.toISOString().slice(0,10);

      connection.query(AdTeacher, [Institution_ID] ,async (err, absencesS, fields) => {

          try{

                for (var i = absencesS.length - 1; i >= 0; i--) {

                  if(absencesS[i].AD_Type == 2){

                      AD_FromTo = JSON.parse(absencesS[i].AD_FromTo);
                      AD_From   = AD_FromTo.from;
                      AD_To     = AD_FromTo.to;

                      AD_From =   this.dateConvert(AD_From);
                      AD_To   =   this.dateConvert(AD_To);

                      if(this.dateBetween(AD_From,AD_To,Today)){
                        absenceArray.push(absencesS[i]);
                        studentIdAbsenceArray.push(absencesS[i].User_ID);
                      }                  

                  }else{

                      AD_FromTo  = absencesS[i].AD_Date;
                      AD_FromTo =   this.dateConvert(AD_FromTo);

                      if(absencesS[i].AD_Type == 0){

                        AD_FromTo  = absencesS[i].AD_Date;
                        AD_FromTo =   this.dateConvert(AD_FromTo);

                        if(this.dateBetween(AD_FromTo,AD_FromTo,Today)){
                          retardArray.push(absencesS[i]);
                          studentIdRetardArray.push(absencesS[i].User_ID);
                        }

                      }else{

                        if(this.dateBetween(AD_FromTo,AD_FromTo,Today)){
                          absenceArray.push(absencesS[i]);
                          studentIdAbsenceArray.push(absencesS[i].User_ID);
                        }

                      }

                }

                studentArray["Retards"]  = retardArray ;
                studentArray["Absences"] = absenceArray;

            }

            studentArray["studentIdAbsenceArray"] = [...new Set(studentIdAbsenceArray)];
            studentArray["studentIdRetardArray"]  = [...new Set(studentIdRetardArray)];

            studentArray["Total_Retards"]  = studentArray["studentIdRetardArray"].length;
            studentArray["Total_Absences"] = studentArray["studentIdAbsenceArray"].length;

            resolve(JSON.parse(JSON.stringify(studentArray)));

          }catch(e){
            console.log(e);
            reject(err);
          }

      });

    });

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

module.exports = commonModel;