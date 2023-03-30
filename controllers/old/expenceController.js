var connection  = require('../lib/db');
var expenceModal  = require('../models/expenceModel');
var commonModel  = require('../models/commonModel');

var baseRoles = ['Admin','Teacher','Student','Parent'];

var root = require('../middleware/root');

var adddate = 1;
var classeID;
const readXlsxFile = require('read-excel-file/node');
var handlebars = require('handlebars');
var sendMail = require('../utils/sendmail');
var fs = require('fs');
var readHTMLFile = function(path, callback) {
                    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        }
                        else {
                            callback(null, html);
                        }
                    });
                };

var transporter  = require('../middleware/transporter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const addMonths = (date, months) => {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

const makeid = (length) => {
       var result           = '';
       var characters       = '0123456789';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          if ((i + 1) % 2 === 0)
            result += " ";
       }
       return result;
    }

var employeeController = {

  expencesView: async function(req, res, next) {

    connection.query("SELECT * FROM users WHERE User_ID = ? LIMIT 1", [req.userId], async (err, user, fields) => {

      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role = 'Admin' ", [req.userId], async (err, accounts, fields) => {

        connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status = 1 ", [req.Institution_ID,req.userId], async (err, userRoles , fields) => {  

          connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND institutionsusers.IU_Status = 1 And users.User_Status = 1 And institutionsusers.User_Role not in(?) ", [req.Institution_ID,baseRoles], async (err, users , fields) => { 

            connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? And Institution_Status = 1 LIMIT 1", [req.Institution_ID], async (err, institutions, fields) => {

              connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], async  (err, academic, fields) => {

                    var functionalities = [];
                    var users_Array = [];

                    users.map( async (usr) => {
                      if(!functionalities.includes(usr.User_Role)){
                        functionalities.push(usr.User_Role);
                      }
                      const salary = await commonModel.getUserSalary(usr.User_ID,req.Institution_ID);
                      
                      
                      if(salary.length > 0 ){
                        usr["User_Salary"] = salary[0].User_Salary;
                        usr["User_Salary_EEC_ID"] = salary[0].EEC_ID;
                      }else{
                        usr["User_Salary"] ="";
                        usr["User_Salary_EEC_ID"] = -1;
                      }

                      users_Array.push(usr);

                    });

                    const allEmployees = await commonModel.getAllEmployees(req.Institution_ID);

                    res.render('expences', { title: 'Expences' , user: user[0], institution:institutions[0],
                                            accounts, users : userRoles , role:req.role, functionalities,
                                            "employees":allEmployees
                                          });

                })
            })
          });

        })
      })
    })
  },

  getExpence:function(req, res, next) {

    connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {

        connection.query("SELECT * FROM subjects WHERE Subject_Status = 1 and Institution_ID = ? ", [req.Institution_ID] ,async (err, allsubjects, fields) => {

              connection.query("SELECT User_Name , User_Email , User_Phone , User_Image , User_Gender , User_Address , User_Role , User_Birthdate from users where User_ID = ? ", [req.query.id] ,async (err, employee , fields) => {

                var functionalities = [];

                employee.map( (usr) => {
                  if(!functionalities.includes(usr.User_Role)){
                    functionalities.push(usr.User_Role);
                  }
                });

                const salary = await commonModel.getUserSalary(req.query.id,req.Institution_ID);

                if(salary.length > 0 ){
                  employee[0]["User_Salary"] = salary[0].User_Salary;
                  employee[0]["User_Salary_EEC_ID"] = salary[0].EEC_ID;
                }else{
                  employee[0]["User_Salary"] ="";
                  employee[0]["User_Salary_EEC_ID"] = -1;
                }

                res.json({
                        functionalities,
                        employee
                });

              })

        })
    })
  },

  getAllExpences: async function(req, res, next) {

    const expences = await  expenceModal.getAllExpences(req.Institution_ID);
    const employees = await commonModel.getAllEmployees(req.Institution_ID);
    const functionalities = await commonModel.getAllFunctionalities(req.Institution_ID);
    res.json({ employees , expences , functionalities });


  },

  saveExpence: async function(req, res, next) {

      form_errors = {};

      connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], async  (err, academic, fields) => {
        connection.query("insert into internal_expences(Expence_Name,Expence_Image,Expence_Color,Expence_Type,Expence_Periode,Expence_For,Expence_For_Functionalities,Institution_ID,AY_ID) values(?,?,?,?,?,?,?,?,?)", [req.body.expence_label,req.body.expence_image,commonModel.getRandomColor(),req.body.expence_type,req.body.expence_period,req.body.expence_for,req.body.expence_for_functionality,req.Institution_ID,academic[0].AY_ID], async (err, expence, fields) => {
            if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "Cannot add it"
                }]});
            } 
            else 
            {

              //const expences = await expenceModal.getExpence(req.body.expence_label,req.Institution_ID,academic[0].AY_ID);
              //Expence_ID = expences.expences[0].Expence_ID;
              Expence_ID = expence.insertId;
              
              if(req.body.expence_for == "Employees"){
                const employeesExpenceCost = await expenceModal.saveEmployeesExpenceCost(Expence_ID,req.body.employees_list);
              }else{
                const institutionExpenceCost = await expenceModal.saveInstitutionExpenceCost(Expence_ID,req.body.expence_cost);
              }

              res.json({Added : true , Status : 200 , Expence_ID });
              
            }
        });
      });

  },

  deleteExpence: function(req, res, next) {
      connection.query("UPDATE internal_expences SET Expence_Status = 0 WHERE Expence_ID = ? Limit 1 ", [req.body.id], (err, expences , fields) => {
         if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "Cannot Remove it"
                }]});
            } else 
            {
              res.json({removed : true});
            }
      })
  },
  
  updateExpence: async function(req, res, next) {

    form_errors = {};

    connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], async  (err, academic, fields) => {

          if (err) {
            console.log(err);
              res.json({
                errors: [{
                field: "Access denied",
                errorDesc: "Cannot add it"
              }]});
          } 
          else 
          {

            Expence_ID = req.body.expence_id;
            const institutionExpence = await expenceModal.updateInstitutionExpence(req.body.expence_label,req.body.expence_image,Expence_ID);

            if(req.body.expence_for == "Employees"){
              await expenceModal.saveEmployeesExpenceCost(Expence_ID,req.body.employees_list);
            }else{
              await expenceModal.updateInstitutionExpenceCost(req.body.expence_cost,Expence_ID);
            }
            
            res.json({Edited : true , Status : 200 , Expence_ID });
            
          }
    });

  },

  executeExpencePayement: async function(req, res, next) {

    form_errors = {};

    connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], async  (err, academic, fields) => {

          if (err) {
            console.log(err);
              res.json({
                errors: [{
                field: "Access denied",
                errorDesc: "Cannot add it"
              }]});
          } 
          else 
          {

            Expence_ID = req.body.expence_id;
            const institutionExpence = await expenceModal.updateInstitutionExpence(req.body.expence_label,req.body.expence_image,Expence_ID);

            if(req.body.expence_for == "Employees"){
              await expenceModal.executeEmployeesPayement(Expence_ID,req.body.employees_list,req.body.paid_month);
            }else{
              await expenceModal.executeInstitutionPayement(req.body.expence_cost,Expence_ID,req.body.paid_month);
            }
            
            res.json({Edited : true , Status : 200 , Expence_ID });
            
          }
    });

  }
};

module.exports = employeeController ;