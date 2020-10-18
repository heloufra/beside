var connection  = require('../lib/db');
var setupModel  = require('../models/setupModel');
var transporter  = require('../middleware/transporter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

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

var setupController = {
  setupView: function(req, res, next) {
    res.render('setup', { title: 'Setup'});
  },
  getSubjects: function(req, res, next) {
    connection.query("SELECT Subject_Label as id , Subject_Label as text,Subject_Color as color FROM subjects", (err, subjects, fields) => {
        res.json({
          subjects:subjects
        })
      })
  },
  setupSave: function(req, res, next) {
    var institutionsData = JSON.parse(req.body.detail);
    var academicData = JSON.parse(req.body.academic);
    var levelsData = JSON.parse(req.body.levels);
    var classesData = JSON.parse(req.body.classes);
    var subjectsData = JSON.parse(req.body.subjects);
    var expensesData = JSON.parse(req.body.expenses);
    var costsData = JSON.parse(req.body.costs);
    var password = makeid(6);
    var institutionsQuery = `INSERT INTO institutions(Institution_Name,  Institution_Logo, Institution_Link,  Institution_Email,  Institution_Phone,  Institution_wtsp) VALUES(?,?,?,?,?,?)`;
    var usersQuery = `INSERT INTO users(User_Name, User_Image, User_Email, User_Phone,User_Role) VALUES(?,?,?,?,?)`;
    var academicQuery = `INSERT INTO academicyear(AY_Label, AY_Satrtdate, AY_EndDate, Institution_ID) VALUES(?,?,?,?)`;
    var levelsQuery = `INSERT INTO levels(Level_Label, AY_ID) VALUES(?,?)`;
    var classesQuery = `INSERT INTO classes(Level_ID, Classe_Label, AY_ID) VALUES(?,?,?)`;
    // execute the insert statment
        connection.query(institutionsQuery, [institutionsData.school, institutionsData.logo,institutionsData.school + ".besideyou.ma",institutionsData.email,institutionsData.phone,institutionsData.whatsapp],async (err, institutionResult, fields) => {
          if (err) {
            console.log(err);
              res.json({
                errors: [{
                field: "Save denied",
                errorDesc: "Institution not saved"
              }]});
          } else {
             var user = await setupModel.findUser(institutionsData.email);
             var userId;
             if (user.length > 0)
              userId = user[0].User_ID;
            else
             {
                user = await setupModel.saveUser(institutionsData);
                userId = user.insertId;
             }
              connection.query("INSERT INTO `institutionsusers`(`Institution_ID`, `User_ID`, `User_Role`) VALUES (?,?,?)",[institutionResult.insertId,userId,"Admin"])
                transporter.sendMail({
                  from: 'besideyou@contact.com',
                  to: institutionsData.email,
                  subject: 'Verification Code',
                  html: '<h1>Verification Code!</h1><h4>'+ password + '</h4>'
                }, function(error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
                 bcrypt.hash(password.replace(/\s/g, ''), 10, function(err, hash) {
                    connection.query("UPDATE `users` SET `User_Password`= ? WHERE  `User_Email` = ? LIMIT 1", [hash,institutionsData.email]);
                 })
                 var token = jwt.sign({
                      email:institutionsData.email,
                    }, config.privateKey);
                  res.json({saved : true,token});
                   connection.query(academicQuery, [academicData.year,academicData.start,academicData.end,institutionResult.insertId],async (err, academicResult, fields) => {
                    if (err) {
                      console.log(err);
                        res.json({
                          errors: [{
                          field: "Save denied",
                          errorDesc: "Academic not saved"
                        }]});
                    } else 
                    {
                       console.log('Academic Id:' + academicResult.insertId);
                       console.log(levelsData.levelName);
                      if (!Array.isArray(expensesData.expenseName))
                        expensesData.expenseName = [expensesData.expenseName];
                       for (var j = expensesData.expenseName.length - 1; j >= 0; j--) {
                       console.log("Expense Time",expensesData.expenseTime[j])   
                          var expenses = await setupModel.saveExpenses(expensesData.expenseName[j],expensesData.expenseTime[j],academicResult.insertId);
                          console.log("Expenses",expenses);
                        }
                       if (!Array.isArray(levelsData.levelName))
                        levelsData.levelName = [levelsData.levelName];
                      for (var i = 0; i < levelsData.levelName.length; i++) {
                        var levelResult = await setupModel.saveLevels(levelsData.levelName[i],academicResult.insertId);
                        console.log('Level Id:' , levelResult);
                           console.log(levelsData.levelName[i]);
                            if (!Array.isArray(classesData[levelsData.levelName[i]].classeName))
                              classesData[levelsData.levelName[i]].classeName = [classesData[levelsData.levelName[i]].classeName];
                            for (var j =  0; j < classesData[levelsData.levelName[i]].classeName.length; j++) {
                               connection.query(classesQuery, [levelResult.insertId,classesData[levelsData.levelName[i]].classeName[j],academicResult.insertId], (err, classeResult, fields) => {
                                  if (err) {
                                    console.log(err);
                                      res.json({
                                        errors: [{
                                        field: "Save denied",
                                        errorDesc: "Level not saved"
                                      }]});
                                  } else 
                                  {
                                     console.log('Classe Id:' + classeResult.insertId);
                                  }
                                  // get inserted id
                                });
                            }
                            var subjectName = subjectsData[levelsData.levelName[i]];
                            if (!Array.isArray(subjectName))
                              subjectName = [subjectName];
                            for (var j =  0; j < subjectName.length; j++) {
                              var subjectID = await setupModel.saveSubjects(subjectName[j]);
                              var levelsubjectResult = await setupModel.saveLevelsSubjects(levelResult.insertId,subjectID,academicResult.insertId);
                            }
                            
                            var costsName = costsData[levelsData.levelName[i]];
                            if (!Array.isArray(costsName.costsName))
                              costsName.costsName = [costsName.costsName];
                            if (!Array.isArray(costsName.price))
                              costsName.price = [costsName.price];
                            for (var j =  0; j < costsName.costsName.length; j++) {
                              var expenseID = await setupModel.findExpenseID(costsName.costsName[j],academicResult.insertId);
                              var expenseResult = await setupModel.saveLevelExpenses(levelResult.insertId,expenseID,costsName.price[j],academicResult.insertId);
                              console.log(expenseResult);
                            }
                      }
                }
                // get inserted id
              });
          }
          console.log('Institution Id:' + institutionResult.insertId);
     
        });
  },
};

module.exports = setupController;