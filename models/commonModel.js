var connection  = require('../lib/db');

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];

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
  getMonthsExpenses: function(AY_ID,AY_YearStart,AY_YearEnd,AY_SatrtDate,AY_EndDate){

      monthExpenses = [];

      AY_SatrtDate = months.indexOf(AY_SatrtDate)+1;
      AY_SatrtDate = (AY_SatrtDate <= 9 ) ? "0"+AY_SatrtDate : AY_SatrtDate;

      AY_EndDate_String = AY_EndDate;
      AY_EndDate = months.indexOf(AY_EndDate)+1;
      AY_EndDate = (AY_SatrtDate <= 9 ) ? "0"+AY_EndDate : AY_EndDate;

      monthsRange = this.generateMonthsBetween2Days(AY_YearStart+"-"+AY_SatrtDate+"-"+"01",AY_YearEnd+"-"+AY_EndDate+"-"+"31");

      for (let m = 0; m < monthsRange.length; m++) {

            monthExpenses.push(new Promise((resolve, reject) => {

                var d = new Date(monthsRange[m]);
                var n = d.getMonth();

                connection.query("Select Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) where ss.SS_Status = 1 and le.AY_ID = ? and ss.Subscription_EndDate = ? And e. Expense_PaymentMethod = 'Monthly' And ss.SS_ID Not In (select sp.SS_ID From studentspayments sp where sp.SP_PaidPeriod = ? )  ",[AY_ID,AY_EndDate_String,months[n]], (err, Expenses , fields) => {
                    if(err){
                       reject(err);
                    }else{ 

                        connection.query('select SUM(le.Expense_Cost) as `total` from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) where ss.SS_Status = 1 And MONTH( sp.`SP_Addeddate` ) = ?  And le.AY_ID = ? ', [(n+1),AY_ID], (err, totalPay, fields) => {
                          if(err){
                            reject(err);
                          }else{ 
                            Month_ID = ((n+1) <=9) ? "0"+ (n+1) : (n+1)+"";
                            TotalPay = (totalPay[0].total !== null ) ?  totalPay[0].total : 0 ;
                            Expense_Cost_Percentage = (TotalPay * 100 ) / Expenses[0].Count_Cost;
                            resolve({"Month":months[n],Month_ID:(Month_ID*1),"Month_Start_Date":monthsRange[m],"Expense_Cost":Expenses[0].Count_Cost,"Expense_Cost_Percentage":Expense_Cost_Percentage,TotalPay,
                            });
                          }
                        });
                    }
                });

            }));

      }

      return Promise.all(monthExpenses);

  },
  getMonthsExpenses_: function(AY_ID,AY_YearStart,AY_YearEnd,AY_SatrtDate,AY_EndDate){

    return new Promise((resolve, reject) => {
          monthExpenses = [];
          monthExpensesCost = 0;
          thisMonth = "";
          connection.query("select le.Expense_Cost , ss.Subscription_EndDate from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) where ss.SS_Status = 1 and le.AY_ID = ? ", [AY_ID], (err, Expenses , fields) => {
              if(err){
                 reject(err);
              }else{ 
                for(var e = 0  ; e < Expenses.length ; e++  ){

                    if(Expenses[e].Subscription_EndDate == AY_EndDate ) {
                      monthExpenses.push(Expenses[e]);
                      monthExpensesCost += Expenses[e].Expense_Cost;
                      month = Expenses[e].Subscription_EndDate
                    }  

                }
                resolve(monthExpenses);
              }
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

  },
  dateCompare:function(date1,date2) {

    date1 = new Date(date1);
    date2 = new Date(date2);

    if (date1 > date2) {
      return 1 ; 
    }
    else if(date1<date2){
      return -1 ;
    }else {
      return 0
    }

  },
  generateMonthsBetween2Days(startDate, endDate){
    var dates = [];
    var d0 = startDate.split('-');
    var d1 = endDate.split('-');

    for (var y = d0[0] ; y <= d1[0] ; y++){
      for (var m = d0[1] ; m <= 12 ; m++){
          m = (m < 9) ? "0"+m : m ;
          dates.push(y+"-"+m+"-01");
          if (y >= d1[0] && m >= d1[1]) {
             break;
          }
      };
      d0[1] = 1;
    };
    return dates ;
  }
};

module.exports = commonModel;