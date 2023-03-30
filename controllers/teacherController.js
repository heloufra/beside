var connection = require("../lib/db");
var teacherModel = require("../models/teacherModel");
var commonModel = require("../models/commonModel");

var root = require("../middleware/root");

var absenceQuery = `INSERT INTO absencesanddelays(User_ID,  User_Type,  AD_Type,  AD_FromTo, AD_Date,AD_Status, Declaredby_ID) VALUES(?,?,?,?,?,1,?)`;

var adddate = 1;
var classeID;
const readXlsxFile = require("read-excel-file/node");
var handlebars = require("handlebars");
var sendMail = require("../utils/sendmail");
var fs = require("fs");
var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

var transporter = require("../middleware/transporter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
//SELECT teachers.*,levels.Level_Label FROM teachers INNER JOIN teachersclasses ON teachersclasses.teacher_ID = teachers.teacher_ID INNER JOIN teachersubscribtion ON teachersubscribtion.teacher_ID = teachersclasses.teacher_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = teachersubscribtion.LE_ID INNER JOIN levels ON levels.Level_ID = levelexpenses.Level_ID WHERE teachersclasses.Classe_ID = ? AND teachersclasses.AY_ID = ?;
const addMonths = (date, months) => {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
};

const makeid = (length) => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    if ((i + 1) % 2 === 0) result += " ";
  }
  return result;
};

var teacherController = {
  teacherView: function (req, res, next) {
    connection.query(
      "SELECT * FROM users WHERE User_ID = ? LIMIT 1",
      [req.session.userId],
      (err, user, fields) => {
        connection.query(
          "SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'",
          [req.session.userId],
          (err, accounts, fields) => {
            connection.query(
              "SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status = 1 And users.User_Status = 1 ",
              [req.session.Institution_ID, req.session.userId],
              (err, users, fields) => {
                connection.query(
                  "SELECT * FROM `institutions` WHERE `Institution_ID` = ? And Institution_Status = 1 LIMIT 1",
                  [req.session.Institution_ID],
                  (err, institutions, fields) => {
                    connection.query(
                      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
                      [req.session.Institution_ID],
                      (err, academic, fields) => {
                        connection.query(
                          "SELECT * FROM `classes` WHERE AY_ID = ? And Classe_Status = 1 ",
                          [academic[0].AY_ID],
                          (err, classes, fields) => {
                            connection.query(
                              "SELECT * FROM `levels` WHERE AY_ID = ? And Level_Status = 1 ",
                              [academic[0].AY_ID],
                              (err, levels, fields) => {
                                connection.query(
                                  "SELECT subjects.*,levelsubjects.Level_ID FROM subjects INNER JOIN levelsubjects ON levelsubjects.Subject_ID = subjects.Subject_ID WHERE levelsubjects.AY_ID = ? And subjects.Subject_Status = 1 And levelsubjects.LS_Status = 1 GROUP by subjects.Subject_Label",
                                  [academic[0].AY_ID],
                                  (err, subjects, fields) => {
                                    res.render("teacher", {
                                      title: "Teachers",
                                      user: user[0],
                                      institution: institutions[0],
                                      classes: classes,
                                      levels: levels,
                                      subjects,
                                      accounts,
                                      users,
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
  },

  //connection.query("SELECT subjects.*,levelsubjects.Level_ID FROM subjects INNER JOIN levelsubjects ON levelsubjects.Subject_ID = subjects.Subject_ID WHERE levelsubjects.AY_ID = ?", [academic[0].AY_ID],async (err, allsubjects, fields) => {

  getTeacher: async function (req, res, next) {
    var allClasses = [],
      temp;

    connection.query(
      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      async (err, academic, fields) => {
        connection.query(
          "SELECT * FROM absencesanddelays ab INNER JOIN institutionsusers iu ON(ab.User_ID = iu.User_ID) INNER JOIN academicyear ac ON(ac.Institution_ID = iu.Institution_ID) WHERE ab.User_ID = ? AND ab.Declaredby_ID = ? AND ab.AD_Status = 1 AND ab.User_Type='teacher' And iu.IU_Status = 1 And ac.AY_ID = ? ",
          [req.query.id, req.session.userId, academic[0].AY_ID],
          async (err, absences, fields) => {
            connection.query(
              "SELECT DISTINCT subjects.Subject_Label,subjects.Subject_ID FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON(subjects.Subject_ID = teachersubjectsclasses.Subject_ID) INNER JOIN academicyear ac ON(ac.Institution_ID = institutionsusers.Institution_ID)  WHERE users.User_ID = ? AND institutionsusers.Institution_ID = ? AND institutionsusers.User_Role = 'Teacher' AND teachersubjectsclasses.TSC_Status = 1  And teachersubjectsclasses.AY_ID = ? ",
              [req.query.id, req.session.Institution_ID, academic[0].AY_ID],
              async (err, subjects, fields) => {
                connection.query(
                  "SELECT DISTINCT subjects.Subject_Label, subjects.Subject_ID,classes.Classe_Label,classes.Classe_ID FROM `users` INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Teacher_ID = users.User_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = teachersubjectsclasses.Classe_ID WHERE users.User_ID = ? AND institutionsusers.Institution_ID = ? AND institutionsusers.User_Role = 'Teacher' AND teachersubjectsclasses.TSC_Status = 1  And teachersubjectsclasses.AY_ID = ? ",
                  [req.query.id, req.session.Institution_ID, academic[0].AY_ID],
                  async (err, classes, fields) => {
                    connection.query(
                      "SELECT * FROM subjects WHERE Subject_Status = 1 and Institution_ID = ? ",
                      [req.session.Institution_ID],
                      async (err, allsubjects, fields) => {
                        connection.query(
                          "SELECT User_Name , User_Email , User_Phone , User_Image , User_Gender , User_Address , User_Birthdate from users where  User_ID = ? ",
                          [req.query.id],
                          async (err, teacher, fields) => {
                            var uniqueclasses = [];

                            for (var i = classes.length - 1; i >= 0; i--) {
                              uniqueclasses.push(classes[i].Subject_ID);
                            }

                            uniquecls = [...new Set(uniqueclasses)];

                            for (var i = uniquecls.length - 1; i >= 0; i--) {
                              temp = await teacherModel.getAllClasses(
                                uniquecls[i],
                                academic[0].AY_ID
                              );
                              if (temp) {
                                allClasses.push(temp);
                              }
                            }

                            const salary = await commonModel.getUserSalary(
                              req.query.id,
                              req.session.Institution_ID
                            );

                            if (salary.length > 0) {
                              teacher[0]["User_Salary"] = salary[0].User_Salary;
                              teacher[0]["User_Salary_EEC_ID"] =
                                salary[0].EEC_ID;
                            } else {
                              teacher[0]["User_Salary"] = "";
                              teacher[0]["User_Salary_EEC_ID"] = -1;
                            }

                            res.json({
                              subjects: subjects,
                              absences: absences,
                              classes: classes,
                              allsubjects,
                              allClasses,
                              teacher,
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
  },
  getClasses: function (req, res, next) {
    connection.query(
      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, academic, fields) => {
        connection.query(
          "SELECT classes.*,levels.Level_Label FROM levelsubjects INNER JOIN classes ON classes.Level_ID = levelsubjects.Level_ID INNER JOIN levels ON levels.Level_ID = levelsubjects.Level_ID WHERE levelsubjects.Subject_ID = ? AND levelsubjects.AY_ID = ? And classes.Classe_Status = 1 ",
          [req.query.subject_id, academic[0].AY_ID],
          (err, classes, fields) => {
            res.json({
              classes: classes,
            });
          }
        );
      }
    );
  },
  getAllteachers: async function (req, res, next) {
    var teachersArray = [];

    connection.query(
      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      async (err, academic, fields) => {
        connection.query(
          "SELECT users.User_ID,users.User_Name,users.User_Image,users.User_Email,users.User_Phone,users.User_Gender,users.User_Birthdate,users.User_Address FROM `institutionsusers` INNER JOIN users ON users.User_ID = institutionsusers.User_ID WHERE institutionsusers.`Institution_ID` = ? AND institutionsusers.User_Role = 'Teacher' AND institutionsusers.IU_Status = 1 And users.User_Status = 1 Order By users.User_ID Desc ",
          [req.session.Institution_ID],
          async (err, teachers, fields) => {
            for (var i = teachers.length - 1; i >= 0; i--) {
              var classes = await teacherModel.findClasses(
                teachers[i].User_ID,
                academic[0].AY_ID
              );
              var subjects = await teacherModel.findSubjects(
                teachers[i].User_ID,
                academic[0].AY_ID
              );
              teachersAbsenceDelay = await teacherModel.getTeachersAbsenceDelay(
                teachers[i].User_ID,
                req.session.Institution_ID,
                academic[0].AY_ID
              );
              teachers[i].teachersAbsenceDelay = teachersAbsenceDelay;
              const salary = await commonModel.getUserSalary(
                teachers[i].User_ID,
                req.session.Institution_ID
              );

              if (salary.length > 0) {
                teachers[i]["User_Salary"] = salary[0].User_Salary;
                teachers[i]["User_Salary_EEC_ID"] = salary[0].EEC_ID;
              } else {
                teachers[i]["User_Salary"] = "";
                teachers[i]["User_Salary_EEC_ID"] = -1;
              }
              teachersArray.push({
                teacher: teachers[i],
                classes: classes,
                subjects: subjects,
              });
            }

            res.json({
              teachers: teachersArray,
            });
          }
        );
      }
    );
  },
  getTeachersByClasse: function (req, res, next) {
    connection.query(
      "SELECT AY_ID , Institution_Name FROM academicyear ac INNER JOIN institutions ins on(ac.Institution_ID = ins.Institution_ID) WHERE ac.Institution_ID = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, academic, fields) => {
        connection.query(
          "SELECT DISTINCT users.User_Name,users.User_ID FROM `classes` LEFT JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN users ON users.User_ID = teachersubjectsclasses.Teacher_ID WHERE classes.Classe_Label = ? AND teachersubjectsclasses.AY_ID = ? AND users.User_Status = 1 And teachersubjectsclasses.TSC_Status = 1 And classes.Classe_Status	= 1 ",
          [req.query.class_label, academic[0].AY_ID],
          async (err, names, fields) => {
            res.json({
              names,
            });
          }
        );
      }
    );
  },
  saveTeacher: async function (req, res, next) {
    user_error = {};
    form_errors = {};

    // student unique email , phone

    // unique phone
    var tel = await commonModel.userUniqueTel(
      req.body.phone_number,
      -1,
      req.session.Institution_ID
    );

    if (tel[0].Tel_Count > 0 && tel[0].User_Role != "Admin") {
      user_error["Tel"] = tel[0].User_Phone;
    }

    // unique email
    var eml = await commonModel.userUniqueEmail(
      req.body.email,
      -1,
      req.session.Institution_ID
    );

    if (eml[0].Email_Count > 0 && eml[0].User_Role != "Admin") {
      user_error["Email"] = eml[0].User_Email;
    }

    form_errors["User"] = user_error;

    if (
      Object.keys(user_error).length === 0 &&
      user_error.constructor === Object
    ) {
      connection.query(
        "SELECT * from institutions where`Institution_ID` = ? LIMIT 1 ",
        [req.session.Institution_ID],
        async (err, academic, fields) => {
          console.log(
            "role Email : ",
            tel[0].User_Role + " " + eml[0].Email_Count
          );
          console.log("role tel : ", tel[0].User_Role + " " + tel[0].Tel_Count);

          var user = await teacherModel.findUser(
            req.body.email,
            req.session.Institution_ID
          );
          var userId;
          var exist = false;

          if (user.length > 0) {
            if (!user.some((user) => user.role === "Teacher")) {
              userId = user[0].User_ID;
              exist = true;
              connection.query(
                "UPDATE `users` SET User_Name=?,User_Image=?,User_Birthdate = ?, User_Address = ?, User_Gender=? WHERE User_ID = ?",
                [
                  JSON.stringify({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                  }),
                  req.body.profile_image,
                  req.body.birthdate,
                  req.body.teacher_address,
                  req.body.teacher_gender,
                  userId,
                ]
              );
            } else {
              user_error_ = {};
              form_errors_ = {};

              if (tel[0].Tel_Count > 0) {
                user_error_["Tel"] = tel[0].User_Phone;
              }

              if (eml[0].Email_Count > 0) {
                user_error_["Email"] = eml[0].User_Email;
              }

              form_errors_["User"] = user_error_;

              res.json({ saved: false, form_errors: form_errors_ });
            }
          } else {
            var password = makeid(6);
            user = await teacherModel.saveUser(req);
            userId = user.insertId;
            Expence_ID = await commonModel.getCurrentExpencesSalariesID(
              req.session.Institution_ID
            );
            await commonModel.addUserSalary(
              Expence_ID,
              userId,
              req.body.teacher_salary
            );

            readHTMLFile(
              __dirname + "/templates/email_invitation_template.html",
              function (err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                  name: req.body.first_name,
                  role: "Enseignant",
                  Institution_Name: academic[0].Institution_Name,
                };
                var htmlToSend = template(replacements);
                transporter.sendMail(
                  {
                    from: "besideyou@contact.com",
                    to: req.body.email,
                    subject: "Invitation",
                    html: htmlToSend,
                  },
                  function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  }
                );
              }
            );
            exist = false;
          }

          if (userId) {
            connection.query(
              "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
              [req.session.Institution_ID],
              (err, academic, fields) => {
                connection.query(
                  "INSERT INTO `institutionsusers`(`Institution_ID`, `User_ID`, `User_Role`) VALUES (?,?,?)",
                  [req.session.Institution_ID, userId, "Teacher"]
                );
                for (var i = req.body.subjects.length - 1; i >= 0; i--) {
                  for (
                    var j = req.body.subjects[i].classes.length - 1;
                    j >= 0;
                    j--
                  ) {
                    connection.query(
                      "INSERT INTO `teachersubjectsclasses`( `Teacher_ID`, `Subject_ID`, `Classe_ID`, `AY_ID`) VALUES (?,?,?,?)",
                      [
                        userId,
                        req.body.subjects[i].subject,
                        req.body.subjects[i].classes[j],
                        academic[0].AY_ID,
                      ]
                    );
                  }
                }
              }
            );
          }

          res.json({ saved: true, exist });
        }
      );
    } else {
      res.json({ saved: false, form_errors });
    }
  },
  saveAbsence: function (req, res, next) {
    connection.query(
      "SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.userId],
      (err, institutions, fields) => {
        connection.query(
          "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
          [req.session.Institution_ID],
          (err, academic, fields) => {
            connection.query(
              absenceQuery,
              [
                req.body.user_id,
                "teacher",
                req.body.ad_type,
                req.body.ad_fromto,
                req.body.ad_date,
                req.session.userId,
              ],
              (err, absence, fields) => {
                if (err) {
                  console.log(err);
                  res.json({
                    errors: [
                      {
                        field: "Access denied",
                        errorDesc: "List teachers Error",
                      },
                    ],
                  });
                } else {
                  res.json({ saved: true, id: absence.insertId });
                }
              }
            );
          }
        );
      }
    );
  },
  deleteAbsence: function (req, res, next) {
    connection.query(
      "UPDATE `absencesanddelays` SET  `AD_Status`=0 WHERE `AD_ID` = ?",
      [req.body.id],
      (err, teacher, fields) => {
        if (err) {
          console.log(err);
          res.json({
            errors: [
              {
                field: "Access denied",
                errorDesc: "Cannot Remove it",
              },
            ],
          });
        } else {
          res.json({ removed: true });
        }
      }
    );
  },
  deleteteacher: function (req, res, next) {
    connection.query(
      "UPDATE `users` SET `User_Status`=0 WHERE `User_ID` = ? AND User_Role='Teacher'",
      [req.body.id],
      (err, user, fields) => {
        connection.query(
          "UPDATE `institutionsusers` SET `IU_Status`=0 WHERE `User_ID` = ? AND User_Role='Teacher'",
          [req.body.id],
          (err, teacher, fields) => {
            //connection.query("UPDATE `teachersubjectsclasses` SET `TSC_Status`=0 WHERE `Teacher_ID` = ?", [req.body.id], (err, user, fields) => {
            if (err) {
              console.log(err);
              res.json({
                errors: [
                  {
                    field: "Access denied",
                    errorDesc: "Cannot Remove it",
                  },
                ],
              });
            } else {
              res.json({ removed: true });
            }
            //})
          }
        );
      }
    );
  },
  updateTeacher: async function (req, res, next) {
    user_error = {};
    form_errors = {};

    // student unique email , phone

    // unique phone
    var tel = await commonModel.userUniqueTel(
      req.body.phone_number,
      req.body.id,
      req.session.Institution_ID
    );
    if (tel[0].Tel_Count > 0) {
      user_error["Tel"] = tel[0].User_Phone;
    }

    // unique email
    var eml = await commonModel.userUniqueEmail(
      req.body.email,
      req.body.id,
      req.session.Institution_ID
    );

    if (eml[0].Email_Count > 0) {
      user_error["Email"] = eml[0].User_Email;
    }

    form_errors["User"] = user_error;

    if (
      Object.keys(user_error).length === 0 &&
      user_error.constructor === Object
    ) {
      connection.query(
        "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
        [req.session.Institution_ID],
        async (err, academic, fields) => {
          connection.query(
            "UPDATE `users` SET User_Name=?, User_Image=?, User_Email=?,User_Birthdate=?, User_Phone=?,User_Address=?,User_Gender=? WHERE User_ID = ?",
            [
              JSON.stringify({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
              }),
              req.body.profile_image,
              req.body.email,
              req.body.birthdate,
              req.body.phone_number,
              req.body.teacher_address,
              req.body.teacher_gender,
              req.body.id,
            ],
            async (err, teacher, fields) => {
              if (err) {
                console.log(err);
                res.json({
                  errors: [
                    {
                      field: "Access denied",
                      errorDesc: "Save teacher Error",
                    },
                  ],
                });
              } else {
                removed = [];
                if (req.body.subjects) {
                  // remove old subject
                  for (var n = req.body.olddata.length - 1; n >= 0; n--) {
                    if (
                      !req.body.subjects.some((value) => {
                        return (
                          req.body.olddata[n].subject === value.subject &&
                          value.classes.some((value) => {
                            return req.body.olddata[n].classe === value;
                          })
                        );
                      })
                    ) {
                      removed.push(
                        req.body.id +
                          "_" +
                          req.body.olddata[n].subject +
                          "_" +
                          req.body.olddata[n].classe
                      );
                      connection.query(
                        "UPDATE `teachersubjectsclasses` SET  TSC_Status = 0 WHERE `Teacher_ID`=? AND `Subject_ID`=? AND `Classe_ID`=?",
                        [
                          req.body.id,
                          req.body.olddata[n].subject,
                          req.body.olddata[n].classe,
                        ]
                      );
                    }
                  }

                  // add new subject
                  len = "if";
                  for (var i = req.body.subjects.length - 1; i >= 0; i--) {
                    for (
                      var j = req.body.subjects[i].classes.length - 1;
                      j >= 0;
                      j--
                    ) {
                      var teacher = await teacherModel.findSubTeacher(
                        req.body.id,
                        req.body.subjects[i].subject,
                        req.body.subjects[i].classes[j],
                        academic[0].AY_ID
                      );
                      if (teacher.length === 0) {
                        connection.query(
                          "INSERT INTO `teachersubjectsclasses`( `Teacher_ID`, `Subject_ID`, `Classe_ID`, `AY_ID`) VALUES (?,?,?,?)",
                          [
                            req.body.id,
                            req.body.subjects[i].subject,
                            req.body.subjects[i].classes[j],
                            academic[0].AY_ID,
                          ]
                        );
                        len = "0";
                      } else {
                        connection.query(
                          "UPDATE `teachersubjectsclasses` SET  TSC_Status = 1 WHERE `Teacher_ID`=? AND `Subject_ID`=? AND `Classe_ID`=?",
                          [
                            req.body.id,
                            req.body.subjects[i].subject,
                            req.body.subjects[i].classes[j],
                          ]
                        );
                        len = "1";
                      }
                    }
                  }
                }

                if (
                  !req.body.teacher_salary_eec_id ||
                  req.body.teacher_salary_eec_id == -1
                ) {
                  Expence_ID = await commonModel.getCurrentExpencesSalariesID(
                    req.session.Institution_ID
                  );
                  await commonModel.addUserSalary(
                    Expence_ID,
                    req.body.id,
                    req.body.teacher_salary
                  );
                } else {
                  await commonModel.updateUserSalary(
                    req.body.teacher_salary,
                    req.body.teacher_salary_eec_id
                  );
                }

                res.json({ updated: true, removed, len });
              }
            }
          );
        }
      );
    } else {
      res.json({ updated: false, form_errors });
    }
  },
  updateAbsence: function (req, res, next) {
    connection.query(
      "UPDATE `absencesanddelays` SET  AD_FromTo = ?, AD_Date = ? WHERE `AD_ID` = ?",
      [req.body.AD_FromTo, req.body.AD_Date, req.body.id],
      (err, absence, fields) => {
        if (err) {
          console.log(err);
          res.json({
            errors: [
              {
                field: "Access denied",
                errorDesc: "Cannot Update it",
              },
            ],
          });
        } else {
          res.json({ updated: true });
        }
      }
    );
  },
  importFile: function (req, res, next) {
    /*
    0 'teacher1', 
    1 'teacher1',
    2 'Male',
    3 '25/10/1994',
    4 623232323,
    5'marrakech 212',
    6 'mohamed.amine.dichkour@gmail.com'

    first_name , last_name , email ,birthdate,  phone_number,teacher_address,teacher_gender

    [[ 'Lili', 'Loubna', 'Femme', 32906, 212699112233, 'casa','email']]
    [[ 'Abdessadek' 0 ,'Hassan' 1 , 'Male' 2 ,  34356 3 ,772047353 4, 'Abdessadek.Hassan@beside.ma' 5 ,'Marrakech' 6]]

    */

    readXlsxFile("./public/assets/files/" + req.file.filename).then(
      async (rows) => {
        try {
          rows.shift();
          rows.shift();
          console.log("Rows", rows);

          for (var i = rows.length - 1; i >= 0; i--) {
            var user = await teacherModel.findUser(
              rows[i][6],
              req.session.Institution_ID
            );
            var userId;
            if (user.length > 0) {
              if (!user.some((user) => user.role === "Teacher")) {
                userId = user[0].User_ID;
                //first_name,last_name,email,birthdate,phone_number,teacher_address,teacher_gender,userId
                user = await teacherModel.updateTeacher(
                  rows[i][0],
                  rows[i][1],
                  rows[i][5],
                  rows[i][3],
                  rows[i][4],
                  rows[i][6],
                  rows[i][2],
                  userId
                );
              } else {
                //res.json({saved:false})
              }
            } else {
              //first_name,last_name,email,birthdate,  phone_number,teacher_address,teacher_gender
              user = await teacherModel.saveTeacher(
                rows[i][0],
                rows[i][1],
                rows[i][5],
                rows[i][3],
                rows[i][4],
                rows[i][6],
                rows[i][2],
                req.session.Institution_ID
              );
              console.log("user import ==>", user);
              console.log(
                "user user.Institution_Name ==>",
                user.Institution_Name
              );
              await sendMail(rows[i][5], rows[i][0], user.Institution_Name);
              userId = user.insertId;
            }
            if (userId) {
              var ui = await teacherModel.saveIU(
                req.session.Institution_ID,
                userId
              );
            }
          }

          res.json({ saved: true });
        } catch (e) {
          console.log("file ", e);
        }
      }
    );
  },
};

module.exports = teacherController;
