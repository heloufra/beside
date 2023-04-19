var connection  = require('../lib/db');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fetch = require('node-fetch');

var date = new Date();

var fs = require('fs');

const base64ToImage = require('base64-to-image');

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var AdStudent = "SELECT absencesanddelays.* FROM `absencesanddelays` INNER JOIN students ON students.Student_ID = absencesanddelays.User_ID INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID WHERE absencesanddelays.User_Type = 'Student' AND students.Institution_ID = ? AND students.Student_Status<>0 AND absencesanddelays.AD_Status = 1 ";

var AdTeacher = "SELECT absencesanddelays.* FROM `absencesanddelays` INNER JOIN users ON users.User_ID = absencesanddelays.User_ID INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID WHERE absencesanddelays.User_Type = 'Teacher' AND institutionsusers.Institution_ID = ? AND users.User_Status = 1 AND institutionsusers.IU_Status = 1 AND absencesanddelays.AD_Status = 1";


var StudentsByTscId = "SELECT students.*,levels.Level_Label,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID inner join teachersubjectsclasses tsc on(tsc.Classe_ID = classes.Classe_ID) WHERE studentsclasses.AY_ID = ? AND students.Student_Status =  1 AND classes.Classe_Status = 1 AND tsc.TSC_Status = 1 AND tsc.TSC_ID = ? ";

var StudentsByClass = "SELECT students.*,levels.Level_Label,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.AY_ID = ? AND students.Student_Status =  1 AND classes.Classe_Status = 1 AND  classes.Classe_ID = ? ";

var StudentsById = "SELECT students.*,levels.Level_Label,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.AY_ID = ? AND students.Student_Status =  1 AND classes.Classe_Status = 1 AND  students.Student_ID = ? ";

var StudentParents = "SELECT parents.* FROM parents INNER JOIN studentsparents ON studentsparents.Parent_ID = parents.Parent_ID INNER JOIN students ON studentsparents.Student_ID = students.Student_ID WHERE students.Student_ID = ? And studentsparents.SP_Status = 1 "

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
  userValideVericationCode: function(User_Id,User_Password) {
      return new Promise((resolve, reject) => {
        // User Code Verification
        connection.query("SELECT User_Password FROM users  WHERE User_ID = ? AND User_Status = 1 ", [ User_Id ], (err, userCode, fields) => {
            if (err){
                reject(err);
            } else { 
              bcrypt.compare(
                User_Password,
                userCode[0].User_Password,
                function (err, result) {
                    userCode[0].Code = result ;
                    if (err){
                      resolve(JSON.parse(JSON.stringify(userCode)));
                    }else {
                      resolve(JSON.parse(JSON.stringify(userCode)));
                    }
                }
              )
          }
      });
    });
  },
  getAllStudents :function(AY_ID) {
    return new Promise((resolve, reject) => {

      var queryAllStudents = "SELECT students.*,levels.Level_Label,levels.Level_ID,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.AY_ID = ?  AND students.Student_Status =  1 ;";

      connection.query(queryAllStudents, [AY_ID], async (err, studentArray, fields) => {
        try {
          resolve(JSON.parse(JSON.stringify(studentArray)));
        } catch (e) {
          console.log(e);
          reject(err);
        }
      });

    });
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

getMonthsExpenses:  async function(AY_ID,AY_YearStart,AY_YearEnd,AY_SatrtDate,AY_EndDate){

    monthExpenses = [];

    AY_SatrtDate = months.indexOf(AY_SatrtDate)+1;
    AY_SatrtDate = (AY_SatrtDate <= 9 ) ? ""+AY_SatrtDate : AY_SatrtDate;
    AY_SatrtDateRange = (AY_SatrtDate <= 9 ) ? "0"+AY_SatrtDate : AY_SatrtDate;

    AY_EndDate_String = AY_EndDate;
    AY_EndDate = months.indexOf(AY_EndDate)+1;
    AY_EndDate = (AY_SatrtDate <= 9 ) ? ""+AY_EndDate : AY_EndDate;
    AY_EndDateRange = (AY_SatrtDate <= 9 ) ? "0"+AY_EndDate : AY_EndDate;


    Total_Monthly_Expected = 0;
    Total_Annual_Expected = 0;
    Total_Monthly_Paid_Subscriptions = 0;

    var Yearly_Total_Revenu_Grouped_By_Expenses_Obj = {};



    console.log("Rn ==>",AY_YearStart+"-"+AY_SatrtDateRange+"-"+"01"+" to "+AY_YearEnd+"-"+AY_EndDateRange+"-"+"31");

    MonthsRange = this.generateMonthsBetween2Days(AY_YearStart+"-"+AY_SatrtDateRange+"-"+"01",AY_YearEnd+"-"+AY_EndDateRange+"-"+"31");

    console.log("MonthsRange ==>",MonthsRange);
    
    for (let m = 0; m < MonthsRange.length; m++) {

          // student 	Subscription_StartDate <= Month
          monthExpenses.push(new Promise( async (resolve, reject) => {

              

              var d = new Date(MonthsRange[m]);
              var n = d.getMonth();

              //And (ss.SS_ID Not In (select sp.SS_ID From studentspayments sp where Month(sp.SP_Addeddate) <> Month(?) ))
              connection.query("Select Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) And MONTH(ss.Subscription_AddedDate) = Month(?)  ",[AY_ID , MonthsRange[m] , MonthsRange[m] ,MonthsRange[m] , MonthsRange[m] ], async (err, Annual_Expense_Cost , fields) => {
              
                if(err){
                  reject(err);
                }else{

                  connection.query("Select Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) ",[AY_ID , MonthsRange[m] , MonthsRange[m] ,MonthsRange[m]], async (err, Total_Annual_Cost , fields) => {
              
                  if(err){
                    reject(err);
                  }else{

                      /** Total_Annual_Expected ******************************/
                      Total_Annual_Expected = Total_Annual_Cost[0].Count_Cost;

                      connection.query("Select Sum(le.Expense_Cost) as 'total' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' And (ss.SS_ID In (select sp.SS_ID From studentspayments sp)) ",[AY_ID],  async (err, Annual_Expense_TotalPay, fields) => {
                        if(err){
                          reject(err);
                        }else{ 
                          connection.query(`Select 1 as 'SS_Status' , e.Expense_ID , e.Expense_Color , e.Expense_Label , e.Expense_PaymentMethod , Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where e.Expense_Status = 1 and s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? and ss.Subscription_EndDate = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY)
                          GROUP by e.Expense_ID
                          UNION
                          Select 1 as 'SS_Status' , e.Expense_ID , e.Expense_Color , e.Expense_Label , e.Expense_PaymentMethod , Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where e.Expense_Status = 1 and s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? and ss.Subscription_EndDate = ? And e.Expense_PaymentMethod = 'Annual' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY)
                          GROUP by e.Expense_ID`,[AY_ID,AY_EndDate_String,MonthsRange[m],MonthsRange[m],AY_ID,AY_EndDate_String,MonthsRange[m],MonthsRange[m]], async (err, Yearly_Total_Revenu_Grouped_By_Expenses , fields) => {
                            if(err){
                              reject(err);
                            }else{

                              var subscription_IDs = [0];

                              Yearly_Total_Revenu_Grouped_By_Expenses.map((expense)=>{
                                subscription_IDs.push(expense.Expense_ID);
                              });

                              connection.query(`Select 0 as 'SS_Status' , e.Expense_ID , e.Expense_Color , e.Expense_Label , e.Expense_PaymentMethod , 0 as 'Count_Cost' From levelexpenses le inner join expenses e on(le.Expense_ID = e.Expense_ID ) where e.Expense_Status = 1 and le.AY_ID = ? and  e.Expense_ID not in (?) GROUP by e.Expense_ID`,[AY_ID,subscription_IDs], async (err, Yearly_Total_Unsubscribed_Revenu_Grouped_By_Expenses , fields) => {

                                if(err){
                                  reject(err);
                                }else{
                                
                                    Yearly_Total_Revenu_Grouped_By_Expenses = JSON.parse((JSON.stringify(Yearly_Total_Revenu_Grouped_By_Expenses)));

                                    Yearly_Total_Unsubscribed_Revenu_Grouped_By_Expenses = JSON.parse((JSON.stringify(Yearly_Total_Unsubscribed_Revenu_Grouped_By_Expenses)));

                                    if(Yearly_Total_Unsubscribed_Revenu_Grouped_By_Expenses.length > 0 ){
                                      Yearly_Total_Unsubscribed_Revenu_Grouped_By_Expenses.map((expense)=>{
                                        Yearly_Total_Revenu_Grouped_By_Expenses.push(expense);
                                      });
                                    }



                                    Yearly_Total_Revenu_Grouped_By_Expenses.map((expense)=>{
                                        if(expense.Expense_PaymentMethod == "Monthly"){
                                          if(expense.Expense_ID in Yearly_Total_Revenu_Grouped_By_Expenses_Obj ){
                                            Yearly_Total_Revenu_Grouped_By_Expenses_Obj[expense.Expense_ID] += expense.Count_Cost ;
                                          }else{
                                            Yearly_Total_Revenu_Grouped_By_Expenses_Obj[expense.Expense_ID] = expense.Count_Cost ;
                                          }
                                        }else{
                                          Yearly_Total_Revenu_Grouped_By_Expenses_Obj[expense.Expense_ID] = expense.Count_Cost ;
                                        }
                                    });

                                    connection.query("Select Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? and ss.Subscription_EndDate = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) ",[AY_ID,AY_EndDate_String , MonthsRange[m],MonthsRange[m]], async (err, Monthly_Total_Expected_Cost , fields) => {
                                        if(err){
                                          reject(err);
                                        }else{

                                          /** Total_Monthly_Expected Accumulation ******************************/
                                          Total_Monthly_Expected +=  Monthly_Total_Expected_Cost[0].Count_Cost;

                                          /*connection.query("Select Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? and ss.Subscription_EndDate = ? And e.Expense_PaymentMethod = 'Monthly' And (ss.SS_ID Not In (select sp.SS_ID From studentspayments sp where sp.SP_PaidPeriod = ? )) AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) ",[AY_ID,AY_EndDate_String,months[n], MonthsRange[m],MonthsRange[m]], async (err, Monthly_Expense_Cost , fields) => {*/

                                          connection.query("Select Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? and ss.Subscription_EndDate = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) ",[AY_ID,AY_EndDate_String , MonthsRange[m],MonthsRange[m]], async (err, Monthly_Expense_Cost , fields) => {

                                              if(err){
                                                reject(err);
                                              }else{ 

                                                  connection.query('select SUM(le.Expense_Cost) as `total` from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 And e.Expense_PaymentMethod = "Monthly" And MONTH( sp.`SP_Addeddate` ) = ? ', [(n+1)],  async (err, Monthly_Expense_TotalPay, fields) => {
                                                    if(err){
                                                      reject(err);
                                                    }else{

                                                        /** Total_Monthly_Expected Accumulation ******************************/
                                                        Monthly_Expense_TotalPay_ = (Monthly_Expense_TotalPay[0].total !== null ) ?  Monthly_Expense_TotalPay[0].total : 0 ;

                                                        Total_Monthly_Paid_Subscriptions +=  Monthly_Expense_TotalPay_ ;

                                                        Monthly_Expected_Incomes_Query = `Select Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and ss.SS_Status = 1 and le.AY_ID = ? and ss.Subscription_EndDate = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) and ss.SS_ID not in (SELECT sps.SS_ID from studentspayments sps inner join studentsubscribtion sts on (sps.SS_ID = sts.SS_ID) WHERE sps.SP_PaidPeriod = ? and Monthname(sps.SP_Addeddate) <> ? and sts.AY_ID = ? and sts.SS_Status = 1 )` ;
                      
                                                          connection.query(Monthly_Expected_Incomes_Query,[AY_ID,AY_EndDate_String,MonthsRange[m],MonthsRange[m],months[n],months[n],AY_ID,AY_ID,AY_EndDate_String, MonthsRange[m], MonthsRange[m],MonthsRange[m]], async (err, Monthly_Expected_Incomes , fields) => {

                                                          if(err){
                                                              reject(err);
                                                          }else{
                                                            
                                                            Month_ID = ((n+1) <=9) ? "0"+ (n+1) : (n+1)+"";
                                                            Monthly_Expense_TotalPay_ = (Monthly_Expense_TotalPay[0].total !== null ) ?  Monthly_Expense_TotalPay[0].total : 0 ;

                                                            Monthly_Expense_Cost_Percentage = ( Monthly_Expense_Cost[0].Count_Cost > 0 ) ? 
                                                                                              (Monthly_Expense_TotalPay_ * 100 ) / Monthly_Expense_Cost[0].Count_Cost : 0 ;

                                                            monthDaysCount = this.monthDays(Month_ID,String(MonthsRange[m]).split("-")[0]);
                                                            MonthDaysRange = [];
                                                            MonthDaysRangeIncomes = [];
                                                            MonthDaysRange = this.generateMonthDays(MonthsRange[m],monthDaysCount);

                                                            Annual_Expense_TotalPay_ = (Annual_Expense_TotalPay[0].total !== null ) ?  Annual_Expense_TotalPay[0].total : 0 ;

                                                            Annual_Expense_Cost_Percentage = ( Annual_Expense_Cost[0].Count_Cost > 0 ) ? 
                                                                                            (Annual_Expense_TotalPay_ * 100 ) / Annual_Expense_Cost[0].Count_Cost : 0;
                                                              
                                                                /************* getMonthlyIncomesPerDay ***********/

                                                                await this.getMonthlyIncomesPerDay(AY_ID,MonthDaysRange,monthDaysCount,Monthly_Expense_Cost,Monthly_Expense_Cost_Percentage,Monthly_Expense_TotalPay_,Monthly_Expected_Incomes,Annual_Expense_Cost,Annual_Expense_TotalPay_,Annual_Expense_Cost_Percentage,Total_Monthly_Expected,Total_Annual_Expected,Total_Monthly_Paid_Subscriptions,Yearly_Total_Revenu_Grouped_By_Expenses,Yearly_Total_Revenu_Grouped_By_Expenses_Obj).then( async MonthDaysRangeIncomeData=>{

                                                                  /************* getAnnualExpenseTotalPayPerMonth ***********/
                                                                  $dataArray = [AY_ID,MonthDaysRangeIncomeData.MonthDaysRange[0],MonthDaysRangeIncomeData.MonthDaysRange[(MonthDaysRangeIncomeData.MonthDaysRange.length-1)]];

                                                                  await this.getAnnualExpenseTotalPayPerMonth($dataArray).then( async (Annual_Expense_TotalPay_Per_Month) => {

                                                                      /************* getMonthExpenseTotalPayPerMonth ***********/
                                                                      $dataArray = [MonthsRange[m],AY_ID,MonthsRange[m],MonthDaysRangeIncomeData.MonthDaysRange[0],MonthDaysRangeIncomeData.MonthDaysRange[(MonthDaysRangeIncomeData.MonthDaysRange.length-1)]];

                                                                      await this.getMonthExpenseTotalPayPerMonth($dataArray).then(async(Month_Expense_TotalPay_Per_Month) => {

                                                                          /************* getMonthlyExpectedRevenuGroupedByExpenses ***********/
                                                                          $dataArray = [
                                                                            AY_ID,AY_EndDate_String,MonthsRange[m],MonthsRange[m],months[n],months[n],AY_ID,AY_ID,AY_EndDate_String, MonthsRange[m], MonthsRange[m],MonthsRange[m],AY_ID,AY_EndDate_String, MonthsRange[m], MonthsRange[m],MonthsRange[m]
                                                                          ];

                                                                          await this.getMonthlyExpectedRevenuGroupedByExpenses($dataArray).then( async (Monthly_Expected_Revenu_Grouped_By_Expenses_Obj)=>{

                                                                            /************* getYearlyExpectedRevenuGroupedByExpenses ***********/
                                                                            $dataArray = [AY_ID , MonthsRange[m] , MonthsRange[m] ,MonthsRange[m] , MonthsRange[m]];

                                                                            await this.getYearlyExpectedRevenuGroupedByExpenses($dataArray).then(async (Yearly_Expected_Revenu_Grouped_By_Expenses_Obj)=>{

                                                                              /************* getYearlyPaidSubscriptionsGroupedByExpenses ***********/
                                                                              $dataArray = [
                                                                                MonthsRange[m],
                                                                                AY_ID,
                                                                                MonthsRange[m],MonthsRange[m],MonthsRange[m],
                                                                                MonthsRange[m],
                                                                                AY_ID,AY_ID,
                                                                                MonthsRange[m],MonthsRange[m],MonthsRange[m]
                                                                              ];

                                                                              await this.getYearlyPaidSubscriptionsGroupedByExpenses($dataArray).then(async (Yearly_Paid_Subscriptions_Grouped_By_Expenses_Obj)=>{

                                                                                $dataArray =[
                                                                                  MonthsRange[m],
                                                                                  AY_ID,
                                                                                  MonthsRange[m],MonthsRange[m],MonthsRange[m],MonthsRange[m],
                                                                                  MonthsRange[m],
                                                                                  AY_ID,AY_ID,
                                                                                  MonthsRange[m],MonthsRange[m],MonthsRange[m],MonthsRange[m]
                                                                                ]
                                                                                
                                                                                  await this.getMonthlyPaidSubscriptionsGroupedByExpensesObj($dataArray).then(async (Monthly_Paid_Subscriptions_Grouped_By_Expenses_Obj)=>{

                                                                                    resolve({"Month":months[n],
                                                                                          Month_ID:(months.indexOf(months[n])*1+1),
                                                                                          "Month_Start_Date":MonthDaysRangeIncomeData.MonthDaysRange[0],
                                                                                          "Monthly_Annual_Expense_TotalPay":MonthDaysRangeIncomeData.Monthly_Expense_TotalPay_+MonthDaysRangeIncomeData.Annual_Expense_TotalPay_,
                                                                                          "Monthly_Expense_Cost": (MonthDaysRangeIncomeData.Monthly_Expense_Cost[0].Count_Cost !== null ) ?  MonthDaysRangeIncomeData.Monthly_Expense_Cost[0].Count_Cost: 0 ,
                                                                                          "Monthly_Expense_Cost_Percentage":parseFloat(MonthDaysRangeIncomeData.Monthly_Expense_Cost_Percentage).toFixed(2),
                                                                                          "Monthly_Expense_TotalPay":MonthDaysRangeIncomeData.Monthly_Expense_TotalPay_,
                                                                                          "Monthly_Expected_Incomes":(MonthDaysRangeIncomeData.Monthly_Expected_Incomes[0].Count_Cost !== null ) ?  MonthDaysRangeIncomeData.Monthly_Expected_Incomes[0].Count_Cost: 0 ,
                                                                                          "MonthsRange":MonthsRange,
                                                                                          "MonthDaysRangeNumbers":MonthDaysRangeIncomeData.MonthDaysRangeNumbers,
                                                                                          "MonthDaysRange":MonthDaysRangeIncomeData.MonthDaysRange,
                                                                                          "monthDaysCount":MonthDaysRangeIncomeData.monthDaysCount,
                                                                                          "MonthDaysRangeIncomes":MonthDaysRangeIncomeData.MonthDaysRangeIncomes,
                                                                                          "MonthDailyPayements":MonthDaysRangeIncomeData.MonthDailyPayements,
                                                                                          "Month_Expense_TotalPay_Per_Month":(Month_Expense_TotalPay_Per_Month[0].total !== null ) ?  Month_Expense_TotalPay_Per_Month[0].total : 0 ,
                                                                                          "Annual_Expense_Cost":(MonthDaysRangeIncomeData.Annual_Expense_Cost[0].Count_Cost  !== null ) ?  MonthDaysRangeIncomeData.Annual_Expense_Cost[0].Count_Cost : 0 ,
                                                                                          "Annual_Expected_Incomes": (MonthDaysRangeIncomeData.Annual_Expense_Cost[0].Count_Cost  !== null ) ?  MonthDaysRangeIncomeData.Annual_Expense_Cost[0].Count_Cost : 0 ,

                                                                                          "Annual_Expense_TotalPay":MonthDaysRangeIncomeData.Annual_Expense_TotalPay_,
                                                                                          
                                                                                          "Annual_Expense_Cost_Percentage":parseFloat(MonthDaysRangeIncomeData.Annual_Expense_Cost_Percentage).toFixed(2),
                                                                                          "Annual_Expense_TotalPay_Per_Month":(Annual_Expense_TotalPay_Per_Month[0].total !== null ) ?  Annual_Expense_TotalPay_Per_Month[0].total : 0,
                                                                                          "AnnualDaysRangeIncomes":MonthDaysRangeIncomeData.AnnualDaysRangeIncomes,
                                                                                          "AnnualDailyPayements":MonthDaysRangeIncomeData.AnnualDailyPayements,

                                                                                          "Total_Monthly_Expected":MonthDaysRangeIncomeData.Total_Monthly_Expected,
                                                                                          "Total_Annual_Expected":MonthDaysRangeIncomeData.Total_Annual_Expected,
                                                                                          "Total_Monthly_Annual_Expected":(MonthDaysRangeIncomeData.Total_Monthly_Expected+MonthDaysRangeIncomeData.Total_Annual_Expected),
                                                                                          "Total_Monthly_Paid_Subscriptions":MonthDaysRangeIncomeData.Total_Monthly_Paid_Subscriptions,
                                                                                          "Yearly_Total_Revenu_Grouped_By_Expenses":MonthDaysRangeIncomeData.Yearly_Total_Revenu_Grouped_By_Expenses,
                                                                                          "Yearly_Total_Revenu_Grouped_By_Expenses_Obj":MonthDaysRangeIncomeData.Yearly_Total_Revenu_Grouped_By_Expenses_Obj,
                                                                                          "Monthly_Expected_Revenu_Grouped_By_Expenses_Obj":Monthly_Expected_Revenu_Grouped_By_Expenses_Obj,
                                                                                          "Yearly_Expected_Revenu_Grouped_By_Expenses_Obj":Yearly_Expected_Revenu_Grouped_By_Expenses_Obj,
                                                                                          "Yearly_Paid_Subscriptions_Grouped_By_Expenses_Obj":Yearly_Paid_Subscriptions_Grouped_By_Expenses_Obj,
                                                                                          "Monthly_Paid_Subscriptions_Grouped_By_Expenses_Obj":Monthly_Paid_Subscriptions_Grouped_By_Expenses_Obj

                                                                                      });
                                                                                      /************* End resolve ***********/
                                                                                });
                                                                                /************* End getMonthlyPaidSubscriptionsGroupedByExpensesObj ***********/
                                                                              });
                                                                              /************* End getYearlyPaidSubscriptionsGroupedByExpenses ***********/
                                                                            });
                                                                            /************* End getYearlyExpectedRevenuGroupedByExpenses ***********/
                                                                          });
                                                                          /************* End getMonthlyExpectedRevenuGroupedByExpenses ***********/
                                                                      });
                                                                       /************* End getMonthExpenseTotalPayPerMonth ***********/
                                                                  });
                                                                  /************* End getAnnualExpenseTotalPayPerMonth ***********/
                                                                });
                                                                /************* End getMonthlyIncomesPerDay ***********/
                                                          }
                                                      });
                                                    }
                                                  });
                                              }
                                          });
                                        }
                                    });
                            }
                            });
                            }
                          });
                        }
                        });
                  }
                  });
                }
              });
          }));

    }

    return Promise.all(monthExpenses);

},

getAnnualExpenseTotalPayPerMonth: function(dataArray){

  return new Promise((resolve, reject) => {

    connection.query("Select Sum(le.Expense_Cost) as 'total' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' And (ss.SS_ID In (select sp.SS_ID From studentspayments sp where Date(sp.SP_Addeddate) Between ? And ?  )) ",dataArray, async (err, Annual_Expense_TotalPay_Per_Month , fields) => {
            if(err){
                reject(err);
            }else{ 
              resolve(Annual_Expense_TotalPay_Per_Month);
            }
        });
  })

},

getMonthExpenseTotalPayPerMonth: function(dataArray){

  return new Promise((resolve, reject) => {

    console.log("getMonthExpenseTotalPayPerMonth dataArray ==> ",dataArray);

    connection.query('select SUM(le.Expense_Cost) as `total` , MonthName(?) as MonthName_ from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where le.AY_ID = ? And s.Student_Status = 1 and  ss.SS_Status = 1 And e.Expense_PaymentMethod = "Monthly" And sp.SP_PaidPeriod = MonthName(?) And (Date(sp.SP_Addeddate) Between ? And ? )',dataArray, async (err, Month_Expense_TotalPay_Per_Month, fields) => {
            if(err){
                reject(err);
            }else{ 
              resolve(Month_Expense_TotalPay_Per_Month);
            }
        });
  })

},

getMonthlyExpectedRevenuGroupedByExpenses: function(dataArray){

  return new Promise((resolve, reject) => {

    connection.query("Select e.Expense_ID , e.Expense_Label , e.Expense_Color  , Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and ss.SS_Status = 1 and le.AY_ID = ? and ss.Subscription_EndDate = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) and ss.SS_ID not in (SELECT sps.SS_ID from studentspayments sps inner join studentsubscribtion sts on (sps.SS_ID = sts.SS_ID) WHERE sps.SP_PaidPeriod = ? and Monthname(sps.SP_Addeddate) <> ? and sts.AY_ID = ? and sts.SS_Status = 1 ) Group By e.Expense_ID , e.Expense_Label",dataArray, async (err, Monthly_Expected_Revenu_Grouped_By_Expenses_Obj , fields) => {
            if(err){
                reject(err);
            }else{ 
              resolve(Monthly_Expected_Revenu_Grouped_By_Expenses_Obj);
            }
        });
  })

},

getYearlyExpectedRevenuGroupedByExpenses: function(dataArray){

  return new Promise((resolve, reject) => {

    connection.query("Select e.Expense_ID , e.Expense_Label , e.Expense_Color  , Sum(le.Expense_Cost) as 'Count_Cost' From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) And MONTH(ss.Subscription_AddedDate) = Month(?) Group By e.Expense_ID , e.Expense_Label",dataArray, async (err, Yearly_Expected_Revenu_Grouped_By_Expenses_Obj , fields) => {
            if(err){
                reject(err);
            }else{ 
              resolve(Yearly_Expected_Revenu_Grouped_By_Expenses_Obj);
            }
        });
  })

},

getYearlyPaidSubscriptionsGroupedByExpenses: function(dataArray){

  return new Promise((resolve, reject) => {

        connection.query(`select e.Expense_ID , e.Expense_Label , e.Expense_Color , SUM(le.Expense_Cost) as 'total' , MonthName(?) as MonthName_ from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where le.AY_ID = ? And s.Student_Status = 1 and  ss.SS_Status = 1 And e.Expense_PaymentMethod = "Annual" And (Date(sp.SP_Addeddate) Between ? And DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY))
        GROUP By e.Expense_ID , e.Expense_Label
        union  
        select e.Expense_ID , e.Expense_Label , e.Expense_Color , 0 as 'total' , MonthName(?) as MonthName_ from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where le.AY_ID = ? And s.Student_Status = 1 and  ss.SS_Status = 1 And e.Expense_PaymentMethod = "Annual" and e.Expense_ID  not in (select e.Expense_ID from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where le.AY_ID = ? And s.Student_Status = 1 and  ss.SS_Status = 1 And e.Expense_PaymentMethod = "Annual" And (Date(sp.SP_Addeddate) Between ? And DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY))
        GROUP By e.Expense_ID , e.Expense_Label)
        
        GROUP By e.Expense_ID , e.Expense_Label`,dataArray, async (err, Yearly_Paid_Subscriptions_Grouped_By_Expenses_Obj , fields) => {
            if(err){
                reject(err);
            }else{ 
              resolve(Yearly_Paid_Subscriptions_Grouped_By_Expenses_Obj);
            }
        });
  })

},

getMonthlyPaidSubscriptionsGroupedByExpensesObj: function(dataArray){

  return new Promise((resolve, reject) => {

    connection.query(`select e.Expense_ID , e.Expense_Label, e.Expense_Color  , SUM(le.Expense_Cost) as 'total' , MonthName(?) as MonthName_ from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where le.AY_ID = ? And s.Student_Status = 1 and  ss.SS_Status = 1 And e.Expense_PaymentMethod = "Monthly" And sp.SP_PaidPeriod = MonthName(?) And (Date(sp.SP_Addeddate) Between ? And DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY))
    GROUP By e.Expense_ID , e.Expense_Label
    union  
    select e.Expense_ID , e.Expense_Label , e.Expense_Color , 0 as 'total' , MonthName(?) as MonthName_ from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where le.AY_ID = ? And s.Student_Status = 1 and  ss.SS_Status = 1 And e.Expense_PaymentMethod = "Monthly" and e.Expense_ID  not in (select e.Expense_ID from studentsubscribtion as ss inner join levelexpenses le on (le.LE_ID = ss.LE_ID ) inner join studentspayments sp on (ss.SS_ID = sp.SS_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) where le.AY_ID = ? And s.Student_Status = 1 and  ss.SS_Status = 1 And e.Expense_PaymentMethod = "Monthly" And sp.SP_PaidPeriod = MonthName(?) And (Date(sp.SP_Addeddate) Between ? And DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY))
    GROUP By e.Expense_ID , e.Expense_Label)
    
    GROUP By e.Expense_ID , e.Expense_Label`,dataArray, async (err, Monthly_Paid_Subscriptions_Grouped_By_Expenses_Obj , fields) => {
            if(err){
                reject(err);
            }else{ 
              resolve(Monthly_Paid_Subscriptions_Grouped_By_Expenses_Obj);
            }
        });
  })

},

getMonthlyIncomesPerDay: async function(AY_ID,MonthDaysRange,monthDaysCount,Monthly_Expense_Cost,Monthly_Expense_Cost_Percentage,Monthly_Expense_TotalPay_,Monthly_Expected_Incomes,Annual_Expense_Cost,Annual_Expense_TotalPay_,Annual_Expense_Cost_Percentage,Total_Monthly_Expected,Total_Annual_Expected,Total_Monthly_Paid_Subscriptions,Yearly_Total_Revenu_Grouped_By_Expenses,Yearly_Total_Revenu_Grouped_By_Expenses_Obj) {

  MonthDaysRangeIncomes =[];
  MonthDayNumber = [];

  for(dy=0;dy<monthDaysCount;dy++){

  MonthDaysRangeIncomes.push(new Promise((resolve, reject) => {

      //  and e.Expense_PaymentMethod = 'Monthly' : only monthly
      connection.query("Select Count(1) as 'Count_Payement' , 'Monthly' as 'Period' , Sum(le.Expense_Cost) as 'Count_Cost' , ? as 'Day' , DAY(?) as DayOfMonth From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID )  inner join studentspayments sp on (sp.SS_ID = ss.SS_ID)  where s.Student_Status = 1 and ss.SS_Status = 1 and le.AY_ID = ? And Date(sp.SP_Addeddate) = ? and e.Expense_PaymentMethod = 'Monthly' and sp.SP_Status = 1 union  Select Count(1) as 'Count_Payement' , 'Annual' as 'Period' , Sum(le.Expense_Cost) as 'Count_Cost' , ? as 'Day' , DAY(?) as DayOfMonth From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentspayments sp on (sp.SS_ID = ss.SS_ID) where s.Student_Status = 1 and ss.SS_Status = 1 and le.AY_ID = ? And Date(sp.SP_Addeddate) = ? and e.Expense_PaymentMethod = 'Annual' and sp.SP_Status = 1",[MonthDaysRange[dy] ,MonthDaysRange[dy] , AY_ID,MonthDaysRange[dy],MonthDaysRange[dy] ,MonthDaysRange[dy] , AY_ID,MonthDaysRange[dy]], (err, IncomesPerDays , fields) => {
          if (err){
          reject(err);
        } else { 
          IncomesPerDays[0].Count_Cost = (IncomesPerDays[0].Count_Cost !== null ) ?  IncomesPerDays[0].Count_Cost : 0 ;
          resolve(JSON.parse(JSON.stringify(IncomesPerDays)));
        }
    });
  }));
  
}

return Promise.all(MonthDaysRangeIncomes).then(data=> { 

  MonthDaysRangeIncomes = [];
  MonthDailyPayements = [];
  MonthDaysRangeNumbers = [];

  AnnualDaysRangeIncomes = [];
  AnnualDailyPayements = [];

  data.map((dt)=>{

    dt.map((subDt)=>{

    if(subDt.Period == "Monthly"){
      MonthDaysRangeIncomes.push(subDt.Count_Cost);
      MonthDailyPayements.push(subDt.Count_Payement);
    }

    if(subDt.Period == "Annual"){
      subDt.Count_Cost = (subDt.Count_Cost !== null ) ? subDt.Count_Cost : 0 ;
      AnnualDaysRangeIncomes.push(subDt.Count_Cost);
      AnnualDailyPayements.push(subDt.Count_Payement);
    }

  })

    MonthDaysRangeNumbers.push((dt[0].DayOfMonth <= 9 ) ? ("0"+dt[0].DayOfMonth) : ""+dt[0].DayOfMonth);

  })

  for(e = 0 ; e < Yearly_Total_Revenu_Grouped_By_Expenses.length ; e++ ){
      Object.keys(Yearly_Total_Revenu_Grouped_By_Expenses_Obj).map((key, index)=>{
        if(Yearly_Total_Revenu_Grouped_By_Expenses[e].Expense_ID == key  ){
          Yearly_Total_Revenu_Grouped_By_Expenses[e].Count_Cost = Yearly_Total_Revenu_Grouped_By_Expenses_Obj[key];
        }
    });
  }

  monthlyIncomesPerDayData = {"MonthDaysRangeIncomes":MonthDaysRangeIncomes,// Per Day
                              "MonthDaysRangeNumbers":MonthDaysRangeNumbers,
                              "MonthDaysRange":MonthDaysRange,
                              "monthDaysCount":monthDaysCount,
                              "MonthDailyPayements":MonthDailyPayements,
                              "Monthly_Expense_Cost":Monthly_Expense_Cost,
                              "Monthly_Expense_Cost_Percentage":Monthly_Expense_Cost_Percentage,
                              "Monthly_Expense_TotalPay_":Monthly_Expense_TotalPay_,
                              "Monthly_Expected_Incomes":Monthly_Expected_Incomes,
                              "Annual_Expense_Cost":Annual_Expense_Cost,
                              "Annual_Expense_TotalPay_":Annual_Expense_TotalPay_,
                              "Annual_Expense_Cost_Percentage":Annual_Expense_Cost_Percentage,
                              "AnnualDaysRangeIncomes":AnnualDaysRangeIncomes,
                              "AnnualDailyPayements":AnnualDailyPayements,
                              "Total_Monthly_Expected":Total_Monthly_Expected,
                              "Total_Annual_Expected":Total_Annual_Expected,
                              "Total_Monthly_Paid_Subscriptions":Total_Monthly_Paid_Subscriptions,
                              "Yearly_Total_Revenu_Grouped_By_Expenses":Yearly_Total_Revenu_Grouped_By_Expenses,
                              "Yearly_Total_Revenu_Grouped_By_Expenses_Obj":Yearly_Total_Revenu_Grouped_By_Expenses_Obj
                            };

  return monthlyIncomesPerDayData;

})

},

/****** getStudentMonthlySubscriptions All months */
getStudentMonthlySubscriptions: function(AY_ID,AY_YearStart,AY_YearEnd,AY_SatrtDate,AY_EndDate,Institution_ID,Month_ID){

  studentMonthlySubscriptions = [];

  AY_SatrtDate = months.indexOf(AY_SatrtDate)+1;
  AY_SatrtDate = (AY_SatrtDate <= 9 ) ? ""+AY_SatrtDate : AY_SatrtDate;
  AY_SatrtDateRange = (AY_SatrtDate <= 9 ) ? "0"+AY_SatrtDate : AY_SatrtDate;

  AY_EndDate_String = AY_EndDate;
  AY_EndDate = months.indexOf(AY_EndDate)+1;
  AY_EndDate = (AY_SatrtDate <= 9 ) ? ""+AY_EndDate : AY_EndDate;
  AY_EndDateRange = (AY_SatrtDate <= 9 ) ? "0"+AY_EndDate : AY_EndDate;

  MonthsRange = this.generateMonthsBetween2Days(AY_YearStart + "-" + AY_SatrtDateRange + "-" + "01", AY_YearEnd + "-" + AY_EndDateRange + "-" + "31");
  
  console.log("MonthsRange=>", MonthsRange);

  for (let m = 0; m < MonthsRange.length; m++) {

        // student 	Subscription_StartDate <= Month
        studentMonthlySubscriptions.push(new Promise( (resolve, reject) => {

            var d = new Date(MonthsRange[m]);
            var n = d.getMonth();

            connection.query(`SELECT st.SS_ID , st.Student_ID , st.Student_FirstName , st.Student_LastName , st.Classe_Label , Month(?) as 'Month_ID' , MonthName(?) as 'Month' , sum(st.Count_Cost) as 'Count_Cost' from (
                  Select ss.SS_ID , s.Student_ID , s.Student_FirstName , s.Student_LastName , Sum(le.Expense_Cost) as 'Count_Cost' , c.Classe_Label From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
                  where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) AND stdc.SC_Status = 1 and c.Classe_Status = 1
                  group by s.Student_ID
              UNION
                  Select ss.SS_ID , s.Student_ID , s.Student_FirstName , s.Student_LastName , Sum(le.Expense_Cost) as 'Count_Cost'  , c.Classe_Label From  studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
                  where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) And MONTH(ss.Subscription_AddedDate) = Month(?)  AND stdc.SC_Status = 1 and c.Classe_Status = 1
              group by s.Student_ID
              ) as st 
              group by st.Student_ID`,[MonthsRange[m],MonthsRange[m],AY_ID,MonthsRange[m],MonthsRange[m],AY_ID,MonthsRange[m],MonthsRange[m],MonthsRange[m]],  async (err, studentMonthlySubscriptionsList, fields) => {
              if(err){
                reject(err);
              }else{
                  if(studentMonthlySubscriptionsList.length > 0){
                  connection.query(`SELECT expenses.Expense_Label , expenses.Expense_Color  , expenses.Expense_PaymentMethod , students.Student_Image , students.Student_FirstName , students.Student_LastName , students.Student_ID , levelexpenses.Expense_Cost , Month(studentspayments.SP_Addeddate) as "Month" , ? as 'monthlySubscriptionsCost' , studentspayments.SP_Addeddate,studentspayments.SP_PaidPeriod,classes.Classe_Label FROM students LEFT JOIN studentsubscribtion ON studentsubscribtion.Student_ID = students.Student_ID LEFT JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID LEFT JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID LEFT JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID  inner join expenses on(expenses.Expense_ID = levelexpenses.Expense_ID )
                  WHERE students.Student_Status = 1 and 
                  Institution_ID = ? and Date(studentspayments.SP_Addeddate) between ? and DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) 
                  Order By studentspayments.SP_Addeddate Desc`,[studentMonthlySubscriptionsList[0].Count_Cost,Institution_ID,MonthsRange[m],MonthsRange[m],MonthsRange[m]],  async (err, studentspaymentsList , fields) => {
                      if(err){
                        reject(err);
                      }else{
                        resolve({"MonthName":studentMonthlySubscriptionsList[0].Month,
                                "MonthID":studentMonthlySubscriptionsList[0].Month_ID,
                                "StudentsPaymentsList":studentspaymentsList
                                });
                      }
                  });
                }else{
                  resolve({"MonthName":'',
                                "MonthID":'',
                                "StudentsPaymentsList":[]
                                });
                }
              }
            });
            
        }));

  }

  return Promise.all(studentMonthlySubscriptions);

  return Promise.all(studentMonthlySubscriptions).then( data => {
    return data.filter((stdMtSubs) => {
      return stdMtSubs.MonthID == Month_ID;
    });
  });

},

/****** getStudentMonthlySubscriptions Month By ID */

getStudentMonthlySubscriptions_current: async function(AY_ID,AY_YearStart,AY_YearEnd,AY_SatrtDate,AY_EndDate,Institution_ID,Month_ID){

  studentMonthlySubscriptions = [];

  AY_SatrtDate = months.indexOf(AY_SatrtDate)+1;
  AY_SatrtDate = (AY_SatrtDate <= 9 ) ? ""+AY_SatrtDate : AY_SatrtDate;
  AY_SatrtDateRange = (AY_SatrtDate <= 9 ) ? "0"+AY_SatrtDate : AY_SatrtDate;

  AY_EndDate_String = AY_EndDate;
  AY_EndDate = months.indexOf(AY_EndDate)+1;
  AY_EndDate = (AY_SatrtDate <= 9 ) ? ""+AY_EndDate : AY_EndDate;
  AY_EndDateRange = (AY_SatrtDate <= 9 ) ? "0"+AY_EndDate : AY_EndDate;

  MonthsRange = this.generateMonthsBetween2Days(AY_YearStart + "-" + AY_SatrtDateRange + "-" + "01", AY_YearEnd + "-" + AY_EndDateRange + "-" + "31");

  var m = 0 ;

  for (let mt = 0; mt < MonthsRange.length; mt++) {
      var d = new Date(MonthsRange[mt]);
    var n = (d.getMonth() + 1);
    console.log("n =>", n);
      if ( n == Month_ID ) {
        m = mt;
        break;
      }
  }

  // student 	Subscription_StartDate <= Month
  studentMonthlySubscriptions.push(new Promise( (resolve, reject) => {

      connection.query(`SELECT st.SS_ID , st.Student_ID , st.Student_FirstName , st.Student_LastName , st.Classe_Label , Month(?) as 'Month_ID' , MonthName(?) as 'Month' , sum(st.Count_Cost) as 'Count_Cost' from (
            Select ss.SS_ID , s.Student_ID , s.Student_FirstName , s.Student_LastName , Sum(le.Expense_Cost) as 'Count_Cost' , c.Classe_Label From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
            where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) AND stdc.SC_Status = 1 and c.Classe_Status = 1
            group by s.Student_ID
        UNION
            Select ss.SS_ID , s.Student_ID , s.Student_FirstName , s.Student_LastName , Sum(le.Expense_Cost) as 'Count_Cost'  , c.Classe_Label From  studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
            where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) And MONTH(ss.Subscription_AddedDate) = Month(?)  AND stdc.SC_Status = 1 and c.Classe_Status = 1
        group by s.Student_ID
        ) as st 
        group by st.Student_ID`,[MonthsRange[m],MonthsRange[m],AY_ID,MonthsRange[m],MonthsRange[m],AY_ID,MonthsRange[m],MonthsRange[m],MonthsRange[m]],  async (err, studentMonthlySubscriptionsList, fields) => {
        if(err){
          reject(err);
        }else{
          connection.query(`SELECT expenses.Expense_Label , expenses.Expense_Color  , expenses.Expense_PaymentMethod , students.Student_Image , students.Student_FirstName , students.Student_LastName , students.Student_ID , levelexpenses.Expense_Cost , Month(studentspayments.SP_Addeddate) as "Month" , ? as 'monthlySubscriptionsCost' , studentspayments.SP_Addeddate,studentspayments.SP_PaidPeriod,classes.Classe_Label FROM students LEFT JOIN studentsubscribtion ON studentsubscribtion.Student_ID = students.Student_ID LEFT JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID LEFT JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID LEFT JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID  inner join expenses on(expenses.Expense_ID = levelexpenses.Expense_ID )
          WHERE students.Student_Status = 1 and 
          Institution_ID = ? and Date(studentspayments.SP_Addeddate) between ? and DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) 
          Order By studentspayments.SP_Addeddate Desc`,[studentMonthlySubscriptionsList[0].Count_Cost,Institution_ID,MonthsRange[m],MonthsRange[m],MonthsRange[m]],  async (err, studentspaymentsList , fields) => {
              if(err){
                reject(err);
              }else{
                resolve({"MonthName":studentMonthlySubscriptionsList[0].Month,
                          "MonthID":studentMonthlySubscriptionsList[0].Month_ID,
                          "StudentsPaymentsList":studentspaymentsList
                        });
              }
          });
        }
      });
      
  }));

  return Promise.all(studentMonthlySubscriptions);

},

saveInstitutionGallery: function(Url,Institution_ID, AY_ID) {
  return new Promise((resolve, reject) => {
   connection.query("INSERT INTO  institution_gallery(Institution_Gallery_Url, Institution_ID , AY_ID) VALUES (?,?,?);", [Url, Institution_ID, AY_ID], (err, institutionGallery, fields) => {
    if (err) reject(err);
     else resolve(institutionGallery);
   });
 })
},

saveInstitutionAmenties: function(Amenty_ID,Institution_ID, AY_ID) {
  return new Promise((resolve, reject) => {
   connection.query("INSERT INTO  institution_amenties(Amenty_ID, Institution_ID , AY_ID) VALUES (?,?,?);", [Amenty_ID, Institution_ID, AY_ID], (err, institutionAmenties, fields) => {
    if (err) reject(err);
     else resolve(institutionAmenties);
   });
 })
  },

saveInstitutionDisplaySettings: function(mtc_ID,Institution_ID, AY_ID) {
  return new Promise((resolve, reject) => {
   connection.query("INSERT INTO  institution_modules_to_display_settings(MTD_ID, Institution_ID , AY_ID) VALUES (?,?,?);", [mtc_ID, Institution_ID, AY_ID], (err, institution_modules_to_display_settings, fields) => {
    if (err) reject(err);
     else resolve(institution_modules_to_display_settings);
   });
 })
},

saveInstitutionSchedules: function(Day_ID,Status,Working_hours,Institution_ID, AY_ID) {
  return new Promise((resolve, reject) => {
   connection.query("INSERT INTO  institution_schedules(Day_ID,IS_Status,IS_Schedules,Institution_ID,AY_ID) VALUES (?,?,?,?,?);", [Day_ID,Status,Working_hours,Institution_ID,AY_ID], (err, institutionSchedules, fields) => {
    if (err) reject(err);
     else resolve(institutionSchedules);
   });
 })
},

saveInstitutionBreaks: function(BreakLabel,BreakTimeStart,BreakTimeEnd,Institution_ID,AY_ID) {
  return new Promise((resolve, reject) => {
   connection.query("INSERT INTO  institution_breaks_schedule(IBS_Start_Label,IBS_Start_Time,IBS_End_Time,Institution_ID,AY_ID) VALUES (?,?,?,?,?);", [BreakLabel,BreakTimeStart,BreakTimeEnd,Institution_ID,AY_ID], (err, institutionBreaksSchedule, fields) => {
    if (err) reject(err);
     else resolve(institutionBreaksSchedule);
   });
 })
},

/****** getStudentMonthlyUnpaidSubscriptions ******/

getStudentMonthlyUnpaidSubscriptions: async function (AY_ID, AY_Period, AY_YearStart, AY_YearEnd, AY_SatrtDate, AY_EndDate, Current_Month_Date,AY) {
  
    return new Promise(async (resolve, reject) => {

        studentMonthlyUnpaidSubscriptions = [];
        AY_SatrtDate = months.indexOf(AY_SatrtDate) + 1;
        AY_SatrtDate = (AY_SatrtDate <= 9) ? "" + AY_SatrtDate : AY_SatrtDate;
        AY_SatrtDateRange = (AY_SatrtDate <= 9) ? "0" + AY_SatrtDate : AY_SatrtDate;

        AY_EndDate_String = AY_EndDate;
        AY_EndDate = months.indexOf(AY_EndDate) + 1;
        AY_EndDate = (AY_SatrtDate <= 9) ? "" + AY_EndDate : AY_EndDate;
        AY_EndDateRange = (AY_SatrtDate <= 9) ? "0" + AY_EndDate : AY_EndDate;

        MonthsRange = this.generateMonthsBetween2Days(AY_YearStart + "-" + AY_SatrtDateRange + "-" + "01", AY_YearEnd + "-" + AY_EndDateRange + "-" + "31");
      
        studentsList = await this.getAllStudents(AY_ID);

        monthByStudentObj = {};
    
        for (let s = 0; s < studentsList.length; s++) {
          
          if (studentsList[s]) {
            
            student_Id = studentsList[s].Student_ID;
            monthByStudentObj[student_Id] = await this.getSingleStudentMonthlyUnpaidSubscriptions(MonthsRange, AY_ID, studentsList[s].Student_ID, AY_Period, Current_Month_Date,AY);

            if ( student_Id in monthByStudentObj) {
              monthByStudentObj[student_Id]["Student"] = studentsList[s];
              monthByStudentObj[student_Id]["Subscriptions"] = await this.getSubscriptionsByLevelId(studentsList[s].Level_ID,AY_ID);
            }
           
          }

        }
      
        resolve(monthByStudentObj);
      
    });

},

getSingleStudentMonthlyUnpaidSubscriptions: async function (MonthsRange , AY_ID , Student_ID , AY_Period , Current_Month_Date , AY){

  studentMonthlyUnpaidSubscriptions = [];
  
  let m = 0;

  do {

    studentMonthlyUnpaidSubscriptions.push(new Promise(async (resolve, reject) => {

      var date = new Date(MonthsRange[m]);
      
      var current_Date = new Date(Current_Month_Date);
      
        var label = date.toLocaleString('en-US', { month: 'long' });
        connection.query(`SELECT st.Paid_Status , Month(?) as 'Month_ID' ,MonthName(?) as 'Month' , sum(st.Count_Cost) as 'Count_Cost' , st.Expense_Label , st.Expense_PaymentMethod , st.Expense_ID , st.Ended_Subscription
                  from (
                  Select 0 as "Ended_Subscription" , 0 as "Paid_Status" , e.Expense_Label , e.Expense_ID , e.Expense_PaymentMethod , s.Student_ID , s.Student_FirstName , s.Student_LastName , sum(le.Expense_Cost) as 'Count_Cost' , c.Classe_Label From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
                  where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) AND stdc.SC_Status = 1 and c.Classe_Status = 1 and s.Student_ID = ? and ss.SS_ID not in(SELECT sp.SS_ID from studentspayments sp where sp.SP_PaidPeriod =  MonthName(?) and sp.SS_ID = ss.SS_ID)
                  GROUP by s.Student_ID , e.Expense_Label
                  UNION
                  Select 0 as "Ended_Subscription" ,  1 as "Paid_Status" ,  e.Expense_Label  , e.Expense_ID  , e.Expense_PaymentMethod , s.Student_ID , s.Student_FirstName , s.Student_LastName , sum(le.Expense_Cost) as 'Count_Cost' , c.Classe_Label From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
                  where s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) AND stdc.SC_Status = 1 and c.Classe_Status = 1 and s.Student_ID = ? and ss.SS_ID in(SELECT sp.SS_ID from studentspayments sp where sp.SP_PaidPeriod =  MonthName(?) and sp.SS_ID = ss.SS_ID)
                  GROUP by s.Student_ID , e.Expense_Label
                  UNION
                  Select 1 as "Ended_Subscription" , 0 as "Paid_Status" ,  e.Expense_Label  , e.Expense_ID  , e.Expense_PaymentMethod , s.Student_ID , s.Student_FirstName , s.Student_LastName , sum(le.Expense_Cost) as 'Count_Cost' , c.Classe_Label From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
                  where s.Student_Status = 1 and  ss.SS_Status = 0 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) AND stdc.SC_Status = 1 and c.Classe_Status = 1 and s.Student_ID = ? 
                  and ss.Subscription_EndDate >= ?
                  and ss.SS_ID not in(SELECT sp.SS_ID from studentspayments sp where sp.SP_PaidPeriod =  MonthName(?) and sp.SS_ID = ss.SS_ID) 
                  GROUP by s.Student_ID , e.Expense_Label
                  UNION
                  Select 1 as "Ended_Subscription" , 1 as "Paid_Status" ,  e.Expense_Label  , e.Expense_ID  , e.Expense_PaymentMethod , s.Student_ID , s.Student_FirstName , s.Student_LastName , sum(le.Expense_Cost) as 'Count_Cost' , c.Classe_Label From studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
                  where s.Student_Status = 1 and  ss.SS_Status = 0 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Monthly' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) AND stdc.SC_Status = 1 and c.Classe_Status = 1 and s.Student_ID = ? 
                  and ss.Subscription_EndDate >= ?
                  and ss.SS_ID in(SELECT sp.SS_ID from studentspayments sp where sp.SP_PaidPeriod =  MonthName(?) and sp.SS_ID = ss.SS_ID) 
                  GROUP by s.Student_ID , e.Expense_Label
                  UNION
                  Select 0 as "Ended_Subscription" ,  0 as "Paid_Status" ,  e.Expense_Label  , e.Expense_ID  , e.Expense_PaymentMethod , s.Student_ID , s.Student_FirstName , s.Student_LastName , sum(le.Expense_Cost) as 'Count_Cost'  , c.Classe_Label From  studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
                  where 
                  s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) AND stdc.SC_Status = 1 and c.Classe_Status = 1 and s.Student_ID = ? and ss.SS_ID not in(
                  SELECT sp.SS_ID from studentspayments sp where sp.SP_PaidPeriod = ? and sp.SS_ID = ss.SS_ID)
                  GROUP by s.Student_ID , e.Expense_Label 
                  UNION
                  Select 0 as "Ended_Subscription" , 1 as "Paid_Status" ,  e.Expense_Label  , e.Expense_ID , e.Expense_PaymentMethod , s.Student_ID , s.Student_FirstName , s.Student_LastName , sum(le.Expense_Cost) as 'Count_Cost'  , c.Classe_Label From  studentsubscribtion as ss inner join levelexpenses le on(ss.LE_ID = le.LE_ID) inner join expenses e on(le.Expense_ID = e.Expense_ID ) inner join students s on (s.Student_ID = ss.Student_ID ) inner join studentsclasses stdc on(s.Student_ID = stdc.Student_ID ) inner join classes c on(stdc.Classe_ID = c.Classe_ID) 
                  where 
                  s.Student_Status = 1 and  ss.SS_Status = 1 and le.AY_ID = ? And e.Expense_PaymentMethod = 'Annual' AND Date(ss.Subscription_AddedDate) < DATE_ADD(?,INTERVAL day(date_sub(last_day(?),INTERVAL 1 DAY)) DAY) AND stdc.SC_Status = 1 and c.Classe_Status = 1 and s.Student_ID = ? and ss.SS_ID in(
                  SELECT sp.SS_ID from studentspayments sp where sp.SP_PaidPeriod = ? and sp.SS_ID = ss.SS_ID)
                  GROUP by s.Student_ID , e.Expense_Label 
                  )
                  as st GROUP by st.Student_ID , st.Expense_Label`,
                  [ MonthsRange[m], MonthsRange[m], AY_ID, MonthsRange[m], MonthsRange[m], Student_ID, MonthsRange[m],
                    AY_ID, MonthsRange[m], MonthsRange[m], Student_ID, MonthsRange[m],
                    AY_ID, MonthsRange[m], MonthsRange[m], Student_ID, MonthsRange[m], MonthsRange[m],
                    AY_ID, MonthsRange[m], MonthsRange[m], Student_ID, MonthsRange[m], MonthsRange[m],
                    AY_ID, MonthsRange[m], MonthsRange[m], Student_ID, AY_Period,
                    AY_ID, MonthsRange[m], MonthsRange[m], Student_ID, AY_Period
                  ]
        , async (err, studentUnpaidSubscriptionsPerMonth, fields) => {
                            
            if (err) {
              reject(err);
            } else {
              resolve({
                "Month": label, "SubscriptionsPerMonth": studentUnpaidSubscriptionsPerMonth, "Date": date, "Current": current_Date,
                academic_Year:AY,"DateCompare": (date.getTime() <= current_Date.getTime())
              });
            }
          
          }
        );
        
    }));

    m++;

  } while ( m < MonthsRange.length );
      
  return Promise.all(studentMonthlyUnpaidSubscriptions).then((data) => {

    let totalCosts = 0;
    data.map((dt) => {
      if (dt.DateCompare) {
        dt.SubscriptionsPerMonth.map((Subscription) => {
          if (Subscription.Paid_Status == 0) {
            totalCosts += Subscription.Count_Cost;
          }
        });
        
      }
    });

    return {
      "BillingArchive": data,
      "TotalCosts": totalCosts
    }

  });
  
},

getSingleStudentPaidSubscriptionsPerMonth: async function (Institution_ID , Student_ID , SP_Addeddate){

    return new Promise(async (resolve, reject) => {
      
        var label = date.toLocaleString('en-US', { month: 'long' });
        connection.query(`SELECT levelexpenses.Expense_Cost , expenses.* , 
                          studentspayments.SP_Addeddate, studentspayments.SP_PaidPeriod,classes.Classe_Label FROM 
                          students LEFT JOIN studentsubscribtion ON studentsubscribtion.Student_ID = students.Student_ID LEFT JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID LEFT JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID LEFT JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID INNER JOIN levels ON(levels.Level_ID = levelexpenses.Level_ID) 
                          INNER JOIN expenses on (expenses.Expense_ID = levelexpenses.Expense_ID )
                          WHERE Institution_ID= ? and studentsubscribtion.Student_ID = ? AND
                          date(studentspayments.SP_Addeddate) = date(?)
                          Order By studentspayments.SP_Addeddate Desc`,
        [Institution_ID , Student_ID , SP_Addeddate]
        , async (err, singleStudentPaidSubscriptionsPerMonth, fields) => {
                            
            if (err) {
              reject(err);
            } else {
              resolve(singleStudentPaidSubscriptionsPerMonth);
            }
            
          }
        );
        
    });
  
},

/****** getNotificationModuleExtraInfo */

getNotificationModuleExtraInfo : async (Notifications,Path_Url,AY_ID,Institution_ID,Notification_ID) =>{

  /*
    DashBoard => 1  , Students => 2 , Teachers => 3 , Homeworks => 4 ,
    Exams => 5 , Finance => 6 , Settings => 7 , Attitude => 8 ,
    Absence => 9 , Retard => 10 , Grade => 11 , Website => 12 , Invoice => 13 

    Note : For Finance / Invoice we use Month_ID as Notification_Inserted_Module_ID.

  */
 
  Notification_Promise = [];

  Notifications.map( async (notif)=>{

      Notification_Promise.push(new Promise( async (resolve, reject) => {

          if(notif.Module_ID == 4 ) { // Homework

              notification = {};

              connection.query("Select h.* , sub.* , u.* from homeworks h inner join teachersubjectsclasses tsc on(tsc.TSC_ID = h.TSC_ID ) inner join subjects sub on (sub.Subject_ID = tsc.Subject_ID ) INNER JOIN users u ON(u.User_ID = tsc.Teacher_ID ) where tsc.TSC_Status	= 1 AND sub.Subject_Status = 1 AND Homework_ID = ? ", [notif.Notification_Inserted_Module_ID], async (err, modules , fields) => {
                    if (err) {
                        reject(err);
                      } else 
                      {
                        connection.query("SELECT * FROM homeworks_attachement WHERE HA_Status <> '0' AND  Homework_ID = ? ", [notif.Notification_Inserted_Module_ID], async  (err, homework_Attachements , fields) => {
                          
                          if (err) {
                            reject(err);
                          } else  {

                            Notification_Attachements=[];

                            for(f = 0 ; f < homework_Attachements.length ; f++){
                                Notification_Attachements.push({
                                    FileName : homework_Attachements[f].Homework_Title,
                                    Url: Path_Url+homework_Attachements[f].Homework_Link
                                })
                            }

                            if(modules.length > 0 ){

                              var name = JSON.parse(modules[0].User_Name);

                              if (name.first_name){
                                name = name.first_name + " " + name.last_name;
                              }else{
                                 name = modules[0].User_Name ;
                              }

                              notification = {
                                Notification_Content:modules[0].Homework_Deatils,
                                Notification_Title:modules[0].Homework_Title,
                                Notification_Deleted_Status:modules[0].Homework_Status,
                                Notification_Type:'Homework',
                                Homework_DeliveryDate:modules[0].Homework_DeliveryDate,
                                Homework_Addeddate:modules[0].Homework_Addeddate,
                                Subject_Label:modules[0].Subject_Label,
                                Subject_Color:modules[0].Subject_Color,
                                By_User_Name:name,
                                By_User_Gender:modules[0].User_Gender
                              }                              
  
                              if( Notification_Attachements.length > 0 ){
                                notification["Notification_Attachements"] = Notification_Attachements;
                              }

                              for (const property in notif) {
                                if(property == 'User_ImageUrl' ){
                                  notification[property] = String(notif[property]);
                                }
                                notification[property] = notif[property];
                              }

                              if(Notification_ID != -1) {
                                notification["Notification_Content"] = modules[0].Homework_Deatils;
                              } else {
                                 notification["Notification_Content"] = "";
                              }
                              
                              notification["User_ImageUrl"] = "";
                              resolve(notification);

                            }

                          }

                        });

                      }

                  });
          }
          else if(notif.Module_ID == 5 ) { // Exams

            notification = {};

            connection.query("Select e.* , sub.* , u.* from exams e inner join teachersubjectsclasses tsc on(tsc.TSC_ID = e.TSC_ID ) inner join subjects sub on (sub.Subject_ID = tsc.Subject_ID ) INNER JOIN users u ON(u.User_ID = tsc.Teacher_ID ) where tsc.TSC_Status	= 1 AND sub.Subject_Status = 1 AND Exam_ID = ? ", [notif.Notification_Inserted_Module_ID], async (err, modules , fields) => {
                  if (err) {
                      reject(err);
                    } else 
                    {
                        if(modules.length > 0 ){

                          var name = JSON.parse(modules[0].User_Name);
                              
                          if (name.first_name){
                            name = name.first_name + " " + name.last_name;
                          }else{
                             name = modules[0].User_Name ;
                          }

                          notification = {
                            Notification_Content:modules[0].Exam_Deatils,
                            Notification_Title:modules[0].Exam_Title,
                            Notification_Deleted_Status:modules[0].Exam_Status,
                            Notification_Type:'Exam',
                            Exam_Date:modules[0].Exam_Date,
                            Exam_Addeddate:modules[0].Exam_Addeddate,
                            Subject_Label:modules[0].Subject_Label,
                            Subject_Color:modules[0].Subject_Color,
                            By_User_Name:name,
                            By_User_Gender:modules[0].User_Gender
                          }

                          for (const property in notif) {
                            if(property == 'User_ImageUrl' ){
                              notification[property] = String(notif[property]);
                            }
                            notification[property] = notif[property];
                          }

                          if(Notification_ID != -1) {
                            notification["Notification_Content"] = modules[0].Exam_Deatils;
                          } else {
                              notification["Notification_Content"] = "";
                          }

                          notification["User_ImageUrl"] = "";
                          resolve(notification);

                        }

                    }

                });
          }else if(notif.Module_ID == 8 ) { // Attitude

            notification = {};

            connection.query("Select a.* , u.* from attitude a inner join studentsclasses sc on(sc.Student_ID = a.Student_ID ) INNER JOIN users u ON(u.User_ID = a.Declaredby_ID ) where sc.SC_Status	= 1 AND sc.AY_ID = ?  AND Attitude_ID = ? ", [AY_ID,notif.Notification_Inserted_Module_ID], async (err, modules , fields) => {
                  if (err) {
                      reject(err);
                    } else 
                    {
                        if(modules.length > 0 ){

                          var name = JSON.parse(modules[0].User_Name);
                              
                          if (name.first_name){
                            name = name.first_name + " " + name.last_name;
                          }else{
                             name = modules[0].User_Name ;
                          }

                          notification = {
                            Notification_Content:modules[0].Attitude_Note,
                            Notification_Deleted_Status:modules[0].Attitude_Status,
                            Notification_Type:'Attitude',
                            Notification_Attitude_Note:(modules[0].Attitude_Interaction == 0 ? 'Positive' : 'Negative'),
                            Attitude_Interaction:modules[0].Attitude_Interaction,
                            Attitude_Note:modules[0].Attitude_Note,
                            Declaredby_ID:modules[0].Declaredby_ID,
                            Attitude_Addeddate:modules[0].Attitude_Addeddate,
                            By_User_Name:name,
                            By_User_Gender:modules[0].User_Gender
                          }

                          for (const property in notif) {
                            if(property == 'User_ImageUrl' ){
                              notification[property] = String(notif[property]);
                            }
                            notification[property] = notif[property];
                          }

                          if(Notification_ID != -1) {
                            notification["Notification_Content"] = modules[0].Attitude_Note;
                          } else {
                              notification["Notification_Content"] = "";
                          }

                          notification["User_ImageUrl"] = "";
                          resolve(notification);

                        }

                    }

                });

          }else if(notif.Module_ID == 9 ) { // Absence 

            notification = {};

            connection.query("Select * from absencesanddelays where AD_ID = ? ", [notif.Notification_Inserted_Module_ID], async (err, modules , fields) => {
                  if (err) {
                      reject(err);
                    } else 
                    {
                      
                        if(modules.length > 0 ){

                          notification = {
                            Notification_Deleted_Status:modules[0].AD_Status,
                            Declaredby_ID:modules[0].Declaredby_ID
                          }

                          AD_FromTo = JSON.parse(modules[0].AD_FromTo);

                          switch(modules[0].AD_Type){

                            case 1 :{
                              notification["Notification_Type"]='Absence';
                              notification["Notification_Added_Date"]=modules[0].AD_Date;
                              notification["Notification_Absence_From_Date"]=AD_FromTo.from;
                              notification["Notification_Absence_To_Date"]=AD_FromTo.to;
                              break;
                            }
                            case 2 :{
                              notification["Notification_Type"]='Absence';
                              notification["Notification_Absence_From_Date"]=AD_FromTo.from;
                              notification["Notification_Absence_To_Date"]=AD_FromTo.to;
                              break;
                            }
                            default:{
                              break;
                            }
                          }
                         
                          for (const property in notif) {
                            if(property == 'User_ImageUrl' ){
                              notification[property] = String(notif[property]);
                            }
                            notification[property] = notif[property];
                          }

                          notification["User_ImageUrl"] = "";
                          resolve(notification);

                        }

                    }

                });
                
          } else if (notif.Module_ID == 10) { // Retard 

            notification = {};

            connection.query("Select * from absencesanddelays where AD_ID = ? ", [notif.Notification_Inserted_Module_ID], async (err, modules, fields) => {
              if (err) {
                reject(err);
              } else {
                    
                if (modules.length > 0) {

                  notification = {
                    Notification_Deleted_Status: modules[0].AD_Status,
                    Declaredby_ID: modules[0].Declaredby_ID
                  }

                  AD_FromTo = JSON.parse(modules[0].AD_FromTo);

                  switch (modules[0].AD_Type) {

                    case 0: {
                      notification["Notification_Type"] = 'Retard';
                      notification["Notification_Retard_From_Date"] = modules[0].AD_Date;
                      notification["Notification_Retard_From_Hour"] = AD_FromTo.from;
                      notification["Notification_Retard_To_Hour"] = AD_FromTo.to;
                    }

                    default: {
                      break;
                    }
                  }
                       

                  for (const property in notif) {

                    if (property == 'User_ImageUrl') {

                        notification[property] = String(notif[property]);
                        
                        if (String(notification[property]).match(/\.(jpeg|jpg|png|gif|svg)/g) == null) {
                          const base64Str = notification[property];
                          const path = './public/assets/images/profiles/'; // Add trailing slash
                          const optionalObj = { fileName: `${notification["User_Role"]}_${notification["User_ID"]}`, type: 'png' };
                          const dataImg = await base64ToImage(base64Str, path, optionalObj) // Only synchronous using
                        } else {
                          notification["User_ImageUrl"] = notification[property];
                        }
                      
                    }
                    notification[property] = notif[property];
                  }


                  notification["User_ImageUrl"] = "";
                  resolve(notification);

                }

              }

            });
          }else if(notif.Module_ID == 6 ) { // Finance

            notification = {};

              connection.query("SELECT * FROM academicyear WHERE Institution_ID = ? LIMIT 1", [Institution_ID], async (err, academic, fields) => {
                if (err) {
                  console.log('Erros', err);
                    reject(err);
                } else {

                  let date = new Date();
                  let Current_Month_Date = new Date(notif.Notification_Added_Date).toISOString().substring(0,10);

                  commonModel.getStudentMonthlyUnpaidSubscriptions(academic[0].AY_ID, academic[0].AY_Label, academic[0].AY_YearStart, academic[0].AY_YearEnd, academic[0].AY_Satrtdate, academic[0].AY_EndDate, Current_Month_Date,academic[0])
                    .then(async (studentMonthlyUnpaidSubscriptions) => {

                      notification = {
                        Notification_Content: studentMonthlyUnpaidSubscriptions[notif.User_ID]["BillingArchive"] ,
                        Notification_Title: 'Finance',
                        Notification_Type: 'Finance',
                        Notification_Month_ID : notif.Notification_Inserted_Module_ID,
                        Notification_Month_Label: months[ ((notif.Notification_Inserted_Module_ID * 1 )- 1)],
                        Current_Month_Date,
                        Subscriptions: studentMonthlyUnpaidSubscriptions[notif.User_ID]["Subscriptions"] ,
                        Notification_AY:academic[0]
                      }

                      for (const property in notif) {

                        if (property == 'User_ImageUrl') {
                          
                            notification[property] = String(notif[property]);
                            
                            if (String(notification[property]).match(/\.(jpeg|jpg|png|gif|svg)/g) == null) {
                              const base64Str = notification[property];
                              const path = './public/assets/images/profiles/'; // Add trailing slash
                              const optionalObj = { fileName: `${notification["User_Role"]}_${notification["User_ID"]}`, type: 'png' };
                              const dataImg = await base64ToImage(base64Str, path, optionalObj) // Only synchronous using
                            } else {
                              notification["User_ImageUrl"] = notification[property];
                            }
                          
                        }
                        notification[property] = notif[property];
                      }
                  
                      if(Notification_ID != -1) {
                        notification["Notification_Content"] = studentMonthlyUnpaidSubscriptions[notif.User_ID]["BillingArchive"];
                      } else {
                          notification["Notification_Content"] = [];
                      }

                      notification["User_ImageUrl"] = "";
                      resolve(notification);

                    });
                }
              });

          }else if(notif.Module_ID == 13 ) { // Invoice

              notification = {};

              connection.query("SELECT * FROM academicyear ac inner join institutions ins on(ac.Institution_ID = ins.Institution_ID) WHERE ac.Institution_ID = ? LIMIT 1", [Institution_ID], async (err, academic, fields) => {
                if (err) {
                  console.log('Erros', err);
                    reject(err);
                } else {

                  let Current_Month_Date = new Date(notif.Notification_Added_Date).toISOString().substring(0,10);

                  commonModel.getSingleStudentPaidSubscriptionsPerMonth(Institution_ID, notif.User_ID, notif.Notification_Added_Date)
                    .then(async (singleStudentPaidSubscriptionsPerMonth) => {

                      notification = {
                        Notification_Content: singleStudentPaidSubscriptionsPerMonth,
                        Notification_Title: 'Invoice',
                        Notification_Type: 'Invoice',
                        Notification_Month_ID : notif.Notification_Inserted_Module_ID,
                        Notification_Month_Label: months[ ((notif.Notification_Inserted_Module_ID * 1 )- 1)],
                        Current_Month_Date,
                        Notification_AY: academic[0],
                        Institution_ID,
                        User: notif.User_ID,
                        date_add:notif.Notification_Added_Date
                      }

                      for (const property in notif) {

                        if (property == 'User_ImageUrl') {

                            notification[property] = String(notif[property]);
                            
                            if (String(notification[property]).match(/\.(jpeg|jpg|png|gif|svg)/g) == null) {
                              const base64Str = notification[property];
                              const path = './public/assets/images/profiles/'; // Add trailing slash
                              const optionalObj = { fileName: `${notification["User_Role"]}_${notification["User_ID"]}`, type: 'png' };
                              const dataImg = await base64ToImage(base64Str, path, optionalObj) // Only synchronous using
                            } else {
                              notification["User_ImageUrl"] = notification[property];
                            }
                          
                        }
                        notification[property] = notif[property];
                      }

                      if(Notification_ID != -1) {
                        notification["Notification_Content"] = singleStudentPaidSubscriptionsPerMonth;
                      } else {
                          notification["Notification_Content"] = [];
                      }

                      notification["User_ImageUrl"] = "";
                      resolve(notification);

                    });
                }
              });

          }

      }));

  });

  return Promise.all(Notification_Promise);

},

getNotificationExtraInfo: async (req) => {

  userInfoQuery = '';
  userInfoQueryParams = [];
  
  return new Promise(async (resolve, reject) => {
   
   switch(req.body.UserInfo.role){

      case 'Student': {
       
        userInfoQuery = `Select c.Classe_Label as 'User_Class' , s.Student_Gender as 'User_Gender' ,  Concat(s.Student_FirstName,' ',s.Student_LastName) as User_Full_Name , 'Student' as User_Role , s.Student_ID as 'User_ID' ,
        n.Notification_ID , n.Notification_Read_Status , Notification_Addeddate as 'Notification_Added_Date' , n.Notification_Inserted_Module_ID ,
        m.* 
        From notifications n inner join modules m on(m.Module_ID = n.Module_ID) inner join students s on(n.User_ID = s.Student_ID) 
        inner join studentsclasses sc on(s.Student_ID = sc.Student_ID ) inner join classes c on(c.Classe_ID = sc.Classe_ID)
        Where
        m.Module_Status = 1 AND s.Student_Status = 1 AND sc.SC_Status = 1 AND c.Classe_Status = 1 AND n.User_ID = ? AND n.User_Role = ? AND sc.AY_ID = ? order by n.Notification_Addeddate Desc `;
        
        userInfoQueryParams = [req.body.UserInfo.currentUserId, req.body.UserInfo.role, req.body.UserInfo.AY_ID];
        break;
       
      }

      case 'Parent':{
        
        userInfoQuery = `Select n.Notification_ID , n.Notification_Read_Status , Date(Notification_Addeddate) as 'Notification_Added_Date' , n.Notification_Inserted_Module_ID ,
        m.* 
        From notifications n inner join modules m on(m.Module_ID = n.Module_ID) 
        Where
        m.Module_Status = 1 AND n.User_ID = ? AND n.User_Role = ? `;
       
        userInfoQueryParams = [req.body.UserInfo.currentUserId, req.body.UserInfo.role];
       
        if (req.body.CurrentUser && req.body.CurrentUser != -1 ) {
          userInfoQuery += ` AND n.Parent_Child_ID = ? `;
          userInfoQueryParams.push(req.body.CurrentUser);
        }
       
        userInfoQuery += `  order by n.Notification_Addeddate Desc  `;
        break;
       
      }
      
      default:{
        break;
      }
      
   }

    connection.query(userInfoQuery, userInfoQueryParams, async (err, Notifications, fields) => {
     
      if (err) {

        reject({
          errors: [{
            field: "failed to select info",
            errorDesc: "get User Notification Extra Info :" + err + ' ' + req.body.UserInfo.role
          }]
        });

      } else {

        if (req.body.UserInfo.role == "Student") {

          let UnreadNotificationsLength = 0;

          if (Notifications.length > 0) {
            UnreadNotificationsLength = Notifications.filter((notification) => {
              return notification.Notification_Read_Status == 0
            });
          }

          resolve({
            NotificationsLength: Notifications.length,
            UnreadNotificationsLength: UnreadNotificationsLength.length
          })

        } else if (req.body.UserInfo.role == "Parent") {

          let UnreadNotificationsLength = 0;

          if (Notifications.length > 0) {
            UnreadNotificationsLength = Notifications.filter((notification) => {
              return notification.Notification_Read_Status == 0
            });
          }
  
          resolve({
            NotificationsLength: Notifications.length,
            UnreadNotificationsLength: UnreadNotificationsLength.length
          });

        }
      }
    });
  });
},

getReceivers : function(StudentList) {

  var Receivers = [];
  var ReceiversArray = [];

  for (let m = 0; m < StudentList.Students.length; m++) {

      Receivers.push(new Promise( (resolve, reject) => {

              connection.query(StudentParents,[StudentList.Students[m].Student_ID],(err, Parents , fields) => {

                if (err) {
                  reject({ Status : 500 , Message : err });
                }else{

                  ReceiversArray = [];
                  
                  ReceiversArray.push({'User_ID': StudentList.Students[m].Student_ID , 
                  'User_Expo_Token' : StudentList.Students[m].User_Expo_Token ,
                  'User_Full_Name' : StudentList.Students[m].Student_FirstName+' '+StudentList.Students[m].Student_LastName,
                  'User_Role':'Student'
                  });

                  for(p=0;p < Parents.length;p++){
                    ReceiversArray.push({'User_ID': Parents[p].Parent_ID , 
                                    'Child_Full_Name' : StudentList.Students[m].Student_FirstName+' '+StudentList.Students[m].Student_LastName,
                                    'Parent_Child_ID':StudentList.Students[m].Student_ID,
                                    'User_Expo_Token' : Parents[p].User_Expo_Token ,
                                    'User_Role':'Parent'});
                                    
                  }

                  resolve(ReceiversArray);

                }
                
              });
              
          })
      );

  }

  return Promise.all(Receivers);

},

getStudentsList : function(AY_ID, SearchById, Module_Type) {

  StudentQuery = '';
    
  switch(Module_Type){

    case 'Homeworks' :
    case 'Exams' :{
      StudentQuery = StudentsByTscId;
      break;
    }

    case 'Attitude' :
    case 'Retard'  :
    case 'Finance' :
    case 'Invoice' :
    case 'Absence' :{
      StudentQuery = StudentsById;
      break;
    }

    default :{
      StudentQuery = StudentsById;
      break;
    }

  }

  return new Promise( async (resolve, reject) => {

      connection.query(StudentQuery,[AY_ID,SearchById],(err, Students , fields) => {

            if (err) {
              reject({ Status : 500 , Message : err });
            }else{
              resolve({Students});
            }

      });

    });

},

getModule : function(Module_Title) {

  return new Promise( async (resolve, reject) => {

    connection.query("Select * From modules Where `Module_Title` = ? LIMIT 1",[Module_Title],(err, Modules , fields) => {

          if (err) {
            reject({ Status : 500 , Message : err });
          }else{
            resolve({Modules});
          }

    });

    })
},

addNotifications:(Receiver,Receiver_Role,Notification_Inserted_Module_ID,Module_ID,Parent_Child_ID=-1)=>{

	return new Promise( async (resolve, reject) => {
    	
	    var queryNotifications ="INSERT Into notifications(User_ID,User_Role,Notification_Inserted_Module_ID,Module_ID,Parent_Child_ID) Values(?,?,?,?,?) ";

    	connection.query(queryNotifications, [Receiver,Receiver_Role,Notification_Inserted_Module_ID,Module_ID,Parent_Child_ID] , async (err, Notifications , fields) => {

		    if(err) {
		       reject(err);
		    }else{
		        console.log("add notif : ",Receiver+' '+Receiver_Role+''+Parent_Child_ID+' '+Notification_Inserted_Module_ID);
	       	  resolve(Notifications);
	       	}

  		});

    });

},

setExpoToken : function(User_ID,User_Role,User_Expo_Token) {

  switch(User_Role){

    case 'Student' : {

      return new Promise( async (resolve, reject) => {

        connection.query("Update students set `User_Expo_Token` = ? Where `Student_ID` = ? LIMIT 1",[User_Expo_Token,User_ID],(err, user, fields) => {
   
             if (err) {
               reject({ Status : 500 , Message : err });
             }else{
               resolve({Status:200});
             }
   
        });
   
       });

    }

    case 'Parent' : {

      return new Promise( async (resolve, reject) => {

        connection.query("Update parents set `User_Expo_Token` = ? Where `Parent_ID` = ? LIMIT 1",[User_Expo_Token,User_ID],(err, user, fields) => {
   
             if (err) {
               reject({ Status : 500 , Message : err });
             }else{
               resolve({Status:200});
             }
   
        });
   
       });

    }

    default : {

      return new Promise( async (resolve, reject) => {

        connection.query("Update users set `User_Expo_Token` = ? Where `User_ID` = ? LIMIT 1",[User_Expo_Token,User_ID],(err, user, fields) => {
   
             if (err) {
               reject({ Status : 500 , Message : err });
             }else{
               resolve({Status:200});
             }
   
        });
   
       });

    }

  }

},

sendPushNotification : async (expoPushToken,Title,Body) => {

  console.log("SendPushNotification ==> ",expoPushToken+' '+Title+' '+Body);

   const message = {
     to: expoPushToken,
     sound: 'default',
     title: Title,
     body: Body,
     data: { someData: 'goes here' },
   };

   await fetch('https://exp.host/--/api/v2/push/send', {
     method: 'POST',
     headers: {
       Accept: 'application/json',
       'Accept-encoding': 'gzip, deflate',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(message),
   });
},

setReadNotification : function(req,res) {

  return new Promise( async (resolve, reject) => {

     connection.query("Update notifications set `Notification_Read_Status` = 1 Where `User_ID` = ? And Notification_ID = ? LIMIT 1",[req.body.User_ID,req.body.Notification_ID],(err, user, fields) => {

          if (err) {
            reject({ Status : 500 , Message : err });
          }else{
            resolve({Status:200});
          }

    });

    });

},

getUser: function(User_ID) {

  return new Promise( async (resolve, reject) => {

    connection.query("SELECT `User_Name`,`User_Email`,`User_Phone`,`User_Image`,`User_Address`,`User_Birthdate`,User_Gender FROM `users` WHERE User_ID=?", [User_ID], (err, user, fields) => {

          if (err) {
            reject({ Status : 500 , Message : err });
          }else{
            resolve({user:user[0]});
          }

    });

  });

},

getUserSalary:function (User_ID,Institution_ID) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT eec.EEC_Cost as 'User_Salary' , eec.* FROM employees_expences_cost eec inner join internal_expences ie on(eec.Expence_ID = ie.Expence_ID) WHERE ie.Institution_ID = ? AND eec.Employe_ID = ? AND ie.Expence_Status = -1 LIMIT 1 ", [Institution_ID,User_ID], (err, salaries, fields) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(salaries)
      };
      });
  });
},

addUserSalary:function (Expence_ID,Employe_ID,EEC_Cost) {
  return new Promise((resolve, reject) => {
    connection.query("Insert Into employees_expences_cost(Expence_ID,Employe_ID,EEC_Cost) values(?,?,?) ", [Expence_ID,Employe_ID,EEC_Cost], (err, salaries, fields) => {
        if (err) {
          reject({ Status : 500 , Message : err });
        }else{
          resolve({ Status : 200 });
        }
      });
  });
},

updateUserSalary: function(Employee_Salary,Employee_Salary_EEC_ID) {
  return new Promise( async (resolve, reject) => {
    connection.query("UPDATE `employees_expences_cost` SET EEC_Cost = ? WHERE EEC_ID = ? Limit 1 ", [Employee_Salary,Employee_Salary_EEC_ID],async (err, employee, fields) => {
        if (err) {
          reject({ Status : 500 , Message : err });
        }else{
          resolve({ Status : 200 });
        }
    });
  });
},

getCurrentExpencesSalariesID : function (Institution_ID) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT Expence_ID  FROM internal_expences WHERE Institution_ID = ? AND Expence_Status = -1 LIMIT 1 ", [Institution_ID], (err, Expences, fields) => {
        if (err){
          reject(err)
        } 
        else {
          {resolve(Expences[0].Expence_ID)};
        }
        
      });
  });
},

getAllEmployees: function(Institution_ID) {

  return new Promise((resolve, reject) => {

    var notInEmployeesRoles = ["Student","Parent"];
    var employeesArray = [];

    connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [Institution_ID], (err, academic, fields) => {  
      connection.query("SELECT Distinct users.User_ID,users.User_Name,users.User_Image,users.User_Email,users.User_Phone,users.User_Role,users.User_Gender,users.User_Birthdate,users.User_Address FROM `institutionsusers` INNER JOIN users ON users.User_ID = institutionsusers.User_ID WHERE institutionsusers.`Institution_ID` = ? AND institutionsusers.User_Role not in(?) AND institutionsusers.IU_Status = 1 And users.User_Status = 1 Order By users.User_ID Desc ", [Institution_ID,notInEmployeesRoles],async (err, employees, fields) => {

        if (err){
          reject(err)
        } 
        else {

            for (var i = employees.length - 1; i >= 0; i--) { 

              const salary = await commonModel.getUserSalary(employees[i].User_ID,Institution_ID);
              
              if(salary.length > 0 ){
                employees[i]["User_Salary"] = salary[0].User_Salary;
                employees[i]["User_Salary_EEC_ID"] = salary[0].EEC_ID;
              }else{
                employees[i]["User_Salary"] = "";
                employees[i]["User_Salary_EEC_ID"] = -1 ;
              }

              employeesArray.push({'employee':employees[i]});
            }

            var functionalities = [];

            employees.map( (usr) => {
              if(!functionalities.includes(usr.User_Role)){
                functionalities.push(usr.User_Role);
              }
            });

            resolve(employeesArray);
        }

      })

    });

  });

},

getAllFunctionalities: async function(Institution_ID) {

  return new Promise( async (resolve, reject) => {

    var notInEmployeesRoles = ["Student","Parent"];
    var employeesArray = [];

    connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [Institution_ID], async (err, academic, fields) => {  
      connection.query("SELECT Distinct users.User_ID,users.User_Name,users.User_Image,users.User_Email,users.User_Phone,users.User_Role,users.User_Gender,users.User_Birthdate,users.User_Address FROM `institutionsusers` INNER JOIN users ON users.User_ID = institutionsusers.User_ID WHERE institutionsusers.`Institution_ID` = ? AND institutionsusers.User_Role not in(?) AND institutionsusers.IU_Status = 1 And users.User_Status = 1 Order By users.User_ID Desc ", [Institution_ID,notInEmployeesRoles],async (err, employees, fields) => {

        if (err){
          reject(err)
        } 
        else {

            var functionalities = [];

            employees.map( (usr) => {
              if(!functionalities.includes(usr.User_Role)){
                functionalities.push(usr.User_Role);
              }
            });

            resolve(functionalities);
            
        }

      })

    });

  });

},

/******* Institution **************/

removeInstitutionSpecialities: function (Institution_ID,AY_ID) {
  return new Promise(async (resolve, reject) => {	
    connection.query("update institution_specialities set IS_Status = 0 where Institution_ID = ? AND AY_ID = ? ",[Institution_ID,AY_ID], (err, specialities, fields) => {
      if (err) {
        reject(err)
      } else {
         resolve(specialities);
      }
    });
  });
},

saveInstitutionSpecialities: function (ISC_ID,Institution_ID,AY_ID) {
  return new Promise(async (resolve, reject) => {	
    connection.query("insert into institution_specialities(ISC_ID,Institution_ID,AY_ID) values(?,?,?)",[ISC_ID,Institution_ID,AY_ID], (err, speciality, fields) => {
      if (err) {
        reject(err)
      } else {
         resolve(speciality);
      }
    });
  });
},

saveInstitutionWebsiteInfo: function (Institution_Name,Institution_Logo,Institution_Email,Institution_Phone,Institution_Adress,Institution_Category_ID ,Institution_ID) {
  return new Promise(async (resolve, reject) => {	
    connection.query(`INSERT INTO  institutions_website_info(Institution_Name, Institution_Logo,  Institution_Email,  Institution_Phone,  Institution_Adress , Institution_Category_ID ,Institution_ID ) VALUES(?,?,?,?,?,?,?)`,[Institution_Name,Institution_Logo,Institution_Email,Institution_Phone,Institution_Adress,Institution_Category_ID ,Institution_ID], (err, speciality, fields) => {
      if (err) {
        reject(err)
      } else {
         resolve(speciality);
      }
    });
  });
},

getSubscriptionsByLevelId: (Level_ID, AY_ID) => { 
  
  return new Promise(async (resolve, reject) => {

    var querySubscriptions = "SELECT expenses.*,levelexpenses.Expense_Cost,levelexpenses.LE_ID FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID WHERE levelexpenses.Level_ID = ? AND levelexpenses.AY_ID = ?;";

    connection.query(querySubscriptions, [Level_ID, AY_ID], (err, subscriptions, fields) => {
      if (err) {
        console.log(err);
        reject({
          field: "Access denied",
          errorDesc: err
        })
      } else {
        resolve(subscriptions);
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
},
monthDays(month,year) {
  return new Date(year, month, 0).getDate();
},

generateMonthDays(monthsRange,monthDaysCount){
  monthDaysRange = [];
  for(d=1;d<=monthDaysCount;d++){
    d = ((d) <=9) ? "0"+ d : d+"";
    monthDaysRange.push(String(monthsRange).split("-")[0]+"-"+String(monthsRange).split("-")[1]+"-"+d);
  }
  return monthDaysRange;
},

base64_encode(file_){
  // read binary data
  //var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  //return new Buffer(bitmap).toString('base64');
  return file_;
},

getRandomColor(){

  $Colors = ["#d8e9ff","#d2ebdc","#e7d9ff","#f5caca","#f1e1c2","#d1f6fc","#f6f1bd",
          "#e4e0e0","#d4e8b2","#f6d6ad","#d3e2e9","#d5d0e5","#f8d3ec","#ebd2d2"];

  return $Colors[Math.floor(Math.random() * $Colors.length)];
  
  },

  
};

module.exports = commonModel;