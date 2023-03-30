var connection = require("../lib/db");
var employeeModel = require("../models/employeeModel");
var commonModel = require("../models/commonModel");

var baseRoles = ["Admin", "Teacher", "Student", "Parent"];

var root = require("../middleware/root");

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

var employeeController = {
  employeeView: async function (req, res, next) {
    connection.query(
      "SELECT * FROM users WHERE User_ID = ? LIMIT 1",
      [req.session.userId],
      async (err, user, fields) => {
        connection.query(
          "SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role = 'Admin' ",
          [req.session.userId],
          async (err, accounts, fields) => {
            connection.query(
              "SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status = 1 ",
              [req.session.Institution_ID, req.session.userId],
              async (err, userRoles, fields) => {
                connection.query(
                  "SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND institutionsusers.IU_Status = 1 And users.User_Status = 1 And institutionsusers.User_Role not in(?) ",
                  [req.session.Institution_ID, baseRoles],
                  async (err, users, fields) => {
                    connection.query(
                      "SELECT * FROM `institutions` WHERE `Institution_ID` = ? And Institution_Status = 1 LIMIT 1",
                      [req.session.Institution_ID],
                      async (err, institutions, fields) => {
                        connection.query(
                          "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
                          [req.session.Institution_ID],
                          async (err, academic, fields) => {
                            var functionalities = [];
                            var users_Array = [];

                            users.map(async (usr) => {
                              if (!functionalities.includes(usr.User_Role)) {
                                functionalities.push(usr.User_Role);
                              }
                              const salary = await commonModel.getUserSalary(
                                usr.User_ID,
                                req.session.Institution_ID
                              );

                              if (salary.length > 0) {
                                usr["User_Salary"] = salary[0].User_Salary;
                                usr["User_Salary_EEC_ID"] = salary[0].EEC_ID;
                              } else {
                                usr["User_Salary"] = "";
                                usr["User_Salary_EEC_ID"] = -1;
                              }

                              users_Array.push(usr);
                            });

                            res.render("emplyees", {
                              title: "Employees",
                              user: user[0],
                              institution: institutions[0],
                              accounts,
                              users: userRoles,
                              role: req.role,
                              functionalities,
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

  getEmployee: function (req, res, next) {
    connection.query(
      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, academic, fields) => {
        connection.query(
          "SELECT * FROM subjects WHERE Subject_Status = 1 and Institution_ID = ? ",
          [req.session.Institution_ID],
          async (err, allsubjects, fields) => {
            connection.query(
              "SELECT User_Name , User_Email , User_Phone , User_Image , User_Gender , User_Address , User_Role , User_Birthdate from users where User_ID = ? ",
              [req.query.id],
              async (err, employee, fields) => {
                var functionalities = [];

                employee.map((usr) => {
                  if (!functionalities.includes(usr.User_Role)) {
                    functionalities.push(usr.User_Role);
                  }
                });

                const salary = await commonModel.getUserSalary(
                  req.query.id,
                  req.session.Institution_ID
                );

                if (salary.length > 0) {
                  employee[0]["User_Salary"] = salary[0].User_Salary;
                  employee[0]["User_Salary_EEC_ID"] = salary[0].EEC_ID;
                } else {
                  employee[0]["User_Salary"] = "";
                  employee[0]["User_Salary_EEC_ID"] = -1;
                }

                res.json({
                  functionalities,
                  employee,
                });
              }
            );
          }
        );
      }
    );
  },
  getAllEmployees: function (req, res, next) {
    var employeesArray = [];

    connection.query(
      "SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1",
      [req.session.Institution_ID],
      (err, academic, fields) => {
        connection.query(
          "SELECT users.User_ID,users.User_Name,users.User_Image,users.User_Email,users.User_Phone,users.User_Role,users.User_Gender,users.User_Birthdate,users.User_Address FROM `institutionsusers` INNER JOIN users ON users.User_ID = institutionsusers.User_ID WHERE institutionsusers.`Institution_ID` = ? AND institutionsusers.User_Role not in(?) AND institutionsusers.IU_Status = 1 And users.User_Status = 1 Order By users.User_ID Desc ",
          [req.session.Institution_ID, baseRoles],
          async (err, employees, fields) => {
            for (var i = employees.length - 1; i >= 0; i--) {
              const salary = await commonModel.getUserSalary(
                employees[i].User_ID,
                req.session.Institution_ID
              );

              if (salary.length > 0) {
                employees[i]["User_Salary"] = salary[0].User_Salary;
                employees[i]["User_Salary_EEC_ID"] = salary[0].EEC_ID;
              } else {
                employees[i]["User_Salary"] = "";
                employees[i]["User_Salary_EEC_ID"] = -1;
              }

              employeesArray.push({ employee: employees[i] });
            }

            var functionalities = [];

            employees.map((usr) => {
              if (!functionalities.includes(usr.User_Role)) {
                functionalities.push(usr.User_Role);
              }
            });

            console.log("salaries =>", {
              functionalities,
              employees: employeesArray,
            });

            res.json({
              functionalities,
              employees: employeesArray,
            });
          }
        );
      }
    );
  },
  saveEmployee: async function (req, res, next) {
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

          var user = await employeeModel.findUser(
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
                  req.body.employee_address,
                  req.body.employee_gender,
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
            user = await employeeModel.saveUser(req);
            userIU = await employeeModel.saveIU(
              req.session.Institution_ID,
              user.insertId,
              req.body.employee_functionality
            );
            userId = user.insertId;
            Expence_ID = await commonModel.getCurrentExpencesSalariesID(
              req.session.Institution_ID
            );
            await commonModel.addUserSalary(
              Expence_ID,
              userId,
              req.body.employee_salary
            );
            /* uncomment to send mail
                    var password = makeid(6);
                    user = await employeeModel.saveUser(req);
                    userId = user.insertId;
                    readHTMLFile(__dirname + '/templates/email_invitation_template.html', function(err, html) {
                              var template = handlebars.compile(html);
                              var replacements = {
                                  name:req.body.first_name,
                                  role: req.body.employee_address ,
                                  Institution_Name : academic[0].Institution_Name
                              };
                              var htmlToSend = template(replacements);
                              transporter.sendMail({
                                from: 'besideyou@contact.com',
                                to: req.body.email,
                                subject: 'Invitation',
                                html: htmlToSend
                              }, function(error, info) {
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                }
                              });

                    })
                  */
            exist = false;
          }

          if (userId) {
            res.json({ saved: true, exist });
          }
        }
      );
    } else {
      res.json({ saved: false, form_errors });
    }
  },
  deleteEmployee: function (req, res, next) {
    connection.query(
      "UPDATE `users` SET `User_Status`=0 WHERE `User_ID` = ? AND User_Role=?",
      [req.body.id, req.body.role],
      (err, user, fields) => {
        connection.query(
          "UPDATE `institutionsusers` SET `IU_Status`=0 WHERE `User_ID` = ? AND User_Role=?",
          [req.body.id, req.body.role],
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
  updateEmployee: async function (req, res, next) {
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
        (err, academic, fields) => {
          connection.query(
            "UPDATE `users` SET User_Name=?, User_Image=?, User_Email=?,User_Birthdate=?, User_Phone=?,User_Address=? , User_Gender = ? , User_Role =? WHERE User_ID = ?",
            [
              JSON.stringify({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
              }),
              req.body.profile_image,
              req.body.email,
              req.body.birthdate,
              req.body.phone_number,
              req.body.employee_address,
              req.body.employee_gender,
              req.body.employee_functionality,
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
                if (
                  !req.body.employee_salary_eec_id ||
                  req.body.employee_salary_eec_id == -1
                ) {
                  Expence_ID = await commonModel.getCurrentExpencesSalariesID(
                    req.session.Institution_ID
                  );
                  await commonModel.addUserSalary(
                    Expence_ID,
                    req.body.id,
                    req.body.employee_salary
                  );
                } else {
                  await commonModel.updateUserSalary(
                    req.body.employee_salary,
                    req.body.employee_salary_eec_id
                  );
                }

                res.json({ updated: true });
              }
            }
          );
        }
      );
    } else {
      res.json({ updated: false, form_errors });
    }
  },
};

module.exports = employeeController;
