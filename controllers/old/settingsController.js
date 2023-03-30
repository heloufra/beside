var connection  = require('../lib/db');
var settingModel  = require('../models/settingModel');
var commonModel  = require('../models/commonModel');

var getRandomColor = () => {

  $subjectColors = ["#d8e9ff","#d2ebdc","#e7d9ff","#f5caca","#f1e1c2","#d1f6fc","#f6f1bd",
          "#e4e0e0","#d4e8b2","#f6d6ad","#d3e2e9","#d5d0e5","#f8d3ec","#ebd2d2"];

  return $subjectColors[Math.floor(Math.random() * $subjectColors.length)];
  
}

var date = new Date();
var PaymentsQuery = 'SELECT students.*,levelexpenses.Expense_Cost , studentspayments.SP_Addeddate,studentspayments.SP_PaidPeriod,classes.Classe_Label FROM `students` LEFT JOIN studentsubscribtion ON studentsubscribtion.Student_ID = students.Student_ID LEFT JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID LEFT JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID LEFT JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID  WHERE `Institution_ID`= ?'
var AdTeacher = "SELECT DISTINCT users.*, absencesanddelays.* FROM `absencesanddelays` LEFT JOIN users ON users.User_ID = absencesanddelays.User_ID LEFT JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID LEFT JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID WHERE institutionsusers.Institution_ID = ? AND absencesanddelays.User_Type ='teacher'";
var teacherModel  = require('../models/teacherModel');
var AdStudent = "SELECT absencesanddelays.*,students.*,classes.Classe_Label FROM `absencesanddelays` INNER JOIN students ON students.Student_ID = absencesanddelays.User_ID INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID WHERE absencesanddelays.User_Type = 'Student' AND students.Institution_ID = ? AND students.Student_Status<>0 AND absencesanddelays.AD_Status<>0";
var settingsController = {
  settingsView:function(req, res, next) {
     connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'", [req.userId], (err, accounts, fields) => {
        connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status <> 0", [req.Institution_ID,req.userId], (err, users, fields) => {                
          connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
            connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
              connection.query("SELECT * FROM `classes` WHERE AY_ID = ? AND Classe_Status=1", [academic[0].AY_ID], (err, classes, fields) => {
                connection.query("SELECT * FROM `levels` WHERE AY_ID = ? AND Level_Status=1", [academic[0].AY_ID], (err, levels, fields) => {
                  connection.query("SELECT * FROM `expenses` WHERE AY_ID = ? AND Expense_Status=1", [academic[0].AY_ID], (err, expenses, fields) => {
                    connection.query("SELECT ls.*,s.Subject_Label FROM levelsubjects ls INNER JOIN subjects s ON s.Subject_ID = ls.Subject_ID WHERE ls.AY_ID = ? AND ls.LS_Status=1 AND Institution_ID = ? ", [academic[0].AY_ID,req.Institution_ID], (err, subjects, fields) => {
                      connection.query("SELECT ls.*,e.Expense_Label,e.Expense_PaymentMethod FROM levelexpenses ls INNER JOIN expenses e ON e.Expense_ID = ls.Expense_ID WHERE ls.AY_ID= ? AND ls.LE_Status=1", [academic[0].AY_ID], (err, costs, fields) => {
                        res.render('settings', { title: 'Settings' , user: user[0], institution:institutions[0], classes:classes,levels:levels,accounts,users,expenses,academic:academic[0],subjects,costs,role:req.role});
                      })
                    })
                  }) 
                })
              })
            })
          })
        })
      })
    })
  },
  getDetails:function(req,res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
      connection.query("SELECT * FROM institutions_categories where IC_Status = 1 ", [], (err, Categories, fields) => {
        connection.query(`SELECT ISC.* , 1 as 'ISC_Existe' FROM institution_specialities as InstSp
                          inner join institutions_sub_categories ISC on(InstSp.ISC_ID = ISC.ISC_ID ) WHERE InstSp.IS_Status = 1 AND ISC.ISC_Status = 1 AND Institution_ID = ? 
                          UNION 
                          SELECT ISC.* , 0 as 'ISC_Existe' FROM institutions_sub_categories ISC WHERE ISC.ISC_Status = 1 AND ISC.IC_ID = ? `,
          [req.Institution_ID,institutions[0].Institution_Category_ID], (err, Specialities, fields) => {
          institutions[0]["Specialities"] = Specialities;
          institutions[0]["Categories"]   = Categories;
          institutions[0]["params"]       = [req.Institution_ID,institutions[0].Institution_Category_ID];
          institutions[0]["Category_ID"]  = institutions[0].Institution_Category_ID;
          res.json({ institution: institutions[0] });
      });
      });
    });
  },
  getAcademic:function(req,res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
      connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
        res.json({academic:academic[0]});
      })
    })
  },
  getLevels:function(req,res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
      connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
          connection.query("SELECT * FROM `levels` WHERE AY_ID = ? AND Level_Status=1", [academic[0].AY_ID], (err, levels, fields) => {
            res.json({levels:levels});
        })
      })
    })
  },
 getClasses:function(req,res, next) {
     connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
        connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
          connection.query("SELECT * FROM `classes` WHERE AY_ID = ? AND Classe_Status=1", [academic[0].AY_ID], (err, classes, fields) => {
            connection.query("SELECT * FROM `levels` WHERE AY_ID = ? AND Level_Status=1", [academic[0].AY_ID], (err, levels, fields) => {
              res.json({classes:classes,levels:levels});
          })
        })
      })
    })
  },
  getSubjects:function(req,res, next) {
     connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
        connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
            connection.query("SELECT * FROM `levels` WHERE AY_ID = ? AND Level_Status=1", [academic[0].AY_ID], (err, levels, fields) => {
            connection.query("SELECT * FROM `subjects` WHERE Institution_ID = ? AND Subject_Status = 1 ", [req.Institution_ID], (err, allSubjects, fields) => {
                connection.query("SELECT ls.*,s.Subject_Label,s.Subject_Color FROM levelsubjects ls INNER JOIN subjects s ON s.Subject_ID = ls.Subject_ID WHERE ls.AY_ID = ? AND ls.LS_Status=1 ", [academic[0].AY_ID], (err, subjects, fields) => {
                    res.json({levels:levels,subjects,allSubjects});
            })
          })
        })
      })
    })
  },
  getAllSubjects: function(req, res, next) {
    connection.query("SELECT Subject_ID , Subject_Label as id , Subject_Label as text, Subject_Color , Subject_Color as color FROM subjects where Institution_ID = ? AND Subject_Status = 1 ",[req.Institution_ID] , (err, subjects, fields) => {
        res.json({
          subjects:subjects
        })
      })
  },
  getExpenses:function(req,res, next) {
   connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
      connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
        connection.query("SELECT * FROM `expenses` WHERE AY_ID = ? AND Expense_Status=1", [academic[0].AY_ID], (err, expenses, fields) => {
          res.json({expenses});
        })
      })
    })
  },
  getCosts:function(req,res, next) {
   connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
      connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
        connection.query("SELECT * FROM `levels` WHERE AY_ID = ? AND Level_Status=1", [academic[0].AY_ID], (err, levels, fields) => {
          connection.query("SELECT ls.*,e.Expense_Label,e.Expense_PaymentMethod FROM levelexpenses ls INNER JOIN expenses e ON e.Expense_ID = ls.Expense_ID WHERE ls.AY_ID= ? AND ls.LE_Status=1", [academic[0].AY_ID], (err, costs, fields) => {
              connection.query("SELECT e.* FROM expenses e WHERE e.AY_ID= ? AND e.Expense_Status = 1 ", [academic[0].AY_ID], (err, expenses , fields) => {
                res.json({levels:levels,costs,expenses});
              })
          })
        })
      })
    })
  },
  getGallery:function(req,res, next) {
        connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
            connection.query("SELECT * FROM institution_gallery where Institution_Gallery_Status = 1 AND 	Institution_ID = ? AND AY_ID = ? ", 
            [req.Institution_ID,academic[0].AY_ID], (err, Gallery, fields) => {
                  res.json({Gallery});
            });
      });
  },
  getSchedules:function(req,res, next) {
        connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
            connection.query("SELECT * FROM institution_schedules where IS_Status <> 0 AND	Institution_ID = ? AND AY_ID = ? ", 
            [req.Institution_ID,academic[0].AY_ID], (err, Schedules, fields) => {
                connection.query("SELECT * FROM institution_breaks_schedule where IBS_Status = 1 AND	Institution_ID = ? AND AY_ID = ? ", 
                  [req.Institution_ID,academic[0].AY_ID], (err, ScheduleBreaks, fields) => {
                        res.json({Schedules,ScheduleBreaks});
                });
            });
      });
  },
  updateDetails: async function(req, res, next) {
   connection.query('UPDATE `institutions` SET `Institution_Name`=?,`Institution_Logo`=?,`Institution_Email`=?,`Institution_Phone`=?,`Institution_Adress`=? , `Institution_Category_ID` = ?  WHERE Institution_ID=?', [req.body.Institution_Name,req.body.Institution_Logo,req.body.Institution_Email,req.body.Institution_Phone,req.body.Institution_Adress,req.body.Institution_Category_id,req.Institution_ID], async (err, institutions, fields) => {
      if (err)
      {
        console.log('Erros',err);
      } else {
        connection.query('UPDATE `institutions_website_info` SET `Institution_Category_ID` = ?  WHERE Institution_ID=?', [req.body.Institution_Category_id, req.Institution_ID], async (err, institutions_website_info, fields) => {
          if (err) {
            console.log('Erros', err);
          } else {
            connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], async (err, academic, fields) => {
              // remove old Specialities
              await commonModel.removeInstitutionSpecialities(req.Institution_ID, academic[0].AY_ID).then(async () => {
                // Save new Specialities
                req.body.Institution_SubCategories.map(async (speciality) => {
                  var saveInstitutionSpecialitiesRes = await commonModel.saveInstitutionSpecialities(
                    speciality,
                    req.Institution_ID,
                    academic[0].AY_ID
                  );
                });
              });
              res.json({
                updated: true
              });
            });
          }
        })
      }
   })
  },
  updateAY:function(req, res, next) {
   connection.query('UPDATE `academicyear` SET `AY_Label`=?,`AY_Satrtdate`=? , `AY_EndDate`=? WHERE Institution_ID=?', [req.body.AY_Label,req.body.AY_Satrtdate,req.body.AY_EndDate,req.Institution_ID], (err, subjects, fields) => {
      if (err)
      {
        console.log('Erros',err);
      } else 
      {
        res.json({
          updated:true
        });
      }
   })
  },
  updateExpenses:function(req, res, next) {
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
       connection.query("SELECT * FROM `expenses` WHERE AY_ID = ? AND Expense_Status=1", [academic[0].AY_ID], (err, expenses, fields) => {
         if (err)
        {
          console.log('Erros',err);
        } else 
        {
          for (var i = req.body.expenses.length - 1; i >= 0; i--) {
            if(!expenses.some(level => level.Expense_ID === parseInt(req.body.expenses[i].id)))
            {
              connection.query('INSERT INTO `levels`(`Level_Label`, `AY_ID`) VALUES (?,?)',[req.body.levels[i].label,academic[0].AY_ID]);
            } else 
              connection.query('UPDATE `levels` SET `Level_Label`=? WHERE Level_ID=? AND AY_ID=?',[req.body.levels[i].label,req.body.levels[i].id,academic[0].AY_ID]);
          }
          res.json({
            updated:true
          });
        }
      })
    })
  },  
  updateSubjects: async function(req, res, next) {

       connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], async (err, academic, fields) => {

                  for (var j =  0; j < req.body.subjects.length; j++) {
                      // Disable all affeted subjects LS_Status = 0
                      connection.query("update levelsubjects set LS_Status = 0 WHERE  Level_ID = ? and AY_ID = ? ", [req.body.subjects[j].level_id,academic[0].AY_ID], async (err, academic, fields) => {});

                      for(var s = 0 ; s < req.body.subjects[j].subject.length ; s++){

                           // add new subject 
                          if(req.body.subjects[j].subject[s].id == -1 ){

                            var subjectID = await settingModel.saveSubjects(req.body.subjects[j].subject[s].text,req.Institution_ID);
                            var levelsubjectResult = await settingModel.saveLevelsSubjects(req.body.subjects[j].level_id,subjectID,academic[0].AY_ID);

                          }else{

                            var findLevelsSubjects = await settingModel.findLevelsSubjects(req.body.subjects[j].level_id,req.body.subjects[j].subject[s].id,academic[0].AY_ID);

                            if(findLevelsSubjects[0].LS_Count == 0 ){
                              var saveLevelsSubjectsCounter = await settingModel.saveLevelsSubjects(req.body.subjects[j].level_id,req.body.subjects[j].subject[s].id,academic[0].AY_ID);
                            }else{
                              // Enable  new one subjects LS_Status = 1 base on level_id and subject_id and ay_ID 
                              connection.query("update levelsubjects set LS_Status = 1 WHERE  Level_ID = ? and Subject_ID = ? and AY_ID = ? ", [req.body.subjects[j].level_id,req.body.subjects[j].subject[s].id,academic[0].AY_ID], async (err, academic, fields) => {}); 
                            }
   

                          }
                      }
                  }

                  res.json({
                    updated : true
                  });

       });

  },
  updateLevels:function(req, res, next) {
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
         if (err) {
          console.log('Erros',err);
        } else {
          for (var i = req.body.levels.length - 1; i >= 0; i--) {
            //if(!levels.some(level => level.Level_ID === parseInt(req.body.levels[i].id)))
            if(req.body.levels[i].id == -1)
            {
              connection.query('INSERT INTO `levels`(`Level_Label`, `AY_ID`) VALUES (?,?)',[req.body.levels[i].label,academic[0].AY_ID]);
            } else 
              connection.query('UPDATE `levels` SET `Level_Label`=? WHERE Level_ID=? AND AY_ID=?',[req.body.levels[i].label,req.body.levels[i].id,academic[0].AY_ID]);
          }
          res.json({
            updated:true
          });
        }
      })
    })
  },
  updateExpenses:function(req, res, next) {
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query("SELECT * FROM `expenses` WHERE AY_ID = ? AND Expense_Status=1", [academic[0].AY_ID], (err, expenses, fields) => {
         if (err)
        {
          console.log('Erros',err);
        } else 
        {
          for (var i = req.body.expenses.length - 1; i >= 0; i--) {
            if(!expenses.some(expense => expense.Expense_ID === parseInt(req.body.expenses[i].id)))
            {
              connection.query('INSERT INTO `expenses`(`Expense_Label`,Expense_PaymentMethod,`AY_ID`,Expense_Color) VALUES (?,?,?,?)',[req.body.expenses[i].label,req.body.expenses[i].method,academic[0].AY_ID,getRandomColor()]);
            } else 
              connection.query('UPDATE `expenses` SET `Expense_Label`=?,Expense_PaymentMethod=? WHERE Expense_ID=? AND AY_ID=?',[req.body.expenses[i].label,req.body.expenses[i].method,req.body.expenses[i].id,academic[0].AY_ID]);
          }
          res.json({
            updated:true
          });
        }
      })
    })
  },
  updateClasses:function(req, res, next) {
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query("SELECT * FROM `classes` WHERE AY_ID = ? AND Classe_Status=1", [academic[0].AY_ID], (err, classes, fields) => {
         if (err)
        {
          console.log('Erros',err);
        }
         else 
        {
          for (var i = req.body.classes.length - 1; i >= 0; i--) {
              if(!classes.some(classe => classe.Level_ID === parseInt(req.body.classes[i].level) && classe.Classe_ID === parseInt(req.body.classes[i].id)))
              {
                connection.query('INSERT INTO `classes`(Classe_Label,`Level_ID`, `AY_ID`) VALUES (?,?,?)',[req.body.classes[i].label,req.body.classes[i].level,academic[0].AY_ID]);
              } else {
                connection.query('UPDATE `classes` SET `Classe_Label`=? WHERE Classe_ID=? AND Level_ID=? AND AY_ID=?',[req.body.classes[i].label,req.body.classes[i].id,req.body.classes[i].level,academic[0].AY_ID]);
              }
            }
            res.json({
            updated:true
          });
        }
      })
    })
  },
  updateCosts:function(req, res, next) {
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query("SELECT ls.*,e.Expense_Label,e.Expense_PaymentMethod FROM levelexpenses ls INNER JOIN expenses e ON e.Expense_ID = ls.Expense_ID WHERE ls.AY_ID= ? AND ls.LE_Status=1", [academic[0].AY_ID], (err, costs, fields) => {
         if (err) {
          console.log('Erros',err);
        } else  {
          for (var i = req.body.costs.length - 1; i >= 0; i--) {
            if(!costs.some(cost => cost.Level_ID === parseInt(req.body.costs[i].level) && cost.Expense_ID === parseInt(req.body.costs[i].id)))
            {
              connection.query('INSERT INTO `levelexpenses`(Expense_ID,`Level_ID`,`Expense_Cost`,`AY_ID`) VALUES (?,?,?,?)',[req.body.costs[i].id,req.body.costs[i].level , req.body.costs[i].price , academic[0].AY_ID]); 
            } else 
              connection.query('UPDATE `levelexpenses` SET `Expense_Cost`=? WHERE Expense_ID=? AND Level_ID=? AND AY_ID=?',[req.body.costs[i].price,req.body.costs[i].id,req.body.costs[i].level,academic[0].AY_ID]);
          }
          res.json({
            updated:true
          });
        }
      })
    })
  },
  updateGallery: async function(req,res){
    connection.query("SELECT * FROM academicyear WHERE Institution_ID = ? LIMIT 1", [req.Institution_ID], async (err, academic, fields) => {
         if (err) {
            console.log('Erros',err);
        }else{
            connection.query("UPDATE institution_gallery SET Institution_Gallery_Status = 0 WHERE Institution_ID = ? ",[req.Institution_ID], async (err, institution_gallery, fields) => {
              // Save Gallery
              req.body.gallery.map( async (picture) => {
                  var Result = await commonModel.saveInstitutionGallery(picture["url"],req.Institution_ID,academic[0].AY_ID);
              });
              res.json({updated:true});
            });
        }
    });
  },
  updateSchedules: async function (req, res) {
    
    console.log("body =>", req.body);
    
    connection.query("SELECT * FROM academicyear WHERE Institution_ID = ? LIMIT 1", [req.Institution_ID], async (err, academic, fields) => {
         if (err) {
            console.log('Erros',err);
         } else {
           
            connection.query("UPDATE institution_breaks_schedule SET IBS_Status = 0 WHERE Institution_ID = ? ",[req.Institution_ID], async (err, institution_breaks_schedule, fields) => {
              connection.query("UPDATE institution_schedules SET IS_Status = 0 WHERE Institution_ID = ? ", [req.Institution_ID], async (err, institution_breaks_schedule, fields) => {
                // Save Schedules
                req.body.schedules.map(async (schedule) => {
                  var Schedules = await commonModel.saveInstitutionSchedules(schedule["day_id"],schedule["status"],schedule["working_hours"],req.Institution_ID, academic[0].AY_ID);
                });

                // Save Breaks
                req.body.schedule_breaks.map(async (single_break) => {
                  var Breaks = await commonModel.saveInstitutionBreaks( 
                    single_break["break_label"], 
                    single_break["breaks"][0].break_time_start, 
                    single_break["breaks"][1].break_time_end,
                    req.Institution_ID, academic[0].AY_ID);
                });

                res.json({ updated: true });

              });
            });
        }
    });
  }
};

module.exports = settingsController;