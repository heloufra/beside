var connection  = require('../lib/db');

var getRandomColor =() => {

  $subjectColors = ["#d8e9ff","#d2ebdc","#e7d9ff","#f5caca","#f1e1c2","#d1f6fc","#f6f1bd",
          "#e4e0e0","#d4e8b2","#f6d6ad","#d3e2e9","#d5d0e5","#f8d3ec","#ebd2d2"];

  return $subjectColors[Math.floor(Math.random() * $subjectColors.length)];

}

var websiteModel = {

  saveSubjects: function(Subject_Label,Institution_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO subjects(Subject_Label,Subject_Color,Institution_ID) VALUES (?,?,?) ON DUPLICATE KEY UPDATE `Subject_Label` = `Subject_Label`; SELECT Subject_ID FROM subjects WHERE `Subject_Label` = ?", [Subject_Label,getRandomColor(),Institution_ID,Subject_Label], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(subjectResult[0].insertId === 0 ? subjectResult[1][0].Subject_ID : subjectResult[0].insertId);
      });
    })
  },
  saveLevelsSubjects: function(Level_ID, Subject_ID, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("INSERT INTO levelsubjects(Level_ID, Subject_ID, AY_ID) VALUES (?,?,?);", [Level_ID, Subject_ID, AY_ID], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(subjectResult);
      });
    })
  },
  findLevelsSubjects: function(Level_ID, Subject_ID, AY_ID) {
     return new Promise((resolve, reject) => {
      connection.query("SELECT Count(*) as 'LS_Count' , LS_Status from levelsubjects WHERE Level_ID = ? And Subject_ID = ? And AY_ID = ? ", [Level_ID, Subject_ID, AY_ID], (err, subjectResult, fields) => {
       if (err) reject(err);
        else resolve(JSON.parse(JSON.stringify(subjectResult)));
      });
    })
  },

  getInstitutionApiInfo: function (Institutions) {

    institutionsListInfo = [];

    Institutions.map((currentInstitution) => {

    institutionsListInfo.push(new Promise((resolve, reject) => {

        var institution = {};
        var hasEveningSchedule = 0;
        /** Details ____________________*/
        institution["Details"] = currentInstitution;
        /**_____ Accademic Year _____________*/
        connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [currentInstitution.Institution_ID], (err, academic, fields) => {
          if (err) {
            console.log(err);
            reject({ "Error": err });
          } else {
            /** Accademic Year ____________________*/
            institution["Accademic_Year"] = academic[0];
            /**_____ Accademic Year _____________*/
            connection.query(`SELECT mtd.* , 1 as 'MTD_Selected' FROM modules_to_display mtd inner join institution_modules_to_display_settings imtds
                        on(mtd.MTD_ID = imtds.MTD_ID)           
                        WHERE mtd.MTD_Status = 1 and imtds.IMTDS_Status = 1 and imtds.Institution_ID = ? AND imtds.AY_ID = ?
                        UNION 
                        SELECT mtd.* , 0 as 'MTD_Selected' FROM modules_to_display mtd WHERE mtd.MTD_Status = 1 
                        AND mtd.MTD_ID NOT IN(SELECT mtd.MTD_ID FROM modules_to_display mtd inner join institution_modules_to_display_settings imtds on(mtd.MTD_ID = imtds.MTD_ID) WHERE mtd.MTD_Status = 1 and imtds.IMTDS_Status = 1 and imtds.Institution_ID = ? AND imtds.AY_ID = ?)  `,
              [currentInstitution.Institution_ID, academic[0].AY_ID, currentInstitution.Institution_ID, academic[0].AY_ID], (err, DisplaySettings, fields) => {
                if (err) {
                  console.log(err);
                  reject({ "Error": err });
                } else {
                  /** DisplaySettings ____________________*/
                  institution["DisplaySettings"] = DisplaySettings;
                  /**_____ Gallery ____________________*/
                  connection.query("SELECT * FROM institution_gallery where Institution_Gallery_Status = 1 AND 	Institution_ID = ? AND AY_ID = ? ",
                    [currentInstitution.Institution_ID, academic[0].AY_ID], (err, Gallery, fields) => {
                      if (err) {
                        console.log(err);
                        reject({ "Error": err });
                      } else {
                        /** Gallery ____________________*/
                        institution["Gallery"] = Gallery;
                        /**_____ Horaire ____________________*/
                        connection.query("SELECT * FROM institution_schedules where IS_Status <> 0 AND	Institution_ID = ? AND AY_ID = ? ",
                          [currentInstitution.Institution_ID, academic[0].AY_ID], (err, Schedules, fields) => {
                            if (err) {
                              console.log(err);
                              reject({ "Error": err });
                            } else {
                              connection.query("SELECT * FROM institution_breaks_schedule where IBS_Status = 1 AND	Institution_ID = ? AND AY_ID = ? ",
                                [currentInstitution.Institution_ID, academic[0].AY_ID], (err, ScheduleBreaks, fields) => {
                                  if (err) {
                                    console.log(err);
                                    reject({ "Error": err });
                                  } else {
                                    /** Schedules Type  ____________________*/

                                    Schedules.map((schedule) => {
                                      ScheduleHours = JSON.parse(schedule.IS_Schedules);
                                      if (ScheduleHours.evening) {
                                        if (ScheduleHours.evening.length > 0) {
                                          hasEveningSchedule++;
                                        }
                                      }
                                    });

                                    /** Schedules ____________________*/
                                    institution["Schedules"] = {
                                      Schedules,
                                      ScheduleBreaks,
                                      "hasEveningSchedule": (hasEveningSchedule > 0) ? true : false
                                    };
                                    /**_____ Amenties ___________________*/
                                    connection.query(`SELECT a.* , 1 as 'Amenty_Selected' FROM amenties a inner join institution_amenties ai on(a.Amenty_ID = ai.Amenty_ID)  
                                                                  WHERE a.Amenty_Status = 1 and ai.IA_Status = 1 and ai.Institution_ID = ? AND ai.AY_ID = ?
                                                                  UNION 
                                                                  SELECT a.* , 0 as 'Amenty_Selected' FROM amenties a 
                                                                  WHERE a.Amenty_Status = 1 AND a.Amenty_ID 
                                                                  NOT IN(SELECT a.Amenty_ID FROM amenties a inner join institution_amenties ai on(a.Amenty_ID = ai.Amenty_ID) 
                                                                WHERE a.Amenty_Status = 1 and ai.IA_Status = 1 and ai.Institution_ID = ? AND ai.AY_ID = ?)`,
                                      [currentInstitution.Institution_ID, academic[0].AY_ID, currentInstitution.Institution_ID, academic[0].AY_ID], (err, Amenties, fields) => {
                                        if (err) {
                                          console.log(err);
                                          reject({ "Error": err });
                                        } else {
                                          /** Amenties ____________________*/
                                          institution["Amenties"] = Amenties;
                                          /**_____ Fees - Cost _______________________*/
                                          connection.query("SELECT * FROM `levels` WHERE AY_ID = ? AND Level_Status=1", [academic[0].AY_ID], (err, levels, fields) => {
                                            if (err) {
                                              console.log(err);
                                              reject({ "Error": err });
                                            } else {
                                              connection.query("SELECT ls.*,e.Expense_Label,e.Expense_PaymentMethod FROM levelexpenses ls INNER JOIN expenses e ON e.Expense_ID = ls.Expense_ID WHERE ls.AY_ID= ? AND ls.LE_Status=1", [academic[0].AY_ID], (err, costs, fields) => {
                                                if (err) {
                                                  console.log(err);
                                                  reject({ "Error": err });
                                                } else {
                                                  connection.query("SELECT e.* FROM expenses e WHERE e.AY_ID= ? AND e.Expense_Status = 1 ", [academic[0].AY_ID], (err, expenses, fields) => {
                                                    if (err) {
                                                      console.log(err);
                                                      res.json({ "Error": err });
                                                    } else {
                                                      /** Levels ____________________*/
                                                      institution["Levels"] = levels;
                                                      /** Costs ____________________*/
                                                      institution["Costs"] = costs;
                                                      /** Expenses ____________________*/
                                                      institution["Expenses"] = expenses;
                                                      /**_____ Categories & Specialities ___________________*/
                                                      connection.query("SELECT * FROM institutions_categories where IC_Status = 1 and IC_ID = ?  ", [currentInstitution.Institution_Category_ID], (err, Category, fields) => {
                                                        if (err) {
                                                          console.log(err);
                                                          reject({ "Error": err });
                                                        } else {
                                                          connection.query(`SELECT ISC.* , 1 as 'ISC_Existe' FROM institution_specialities as InstSp
                                                                                      inner join institutions_sub_categories ISC on(InstSp.ISC_ID = ISC.ISC_ID ) WHERE InstSp.IS_Status = 1 AND ISC.ISC_Status = 1 AND Institution_ID = ? AND ISC.IC_ID = ? `,
                                                            [currentInstitution.Institution_ID, currentInstitution.Institution_Category_ID], (err, Specialities, fields) => {
                                                              if (err) {
                                                                console.log(err);
                                                                reject({ "Error": err });
                                                              } else {
                                                                /** Categories ____________________*/
                                                                institution["Categories"] = Category;
                                                                /** Specialities ____________________*/
                                                                institution["Specialities"] = Specialities;

                                                                /** Institution ____________________*/
                                                                InstitutionVisibility = DisplaySettings.filter((setting) => {
                                                                  return (setting.MTD_Label == "Website" && setting.MTD_Selected == 1);
                                                                });

                                                                if (InstitutionVisibility.length == 1) {
                                                                  institution["InstitutionVisibility"] = true;
                                                                } else {
                                                                   institution["InstitutionVisibility"] = false ;
                                                                }
                                                                
                                                                resolve(institution);

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
                }
              });
          }
        });
      }));
    });

    return Promise.all(institutionsListInfo).then( (data) => {
      return data.filter((dt) => {
        return dt.InstitutionVisibility == true ;
      });
    });

  }
};

module.exports = websiteModel;