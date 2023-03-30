var connection = require("../lib/db");
var transporter = require("../middleware/transporter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
var handlebars = require("handlebars");
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

var loginController = {
  loginView: function (req, res, next) {
    if (req.session.token) {
      res.redirect("/home");
    } else {
      res.locals.setup = false;
      res.render("login", { title: "Login" });
    }
  },
  checkEmail: function (req, res, next) {
    const makeid = (length) => {
      var result = "";
      var characters = "0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        if ((i + 1) % 2 === 0) result += " ";
      }
      return result;
    };

    console.log(req.body);
    connection.query(
      "SELECT `User_ID`,`User_Email`,User_Name FROM `users` WHERE `User_Email` = ? OR `User_Phone` = ? LIMIT 1",
      [req.body.email, req.body.email],
      (err, userResult, fields) => {
        if (err)
          res.json({
            errors: [
              {
                field: "Access denied",
                errorDesc: "Email not exist",
              },
            ],
          });
        else {
          if (userResult.length === 0)
            res.json({
              errors: [
                {
                  field: "Access denied",
                  errorDesc: "Email not exist",
                },
              ],
            });
          else {
            res.json({ exist: true });
            var name = userResult[0].User_Name;
            try {
              name = JSON.parse(userResult[0].User_Name);
              if (name.first_name)
                name = name.first_name + " " + name.last_name;
              else name = userResult[0].User_Name;
            } catch (e) {
              name = userResult[0].User_Name;
            }
            var dev_Email = ["admin@beside.ma","student@beside.ma","parent@beside.ma","teacher@beside.ma"];
            var password = !dev_Email.includes(String(req.body.email).toLowerCase()) ? makeid(6) : '123456';
            console.log(String(req.body.email).toLowerCase() +" "+password);
            readHTMLFile(
              __dirname + "/templates/email_login_template.html",
              function (err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                  code: password,
                  name,
                  Institution_Name:""
                };
                var htmlToSend = template(replacements);
                transporter.sendMail(
                  {
                    from: "besideyou@contact.com",
                    to: userResult[0].User_Email,
                    subject: "Verification Code",
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
                
                bcrypt.hash(
                  password.replace(/\s/g, ""),
                  10,
                  function (err, hash) {
                    connection.query(
                      "UPDATE `users` SET `User_Password`= ? WHERE  `User_Email` = ? OR `User_Phone` = ? LIMIT 1",
                      [hash, req.body.email, req.body.email]
                    );
                  }
                );
              }
            );
          }
        }
      }
    );
  },
  checkCode: function (req, res, next) {
    connection.query(
      "SELECT `User_ID`,`User_Password`,User_Role FROM `users` WHERE `User_Email` = ? OR `User_Phone` = ? LIMIT 1",
      [req.body.email, req.body.email],
      (err, user, fields) => {
        if (err)
          res.json({
            errors: [
              {
                field: "Access denied",
                errorDesc: "Code not valid",
              },
            ],
          });
        else {
          bcrypt.compare(
            req.body.code,
            user[0].User_Password,
            function (err, result) {
              if (err)
                res.json({
                  errors: [
                    {
                      field: "Access denied",
                      errorDesc: "Code not valid",
                    },
                  ],
                });
              else {
                if (result) {
                  connection.query(
                    "SELECT ac.* , institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutions.Institution_ID = institutionsusers.Institution_ID INNER JOIN academicyear ac ON(ac.Institution_ID = institutions.Institution_ID ) WHERE users.User_ID = ? LIMIT 1",
                    [user[0].User_ID],
                    (err, institutions, fields) => {
                      var userId = user[0].User_ID;
                      if (user[0].User_Role === 'Parent') {

                        /********** Parent *****************/

                          connection.query('SELECT * from parents where Parent_Email = ? LIMIT 1', [req.body.email], (err, parents) => {
                              connection.query('SELECT * from students INNER JOIN studentsparents ON students.Student_ID = studentsparents.Student_ID where studentsparents.Parent_ID = ?', [parents[0].Parent_ID], (err, students) => {
                              connection.query("SELECT ac.* , institutions.* FROM parents INNER JOIN institutions ON institutions.Institution_ID = parents.Institution_ID INNER JOIN academicyear ac ON(ac.Institution_ID = institutions.Institution_ID ) WHERE parents.Parent_ID = ? LIMIT 1",
                                [parents[0].Parent_ID],
                                (err, ParentInstitutions, fields) => {

                                    var token = jwt.sign(
                                      {
                                        userId ,
                                        currentUserId : parents[0].Parent_ID ,
                                        role: user[0].User_Role,
                                        Institution_ID: ParentInstitutions[0].Institution_ID,
                                        AY_ID: ParentInstitutions[0].AY_ID,
                                        currentStudentId: students[0].Student_ID
                                      },
                                      config.privateKey
                                    );
                                    req.session.token = token;

                                    // set request parent variables 
                                    req.session.userId = userId;
                                    req.session.currentUserId = parents[0].Parent_ID ;
                                    req.session.role= user[0].User_Role;
                                    req.session.Institution_ID= ParentInstitutions[0].Institution_ID;
                                    req.session.AY_ID= ParentInstitutions[0].AY_ID;
                                    req.session.currentStudentId= students[0].Student_ID;

                                    res.json({
                                      login:true,
                                      userId ,
                                      currentUserId : parents[0].Parent_ID ,
                                      role: user[0].User_Role,
                                      Institution_ID: ParentInstitutions[0].Institution_ID,
                                      AY_ID: ParentInstitutions[0].AY_ID,
                                      currentStudentId:  students[0].Student_ID
                                    });
                              })
                            })
                          })

                        /********** End Parent *****************/
                      } else if (user[0].User_Role === 'Student') {
                        /********** Student ********************/
                        connection.query('SELECT * from students where Student_Email = ? LIMIT 1', [req.body.email], (err, students) => {
                          connection.query("SELECT ac.* , institutions.* FROM students INNER JOIN institutions ON institutions.Institution_ID = students.Institution_ID INNER JOIN academicyear ac ON(ac.Institution_ID = institutions.Institution_ID ) WHERE students.Student_ID = ? LIMIT 1",
                          [students[0].Student_ID],
                          (err, StudentInstitutions, fields) => {
                                  var token = jwt.sign(
                                    {
                                      userId,
                                      currentUserId : students[0].Student_ID,
                                      role: user[0].User_Role,
                                      Institution_ID: StudentInstitutions[0].Institution_ID,
                                      AY_ID: StudentInstitutions[0].AY_ID,
                                      currentStudentId: students[0].Student_ID
                                    },
                                    config.privateKey
                                  );
                                  req.session.token = token;

                                  // set request student variables 
                                  req.session.userId = userId ;
                                  req.session.role   = user[0].User_Role;
                                  req.session.Institution_ID = institutions[0].Institution_ID;
                                  req.session.AY_ID  = institutions[0].AY_ID;
                                  req.session.currentUserId = students[0].Student_ID;
                                  req.session.currentStudentId = students[0].Student_ID;

                                  res.json({
                                    login:true,
                                    userId ,
                                    currentUserId : students[0].Student_ID ,
                                    role: user[0].User_Role,
                                    Institution_ID: StudentInstitutions[0].Institution_ID,
                                    AY_ID: StudentInstitutions[0].AY_ID,
                                    currentStudentId: students[0].Student_ID
                                  });
                              })
                        })
                        /********** End Student ********************/
                      }else{
                        var token = jwt.sign(
                          {
                            userId ,
                            role: user[0].User_Role,
                            Institution_ID: institutions[0].Institution_ID,
                            AY_ID: institutions[0].AY_ID
                          },
                          config.privateKey
                        );
                        req.session.token = token;

                        // set request admin variables 
                        req.session.userId = userId ;
                        req.session.role   = user[0].User_Role;
                        req.session.Institution_ID = institutions[0].Institution_ID;
                        req.session.AY_ID  = institutions[0].AY_ID;

                        res.json({
                          login:true,
                          userId ,
                          role: user[0].User_Role,
                          Institution_ID: institutions[0].Institution_ID,
                          AY_ID: institutions[0].AY_ID
                        });

                      }
                    }
                  );
                } else {
                  res.json({ login: false });
                  req.session.destroy();
                }
              }
            }
          );
        }
      }
    );
  },
  checkToken: function (req, res) {
    const decoded = jwt.verify(req.body.token, config.privateKey);
    if (decoded.email) {
      res.json({ exist: true, email: decoded.email });
    } else {
      res.json({ exist: false });
    }
  },
  logout: function (req, res) {
    req.session.destroy();
    res.redirect('login');
    //res.json({ logout: true });
  },
  /***************** Api v1 ****************/
  checkEmailMobile: function (req, res, next) {
    const makeid = (length) => {
      var result = "";
      var characters = "0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        if ((i + 1) % 2 === 0) result += " ";
      }
      return result;
    };

    console.log(req.body);
    connection.query(
      "SELECT `User_ID`,`User_Email`,User_Name FROM `users` WHERE `User_Email` = ? OR `User_Phone` = ? LIMIT 1",
      [req.body.email, req.body.email],
      (err, userResult, fields) => {
        if (err)
          res.json({
            errors: [
              {
                field: "Access denied",
                errorDesc: "Email not exist",
              },
            ],
          });
        else {
          if (userResult.length === 0)
            res.json({
              errors: [
                {
                  field: "Access denied",
                  errorDesc: "Email not exist",
                },
              ],
            });
          else {
            res.json({ exist: true });
            var name = userResult[0].User_Name;
            try {
              name = JSON.parse(userResult[0].User_Name);
              if (name.first_name)
                name = name.first_name + " " + name.last_name;
              else name = userResult[0].User_Name;
            } catch (e) {
              name = userResult[0].User_Name;
            }
            var dev_Email = ["admin@beside.ma","student@beside.ma","parent@beside.ma","teacher@beside.ma"];
            var password = !dev_Email.includes(String(req.body.email).toLowerCase()) ? makeid(6) : '123456';
            console.log(String(req.body.email).toLowerCase() +" "+password);
            readHTMLFile(
              __dirname + "/templates/email_login_template.html",
              function (err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                  code: password,
                  name,
                  Institution_Name:""
                };
                var htmlToSend = template(replacements);
                transporter.sendMail(
                  {
                    from: "besideyou@contact.com",
                    to: userResult[0].User_Email,
                    subject: "Verification Code",
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
                
                bcrypt.hash(
                  password.replace(/\s/g, ""),
                  10,
                  function (err, hash) {
                    connection.query(
                      "UPDATE `users` SET `User_Password`= ? WHERE  `User_Email` = ? OR `User_Phone` = ? LIMIT 1",
                      [hash, req.body.email, req.body.email]
                    );
                  }
                );
              }
            );
          }
        }
      }
    );
  },
  checkCodeMobile: function (req, res, next) {
    connection.query(
      "SELECT `User_ID`,`User_Password`,User_Role , User_Image FROM `users` WHERE `User_Email` = ? OR `User_Phone` = ? LIMIT 1",
      [req.body.email, req.body.email],
      (err, user, fields) => {
        if (err)
          res.json({
            errors: [
              {
                field: "Access denied",
                errorDesc: "Code not valid",
              },
            ],
          });
        else {
          bcrypt.compare(
            req.body.code,
            user[0].User_Password,
            function (err, result) {
              if (err)
                res.json({
                  errors: [
                    {
                      field: "Access denied",
                      errorDesc: "Code not valid",
                    },
                  ],
                });
              else {
                if (result) {
                  connection.query(
                    "SELECT ac.* , institutions.* , users.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutions.Institution_ID = institutionsusers.Institution_ID INNER JOIN academicyear ac ON(ac.Institution_ID = institutions.Institution_ID ) WHERE users.User_ID = ? LIMIT 1",
                    [user[0].User_ID],
                    (err, institutions, fields) => {
                      var userId = user[0].User_ID;
                      if (user[0].User_Role === 'Parent') {

                        /********** Parent *****************/

                          connection.query('SELECT * from parents where Parent_Email = ? LIMIT 1', [req.body.email], (err, parents) => {
                              connection.query('SELECT * from students INNER JOIN studentsparents ON students.Student_ID = studentsparents.Student_ID where studentsparents.Parent_ID = ?', [parents[0].Parent_ID], (err, students) => {
                              connection.query("SELECT ac.* , institutions.* FROM parents INNER JOIN institutions ON institutions.Institution_ID = parents.Institution_ID INNER JOIN academicyear ac ON(ac.Institution_ID = institutions.Institution_ID ) WHERE parents.Parent_ID = ? LIMIT 1",
                                [parents[0].Parent_ID],
                                (err, ParentInstitutions, fields) => {

                                    var token = jwt.sign(
                                      {
                                        userId ,
                                        userFullName : parents[0].Parent_Name,
                                        userImageUrl:user[0].User_Image,
                                        userEmail:parents[0].Parent_Email ,
                                        userPhone:parents[0].Parent_Phone ,
                                        currentUserId : parents[0].Parent_ID ,
                                        role: user[0].User_Role,
                                        Institution_ID: ParentInstitutions[0].Institution_ID,
                                        AY_ID: ParentInstitutions[0].AY_ID,
                                        currentStudentId: students[0].Student_ID
                                      },
                                      config.privateKey
                                    );
                                    req.session.token = token;

                                    // set request parent variables 
                                    req.session.userId = userId;
                                    req.session.currentUserId = parents[0].Parent_ID ;
                                    req.session.role= user[0].User_Role;
                                    req.session.Institution_ID= ParentInstitutions[0].Institution_ID;
                                    req.session.AY_ID= ParentInstitutions[0].AY_ID;
                                    req.session.currentStudentId= students[0].Student_ID;

                                    res.json({
                                      login:true,
                                      userId ,
                                      userFullName : parents[0].Parent_Name,
                                      userImageUrl:user[0].User_Image,
                                      userEmail:parents[0].Parent_Email ,
                                      userPhone:parents[0].Parent_Phone ,
                                      currentUserId : parents[0].Parent_ID ,
                                      role: user[0].User_Role,
                                      Institution_ID: ParentInstitutions[0].Institution_ID,
                                      AY_ID: ParentInstitutions[0].AY_ID,
                                      currentStudentId:  students[0].Student_ID
                                    });

                                    console.log("Parent ===>",{
                                      login:true,
                                      userId ,
                                      userFullName : parents[0].Parent_Name,
                                      userImageUrl:user[0].User_Image,
                                      userEmail:parents[0].Parent_Email ,
                                      userPhone:parents[0].Parent_Phone ,
                                      currentUserId : parents[0].Parent_ID ,
                                      role: user[0].User_Role,
                                      Institution_ID: ParentInstitutions[0].Institution_ID,
                                      AY_ID: ParentInstitutions[0].AY_ID,
                                      currentStudentId:  students[0].Student_ID
                                    });

                              })
                            })
                          })

                        /********** End Parent *****************/
                      } else if (user[0].User_Role === 'Student') {
                        /********** Student ********************/
                        connection.query('SELECT * from students where Student_Email = ? LIMIT 1', [req.body.email], (err, students) => {
                          connection.query("SELECT ac.* , institutions.*  , c.* FROM students INNER JOIN institutions ON institutions.Institution_ID = students.Institution_ID INNER JOIN academicyear ac ON(ac.Institution_ID = institutions.Institution_ID )  INNER JOIN studentsclasses sc on(sc.AY_ID = ac.AY_ID ) INNER JOIN classes c on(c.Classe_ID  = sc.Classe_ID ) WHERE students.Student_ID = ? AND sc.Student_ID = ? AND c.Classe_Status = 1 AND sc.SC_Status = 1 LIMIT 1 ",
                          [students[0].Student_ID,students[0].Student_ID],
                          (err, StudentInstitutions, fields) => {

                                  let userFullName = students[0].Student_FirstName+' '+students[0].Student_LastName;
                                  var token = jwt.sign(
                                    {
                                      userId,
                                      currentUserId : students[0].Student_ID,
                                      userFullName : userFullName,
                                      userImageUrl:students[0].Student_Image,
                                      userClasse :StudentInstitutions[0].Classe_Label,
                                      role: user[0].User_Role,
                                      Institution_ID: StudentInstitutions[0].Institution_ID,
                                      AY_ID: StudentInstitutions[0].AY_ID,
                                      currentStudentId: students[0].Student_ID
                                    },
                                    config.privateKey
                                  );

                                  req.session.token = token;

                                  // set request student variables 
                                  req.session.userId = userId ;
                                  req.session.role   = user[0].User_Role;
                                  req.session.Institution_ID = institutions[0].Institution_ID;
                                  req.session.AY_ID  = institutions[0].AY_ID;
                                  req.session.currentUserId = students[0].Student_ID;
                                  req.session.currentStudentId = students[0].Student_ID;

                                  res.json({
                                    login:true,
                                    userId ,
                                    currentUserId : students[0].Student_ID ,
                                    userFullName : userFullName,
                                    userEmail:students[0].Student_Email ,
                                    userPhone:students[0].Student_Phone ,
                                    userClasse :StudentInstitutions[0].Classe_Label,
                                    userImageUrl:students[0].Student_Image,
                                    role: user[0].User_Role,
                                    Institution_ID: StudentInstitutions[0].Institution_ID,
                                    AY_ID: StudentInstitutions[0].AY_ID,
                                    currentStudentId: students[0].Student_ID
                                  });

                                  console.log("student =>",{
                                    login:true,
                                    userId ,
                                    currentUserId : students[0].Student_ID ,
                                    userFullName : userFullName,
                                    userEmail:students[0].Student_Email ,
                                    userPhone:students[0].Student_Phone ,
                                    userClasse :students[0].Classe_Label,
                                    userImageUrl:students[0].Student_Image,
                                    role: user[0].User_Role,
                                    Institution_ID: StudentInstitutions[0].Institution_ID,
                                    AY_ID: StudentInstitutions[0].AY_ID,
                                    currentStudentId: students[0].Student_ID
                                  })
                              })
                        })
                        /********** End Student ********************/
                      }else{
                        var token = jwt.sign(
                          {
                            userId ,
                            role: user[0].User_Role,
                            Institution_ID: institutions[0].Institution_ID,
                            AY_ID: institutions[0].AY_ID
                          },
                          config.privateKey
                        );
                        req.session.token = token;

                        // set request admin variables 
                        req.session.userId = userId ;
                        req.session.role   = user[0].User_Role;
                        req.session.Institution_ID = institutions[0].Institution_ID;
                        req.session.AY_ID  = institutions[0].AY_ID;

                        res.json({
                          login:true,
                          userId ,
                          role: user[0].User_Role,
                          Institution_ID: institutions[0].Institution_ID,
                          AY_ID: institutions[0].AY_ID
                        });

                      }
                    }
                  );
                } else {
                  res.json({ login: false });
                  req.session.destroy();
                }
              }
            }
          );
        }
      }
    );
  }
};

module.exports = loginController;
