var connection = require("../lib/db");
var websiteModel = require("../models/websiteModel");
var commonModel = require("../models/commonModel");

var getRandomColor = () => {
  $subjectColors = [
    "#d8e9ff",
    "#d2ebdc",
    "#e7d9ff",
    "#f5caca",
    "#f1e1c2",
    "#d1f6fc",
    "#f6f1bd",
    "#e4e0e0",
    "#d4e8b2",
    "#f6d6ad",
    "#d3e2e9",
    "#d5d0e5",
    "#f8d3ec",
    "#ebd2d2",
  ];

  return $subjectColors[Math.floor(Math.random() * $subjectColors.length)];
};

var date = new Date();
var PaymentsQuery =
  "SELECT students.*,levelexpenses.Expense_Cost , studentspayments.SP_Addeddate,studentspayments.SP_PaidPeriod,classes.Classe_Label FROM `students` LEFT JOIN studentsubscribtion ON studentsubscribtion.Student_ID = students.Student_ID LEFT JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID LEFT JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID LEFT JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID  WHERE `Institution_ID`= ?";
var AdTeacher =
  "SELECT DISTINCT users.*, absencesanddelays.* FROM `absencesanddelays` LEFT JOIN users ON users.User_ID = absencesanddelays.User_ID LEFT JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID LEFT JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID WHERE institutionsusers.Institution_ID = ? AND absencesanddelays.User_Type ='teacher'";
var teacherModel = require("../models/teacherModel");
var AdStudent =
  "SELECT absencesanddelays.*,students.*,classes.Classe_Label FROM `absencesanddelays` INNER JOIN students ON students.Student_ID = absencesanddelays.User_ID INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID WHERE absencesanddelays.User_Type = 'Student' AND students.Institution_ID = ? AND students.Student_Status<>0 AND absencesanddelays.AD_Status<>0";
var websiteController = {
  websiteView: function (req, res, next) {
    connection.query(
      "SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1",
      [req.session.userId],
      (err, user, fields) => {
        connection.query(
          "SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'",
          [req.session.userId],
          (err, accounts, fields) => {
            connection.query(
              "SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status <> 0",
              [req.session.Institution_ID, req.session.userId],
              (err, users, fields) => {
                connection.query(
                  "SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1",
                  [req.session.Institution_ID],
                  (err, institutions, fields) => {
                    connection.query(
                      "SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
                      [req.session.Institution_ID],
                      (err, academic, fields) => {
                        connection.query(
                          "SELECT * FROM `classes` WHERE AY_ID = ? AND Classe_Status=1",
                          [academic[0].AY_ID],
                          (err, classes, fields) => {
                            connection.query(
                              "SELECT * FROM `levels` WHERE AY_ID = ? AND Level_Status=1",
                              [academic[0].AY_ID],
                              (err, levels, fields) => {
                                connection.query(
                                  "SELECT * FROM `expenses` WHERE AY_ID = ? AND Expense_Status=1",
                                  [academic[0].AY_ID],
                                  (err, expenses, fields) => {
                                    connection.query(
                                      "SELECT ls.*,s.Subject_Label FROM levelsubjects ls INNER JOIN subjects s ON s.Subject_ID = ls.Subject_ID WHERE ls.AY_ID = ? AND ls.LS_Status=1 AND Institution_ID = ? ",
                                      [
                                        academic[0].AY_ID,
                                        req.session.Institution_ID,
                                      ],
                                      (err, subjects, fields) => {
                                        connection.query(
                                          "SELECT ls.*,e.Expense_Label,e.Expense_PaymentMethod FROM levelexpenses ls INNER JOIN expenses e ON e.Expense_ID = ls.Expense_ID WHERE ls.AY_ID= ? AND ls.LE_Status=1",
                                          [academic[0].AY_ID],
                                          (err, costs, fields) => {
                                            res.render("website", {
                                              title: "Website",
                                              user: user[0],
                                              institution: institutions[0],
                                              classes: classes,
                                              levels: levels,
                                              accounts,
                                              users,
                                              expenses,
                                              academic: academic[0],
                                              subjects,
                                              costs,
                                              role: req.role,
                                            });
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  },
  getDetails: function (req, res, next) {
    connection.query(
      "SELECT * FROM `institutions_website_info` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, institutions, fields) => {
        res.json({ institution: institutions[0] });
      }
    );
  },
  getGallery: function (req, res, next) {
    connection.query(
      "SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, academic, fields) => {
        connection.query(
          "SELECT * FROM institution_gallery where Institution_Gallery_Status = 1 AND 	Institution_ID = ? AND AY_ID = ? ",
          [req.session.Institution_ID, academic[0].AY_ID],
          (err, Gallery, fields) => {
            res.json({ Gallery });
          }
        );
      }
    );
  },
  getAmenties: function (req, res, next) {
    connection.query(
      "SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, academic, fields) => {
        connection.query(
          `SELECT a.* , 1 as 'Amenty_Selected' FROM amenties a inner join institution_amenties ai on(a.Amenty_ID = ai.Amenty_ID)  
                            WHERE a.Amenty_Status = 1 and ai.IA_Status = 1 and ai.Institution_ID = ? AND ai.AY_ID = ?
                            UNION 
                            SELECT a.* , 0 as 'Amenty_Selected' FROM amenties a 
                            WHERE a.Amenty_Status = 1 AND a.Amenty_ID 
                            NOT IN(SELECT a.Amenty_ID FROM amenties a inner join institution_amenties ai on(a.Amenty_ID = ai.Amenty_ID) 
                          WHERE a.Amenty_Status = 1 and ai.IA_Status = 1 and ai.Institution_ID = ? AND ai.AY_ID = ?)`,
          [
            req.session.Institution_ID,
            academic[0].AY_ID,
            req.session.Institution_ID,
            academic[0].AY_ID,
          ],
          (err, Amenties, fields) => {
            res.json({ Amenties });
          }
        );
      }
    );
  },
  getDisplaySettings: function (req, res, next) {
    connection.query(
      "SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, academic, fields) => {
        connection.query(
          `SELECT mtd.* , 1 as 'MTD_Selected' FROM modules_to_display mtd inner join institution_modules_to_display_settings imtds
                    on(mtd.MTD_ID = imtds.MTD_ID)           
                    WHERE mtd.MTD_Status = 1 and imtds.IMTDS_Status = 1 and imtds.Institution_ID = ? AND imtds.AY_ID = ?
                    UNION 
                    SELECT mtd.* , 0 as 'MTD_Selected' FROM modules_to_display mtd WHERE mtd.MTD_Status = 1 
                    AND mtd.MTD_ID NOT IN(SELECT mtd.MTD_ID FROM modules_to_display mtd inner join institution_modules_to_display_settings imtds on(mtd.MTD_ID = imtds.MTD_ID) WHERE mtd.MTD_Status = 1 and imtds.IMTDS_Status = 1 and imtds.Institution_ID = ? AND imtds.AY_ID = ?)  `,
          [
            req.session.Institution_ID,
            academic[0].AY_ID,
            req.session.Institution_ID,
            academic[0].AY_ID,
          ],
          (err, DisplaySettings, fields) => {
            res.json({ DisplaySettings });
          }
        );
      }
    );
  },

  getInstitutionApiInfo: async function (req, res, next) {
    let queryInstitution =
      "SELECT IWI.* , I.Institution_Logo FROM institutions_website_info as IWI  INNER JOIN institutions I ON(I.Institution_ID = IWI.Institution_ID) ";

    queryInstitution += req.query.name
      ? "WHERE  REPLACE(LOWER(IWI.Institution_Name),' ','') = REPLACE(LOWER(?),' ','') AND I.Institution_Status = 1 LIMIT 1"
      : "WHERE I.Institution_Status = 1 ";

    connection.query(
      queryInstitution,
      [req.query.name],
      async (err, institutions, fields) => {
        if (err) {
          console.log(err);
          res.json({ Error: err });
        } else {
          await websiteModel
            .getInstitutionApiInfo(institutions)
            .then((data) => {
              res.json({ data });
            });
        }
      }
    );
  },

  updateDetails: async function (req, res, next) {
    connection.query(
      "UPDATE `institutions_website_info` SET `Institution_Name`=?,`Institution_Email`=?,`Institution_Phone`=?,`Institution_Adress`=? ,`Institution_About`=? , `Institution_Link`= ? , `Institution_Latitude`= ? , `Institution_Longitude`= ? , `Institution_Location`= ?   WHERE Institution_ID=?",
      [
        req.body.Institution_Name,
        req.body.Institution_Email,
        req.body.Institution_Phone,
        req.body.Institution_Adress,
        req.body.Institution_About,
        req.body.Institution_Website,
        req.body.Institution_Latitude,
        req.body.Institution_Longitude,
        req.body.Institution_Location,
        req.session.Institution_ID,
      ],
      async (err, institutions_website_info, fields) => {
        if (err) {
          console.log("Erros", err);
        } else {
          connection.query(
            "SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
            [req.session.Institution_ID],
            async (err, academic, fields) => {
              res.json({
                updated: true,
              });
            }
          );
        }
      }
    );
  },
  updateGallery: async function (req, res) {
    connection.query(
      "SELECT * FROM academicyear WHERE Institution_ID = ? LIMIT 1",
      [req.session.Institution_ID],
      async (err, academic, fields) => {
        if (err) {
          console.log("Erros", err);
        } else {
          connection.query(
            "UPDATE institution_gallery SET Institution_Gallery_Status = 0 WHERE Institution_ID = ? ",
            [req.session.Institution_ID],
            async (err, institution_gallery, fields) => {
              // Save Gallery
              req.body.gallery.map(async (picture) => {
                var Result = await commonModel.saveInstitutionGallery(
                  picture["url"],
                  req.session.Institution_ID,
                  academic[0].AY_ID
                );
              });
              res.json({ updated: true });
            }
          );
        }
      }
    );
  },
  updateAmenties: async function (req, res) {
    connection.query(
      "SELECT * FROM academicyear WHERE Institution_ID = ? LIMIT 1",
      [req.session.Institution_ID],
      async (err, academic, fields) => {
        if (err) {
          console.log("Erros", err);
        } else {
          connection.query(
            "UPDATE institution_amenties SET IA_Status = 0 WHERE Institution_ID = ? ",
            [req.session.Institution_ID],
            async (err, institution_amenties, fields) => {
              // Save Amenties
              req.body.amenties.map(async (amenty) => {
                var Result = await commonModel.saveInstitutionAmenties(
                  amenty,
                  req.session.Institution_ID,
                  academic[0].AY_ID
                );
              });
              res.json({ updated: true });
            }
          );
        }
      }
    );
  },
  updateDisplaySettings: async function (req, res) {
    connection.query(
      "SELECT * FROM academicyear WHERE Institution_ID = ? LIMIT 1",
      [req.session.Institution_ID],
      async (err, academic, fields) => {
        if (err) {
          console.log("Erros", err);
        } else {
          connection.query(
            "UPDATE institution_modules_to_display_settings SET IMTDS_Status = 0 WHERE Institution_ID = ? ",
            [req.session.Institution_ID],
            async (err, institution_modules_to_display_settings, fields) => {
              // Save Display Settings
              if (
                req.body.display_Settings &&
                req.body.display_Settings.length > 0
              ) {
                req.body.display_Settings.map(async (mtd_ID) => {
                  var Result = await commonModel.saveInstitutionDisplaySettings(
                    mtd_ID,
                    req.session.Institution_ID,
                    academic[0].AY_ID
                  );
                });
              }
              res.json({ updated: true });
            }
          );
        }
      }
    );
  },
};

module.exports = websiteController;
