const { executeExpencePayement } = require('../controllers/expenceController');
var connection  = require('../lib/db');

var commonModel  = require('../models/commonModel');

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var expenceModal = {
    
  getExpence: function(Expence_label,Instituation_ID,AY_ID) {
    return new Promise( async (resolve, reject) => {
      connection.query("Select * from internal_expences where Expence_Name = ? AND Institution_ID = ? AND AY_ID = ? ", [Expence_label,Instituation_ID,AY_ID],async (err, expences , fields) => {
          if (err) {
            reject({ Status : 500 , Message : err });
          }else{
            resolve({expences});
          }
      });
    });
  },

  getAllExpences: async function(Instituation_ID) {

    var expencesArray = [];

    return new Promise( async (resolve, reject) => {
      connection.query("Select * from internal_expences where Institution_ID = ? AND Expence_Status in(1,-1) order by Expence_ID desc ", [Instituation_ID],async (err, expences , fields) => {
          if (err) {
            reject({ Status : 500 , Message : err });
          }else{
            
            connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [Instituation_ID], async (err, academic, fields) => {

                var AY_SatrtDate = months.indexOf(academic[0].AY_Satrtdate)+1;
                AY_SatrtDate = (AY_SatrtDate <= 9 ) ? ""+AY_SatrtDate : AY_SatrtDate;
                var AY_SatrtDateRange = (AY_SatrtDate <= 9 ) ? "0"+AY_SatrtDate : AY_SatrtDate;

                var AY_EndDate_String = academic[0].AY_EndDate;
                AY_EndDate = months.indexOf(academic[0].AY_EndDate)+1;
                AY_EndDate = (AY_SatrtDate <= 9 ) ? ""+AY_EndDate : AY_EndDate;
                AY_EndDateRange = (AY_SatrtDate <= 9 ) ? "0"+AY_EndDate : AY_EndDate;

                var MonthsRange = commonModel.generateMonthsBetween2Days(academic[0].AY_YearStart+"-"+AY_SatrtDateRange+"-"+"01",academic[0].AY_YearEnd+"-"+AY_EndDateRange+"-"+"31");

                for( e=0 ; e  < expences.length ; e++){

                  // For Employees
                  if(expences[e].Expence_For == "Employees"){
                    const employees = await this.getExpenceEmployeesById(Instituation_ID,expences[e].Expence_ID,expences[e],MonthsRange);
                    expences[e]["Employees"] = employees;
                  // For Institution 
                  }else{
                    const institution = await this.getExpenceInstitutionById(expences[e],MonthsRange);
                    expences[e]["Institution"] = institution ;
                  }
                }

                var monthsRangeList = [];

                MonthsRange.map((month) => {
                  date = new Date(month);
                  monthsRangeList.push(months[date.getMonth()]);
                });
                
                resolve({expences,monthsRangeList});

            });
            
          }
      });
    });
  },

  saveInstitutionExpenceCost: function(Expence_ID,Expence_Cost){
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO institution_expences_cost(Expence_ID,IEC_Cost) VALUES(?,?)", [Expence_ID,Expence_Cost], (err, expence , fields) => {
       if (err){
         reject(err);
       } 
        else{
           resolve(expence);
        }
      });
    })
  },

  updateInstitutionExpenceCost: function(Expence_Cost,Expence_ID) {
      return new Promise((resolve, reject) => {
      connection.query("Update institution_expences_cost Set IEC_Cost = ? Where Expence_ID = ? limit 1 ", [Expence_Cost,Expence_ID], (err, expence , fields) => {
        if (err){
          reject(err);
        } 
        else{
            resolve(expence);
        }
      });
    })
  },

  updateInstitutionExpence: function(Expence_Name,Expence_Image,Expence_ID) {
    return new Promise((resolve, reject) => {
    connection.query("Update internal_expences set Expence_Name = ? , Expence_Image = ?  Where  Expence_ID = ? limit 1", [Expence_Name,Expence_Image,Expence_ID], (err, expence , fields) => {
      if (err){
        reject(err);
      } 
      else{
          resolve(expence);
      }
    });
  })
  },

  saveEmployeesExpenceCost: function(Expence_ID,Employees_List) {

    employeesExpenceCostList = [];

    Employees_List.map((employee) =>{

      employeesExpenceCostList.push(new Promise( (resolve, reject) => {

         if(employee.eec_id != "-1"){

            employeeQuery ='';
            employeeQueryParams = [];
            
            if(employee.checked == "false"){
              employeeQuery = "update employees_expences_cost Set EEC_Status = 0 Where EEC_ID = ? ";
              employeeQueryParams = [employee.eec_id];
            }else{
              employeeQuery = "update employees_expences_cost Set EEC_Cost = ? Where EEC_ID = ? ";
              employeeQueryParams = [employee.cost,employee.eec_id];
            }
            
            connection.query(employeeQuery,employeeQueryParams, async (err, employeeExpenceCostList , fields) => {
              if(err){
                reject(err);
              }else{
                resolve(employeeExpenceCostList);
              }
            });
           
         }else{

          connection.query("INSERT INTO employees_expences_cost(Expence_ID,Employe_ID,EEC_Cost) VALUES(?,?,?)",[Expence_ID,employee.employee_id,employee.cost],  async (err, employeeExpenceCostList , fields) => {
            if(err){
              reject(err);
            }else{
              resolve(employeeExpenceCostList);
            }
          });

        }
          
      }));

    });
  
    return Promise.all(employeesExpenceCostList);

  },

  executeEmployeesPayement: async function(Expence_ID,Employees_List,Paid_Month) {

    employeesExpenceCostList = [];

    Employees_List.map( async (employee) =>{

      employeesExpenceCostList.push(new Promise( async (resolve, reject) => {

         if(employee.eec_id != "-1"){

            employeeQuery ='';
            executePayementAction = false;
            employeeQueryParams = [];
            
            if(employee.checked == "false"){
              employeeQuery = "update employees_expences_cost Set EEC_Status = 0 Where EEC_ID = ? ";
              employeeQueryParams = [employee.eec_id];
            }else{
              employeeQuery = "update employees_expences_cost Set EEC_Cost = ? Where EEC_ID = ? ";
              executePayementAction= true;
              employeeQueryParams = [employee.cost,employee.eec_id];
            }
            
            connection.query(employeeQuery,employeeQueryParams, async (err, employeeExpenceCostList , fields) => {
              if(err){
                reject(err);
              }else{
                if(executePayementAction){
                  await this.executeExpencePayement(employee.eec_id,employee.cost,Paid_Month);
                  resolve(employeeExpenceCostList);
                }else{
                  resolve(employeeExpenceCostList);
                }
              }
            });
           
         }else{

          connection.query("INSERT INTO employees_expences_cost(Expence_ID,Employe_ID,EEC_Cost) VALUES(?,?,?)",[Expence_ID,employee.employee_id,employee.cost],  async (err, employeeExpenceCostList , fields) => {
            if(err){
              reject(err);
            }else{
              await this.executeExpencePayement(employeeExpenceCostList.insertId,employee.cost,Paid_Month);
              resolve(employeeExpenceCostList);
            }
          });

        }
          
      }));

    });
  
    return Promise.all(employeesExpenceCostList);

  },


  executeInstitutionPayement: async function(Expence_Cost,Expence_ID,Paid_month) {
      return new Promise( async (resolve, reject) => {
      connection.query("Update institution_expences_cost Set IEC_Cost = ? Where Expence_ID = ? limit 1 ", [Expence_Cost,Expence_ID], async (err, expence , fields) => {
        if (err){
          reject(err);
        } 
        else{
          connection.query("Select * from institution_expences_cost Where Expence_ID = ? limit 1 ", [Expence_ID], async (err, currentExpence , fields) => {
            if (err){
              reject(err);
            }else{
                await this.executeExpencePayement(currentExpence[0].IEC_ID,Expence_Cost,Paid_month);
                resolve(expence);
            }
          });
        }
      });
    })
  },

  executeExpencePayement: function(Expence_ID,PE_Ammount,Paid_Month) {

      paidExpencesList = [];

      Paid_Month.map((month) =>{

        paidExpencesList.push(new Promise( (resolve, reject) => {

          connection.query("insert into paid_expences(Expence_ID,PE_Ammount,PE_Month) values(?,?,?) ", [Expence_ID,PE_Ammount,month.month_id],async (err, paid_expences , fields) => {

            if (err) {
              reject(err)
            }
            else {
              resolve(paid_expences)
            };
          });

        }));
  
      });

      return Promise.all(paidExpencesList);

  },
  
  getExpenceEmployeesById: function(Institution_ID,Expence_ID,Expence,MonthsRange) {

      return new Promise((resolve, reject) => {

        var notInEmployeesRoles = ["Student","Parent"];
        
        var employeesArray = [];
    
          connection.query("SELECT DISTINCT eec.* , users.User_ID,users.User_Name,users.User_Image,users.User_Email,users.User_Phone,users.User_Role,users.User_Gender,users.User_Birthdate,users.User_Address FROM `institutionsusers` INNER JOIN users ON users.User_ID = institutionsusers.User_ID INNER JOIN  employees_expences_cost eec on(eec.Employe_ID = users.User_ID ) WHERE institutionsusers.`Institution_ID` = ? AND institutionsusers.User_Role not in(?) AND eec.Expence_ID = ? AND institutionsusers.IU_Status = 1 And users.User_Status = 1 AND eec.EEC_Status = 1 Order By users.User_ID Desc ", [Institution_ID,notInEmployeesRoles,Expence_ID],async (err, employees, fields) => {
    
            if (err){
              {reject(err)}
            } 
            else {
    
                for (var i = employees.length - 1; i >= 0; i--) { 
    
                  const salary = await this.getEmployeeCost(employees[i].User_ID,Institution_ID,Expence_ID,employees[i].EEC_ID,MonthsRange);
                  
                  if(salary.length > 0 ){
                    employees[i]["User_Salary"] = salary[0].User_Salary;
                    employees[i]["User_Salary_EEC_ID"] = salary[0].EEC_ID;
                  }else{
                    employees[i]["User_Salary"] = "";
                    employees[i]["User_Salary_EEC_ID"] = -1 ;
                  }
                  
                  employees[i]["Expence_Payement"] = await this.getEmployeePayementStatus(Expence,salary[0].EEC_ID,MonthsRange);
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
    
  },

  getExpenceInstitutionById: function(Expence,MonthsRange) {

    return new Promise((resolve, reject) => {

        connection.query("SELECT * from institution_expences_cost where Expence_ID = ? AND IEC_Status = 1 Limit 1 ", [Expence.Expence_ID],async (err, institution , fields) => {

          if (err){
            {reject(err)}
          } 
          else {
              /******* institution Paid Expences By Period   */
              if(Expence.Expence_Periode == "Monthly"){
                institution[0]["Expence_Payement"] = await this.getInstituitionPayementStatus(Expence,institution[0].IEC_ID,MonthsRange);
                resolve(institution);
              }else{
                institution[0]["Expence_Payement"] = await this.getInstituitionPayementStatus(Expence,institution[0].IEC_ID,MonthsRange);
                resolve(institution);
              }
              /******* End institution Paid Expences By Period */
          }

        })

    });

  },

  getEmployeeCost:function (User_ID,Institution_ID,Expence_ID,EEC_ID) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT eec.EEC_Cost as 'User_Salary' , eec.* FROM employees_expences_cost eec inner join internal_expences ie on(eec.Expence_ID = ie.Expence_ID) WHERE ie.Institution_ID = ? AND eec.Employe_ID = ? AND ie.Expence_ID = ? And eec.EEC_ID = ? AND eec.EEC_Status = 1 LIMIT 1 ", [Institution_ID,User_ID,Expence_ID,EEC_ID], (err, salaries, fields) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(salaries)
          };
        });
    });
  },

  getInstituitionPayementStatus:function (Expence,IEC_ID,MonthsRange) {
    
    if(Expence.Expence_Periode == "Monthly"){

      paidExpencesList = [];

      MonthsRange.map((Month) =>{

        paidExpencesList.push(new Promise( (resolve, reject) => {

          connection.query("select count(*) as 'Expence_Paid_Status' , MonthName(?) as 'MonthString' , ? as 'MonthStart' , pe.*  From paid_expences pe where pe.Expence_ID = ? AND pe.PE_Month = Month(?) Limit 1 ", [Month,Month,IEC_ID,Month], (err, paid_expences, fields) => {
            if (err) {
              reject(err)
            }
            else {
              resolve(paid_expences[0])
            };
          });

        }));
  
      });

      return Promise.all(paidExpencesList);
        
    }else{

        return new Promise((resolve, reject) => {
            connection.query("select count(*) as 'Expence_Paid_Status' , pe.*  From paid_expences pe where pe.Expence_ID = ? Limit 1 ", [IEC_ID], (err, paid_expences, fields) => {
              if (err) {
                reject(err)
              }
              else {
                resolve(paid_expences[0])
              };
            });
        });
    }

  },

  getEmployeePayementStatus:function (Expence,EEC_ID,MonthsRange) {
    
    if(Expence.Expence_Periode == "Monthly"){

      paidExpencesList = [];

      MonthsRange.map((Month) =>{

        paidExpencesList.push(new Promise( (resolve, reject) => {

          connection.query("select count(*) as 'Expence_Paid_Status' , MonthName(?) as 'MonthString' , ? as 'MonthStart' , pe.*  From paid_expences pe where pe.Expence_ID = ? AND pe.PE_Month = Month(?) Limit 1 ", [Month,Month,EEC_ID,Month], (err, paid_expences, fields) => {
            if (err) {
              reject(err)
            }
            else {
              resolve(paid_expences[0])
            };
          });

        }));
  
      });

      return Promise.all(paidExpencesList);
    }else{
      return new Promise((resolve, reject) => {
          connection.query("select count(*) as 'Expence_Paid_Status' , pe.*  From paid_expences pe where pe.Expence_ID = ? Limit 1 ", [EEC_ID], (err, paid_expences, fields) => {
            if (err) {
              reject(err)
            }
            else {
              resolve(paid_expences[0])
            };
          });
      });
    }
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

module.exports = expenceModal;