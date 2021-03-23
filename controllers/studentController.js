var connection  = require('../lib/db');
var setupModel  = require('../models/setupModel');
var studentModel  = require('../models/studentModel');
var teacherModel  = require('../models/teacherModel');
var root = require('../middleware/root');
var queryStudents = "SELECT students.*,levels.Level_Label,classes.Classe_Label FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.Classe_ID = ? AND studentsclasses.AY_ID = ? AND students.Student_Status =  1 ;"
var queryAllStudents = "SELECT students.*,levels.Level_Label,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE studentsclasses.AY_ID = ?  AND students.Student_Status =  1 ;"
var queryAllStudentsTeacher = "SELECT DISTINCT students.*,levels.Level_Label,classes.Classe_Label,classes.Classe_ID FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = studentsclasses.Classe_ID WHERE studentsclasses.AY_ID = ?  AND students.Student_Status =  1  AND teachersubjectsclasses.Teacher_ID = ? AND teachersubjectsclasses.TSC_Status = 1 ;"
var querySearch = "SELECT students.*,levels.Level_Label,classes.Classe_Label FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN classes ON studentsclasses.Classe_ID = classes.Classe_ID INNER JOIN levels ON levels.Level_ID = classes.Level_ID WHERE (studentsclasses.Classe_ID = ? OR students.Student_FirstName LIKE ?) AND studentsclasses.AY_ID = ?;"
var queryParents = "SELECT parents.* FROM parents INNER JOIN studentsparents ON studentsparents.Parent_ID = parents.Parent_ID INNER JOIN students ON studentsparents.Student_ID = students.Student_ID WHERE students.Student_ID = ?;"
var querySubstudent = "SELECT levelexpenses.Level_ID,levelexpenses.Expense_Cost,expenses.Expense_Label,expenses.Expense_PaymentMethod,studentsubscribtion.SS_ID,studentsubscribtion.Subscription_StartDate FROM students INNER JOIN studentsubscribtion ON students.Student_ID = studentsubscribtion.Student_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID INNER JOIN academicyear ON academicyear.Institution_ID = students.Institution_ID WHERE students.Student_ID = ? AND students.Institution_ID = ? AND studentsubscribtion.SS_Status = 1 AND studentsubscribtion.Subscription_EndDate = academicyear.AY_EndDate"
var querySubstudentPay = "SELECT levelexpenses.Expense_Cost,expenses.Expense_Label,expenses.Expense_PaymentMethod,studentsubscribtion.* FROM students INNER JOIN studentsubscribtion ON students.Student_ID = studentsubscribtion.Student_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID INNER JOIN academicyear ON academicyear.Institution_ID = students.Institution_ID WHERE students.Student_ID = ? AND students.Institution_ID = ? AND studentsubscribtion.SS_Status = 1 ;"
var queryAllSub = "SELECT expenses.*,levelexpenses.Expense_Cost,levelexpenses.LE_ID,classes.Classe_Label FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID INNER JOIN classes ON classes.Level_ID = levelexpenses.Level_ID WHERE levelexpenses.AY_ID = ?"
var querySubclasse = "SELECT levelexpenses.Expense_Cost,expenses.Expense_Label,expenses.Expense_PaymentMethod FROM classes INNER JOIN levels ON levels.Level_ID = classes.Level_ID INNER JOIN levelexpenses ON levelexpenses.Level_ID = levels.Level_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID WHERE classes.Classe_ID = ? AND classes.AY_ID = ?"
var querySubscriptions = "SELECT expenses.*,levelexpenses.Expense_Cost,levelexpenses.LE_ID FROM expenses INNER JOIN levelexpenses ON levelexpenses.Expense_ID = expenses.Expense_ID WHERE levelexpenses.Level_ID = ? AND levelexpenses.AY_ID = ?;"
var studentQuery = `INSERT INTO students(Student_FirstName,  Student_LastName, Student_Image,  Student_birthdate,  Student_Address,  Student_Phone,Student_Gender,Student_Email,Student_Status, Institution_ID) VALUES(?,?,?,?,?,?,?,?,1,?)`;
var absenceQuery = `INSERT INTO absencesanddelays(User_ID,  User_Type,  AD_Type,  AD_FromTo, AD_Date,AD_Status, Declaredby_ID) VALUES(?,?,?,?,?,1,?)`;
var paymentsQuery = `INSERT INTO studentspayments(SS_ID, SP_PaidPeriod) VALUES (?,?)`;
var attitudeQuery = `INSERT INTO attitude(Student_ID, Attitude_Interaction, Attitude_Note,Attitude_Addeddate,Attitude_Status, Declaredby_ID, AY_ID) VALUES(?,?,?,?,1,?,?)`;
var parentQuery = `INSERT INTO parents(Parent_Name,  Parent_Phone , Parent_Email , Institution_ID) VALUES(?,?,?,?)`;
var spQuery = `INSERT INTO studentsparents(Student_ID, Parent_ID) VALUES(?,?)`; 
var ssQuery = `INSERT INTO studentsubscribtion(Student_ID, LE_ID, Subscription_StartDate, Subscription_EndDate, AY_ID) VALUES(?,?,?,?,?)`;
var scQuery = `INSERT INTO studentsclasses(Student_ID, Classe_ID, AY_ID) VALUES(?,?,?)`;
var queryAttitude = 'SELECT * FROM `attitude` WHERE `Student_ID` = ? AND Attitude_Status = 1 ';
var homeworkQuery = 'SELECT homeworks.*,subjects.Subject_Label,subjects.Subject_Color,classes.Classe_Label FROM `students` INNER JOIN studentsclasses On studentsclasses.Student_ID = students.Student_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = studentsclasses.Classe_ID INNER JOIN homeworks ON homeworks.TSC_ID = teachersubjectsclasses.TSC_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID WHERE students.Student_ID = ? AND homeworks.Homework_Status = 1';
var examsQuery = 'SELECT exams.*,subjects.Subject_Label,subjects.Subject_Color,classes.Classe_Label,grads.Exam_Score FROM `students` INNER JOIN studentsclasses On studentsclasses.Student_ID = students.Student_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = studentsclasses.Classe_ID INNER JOIN exams ON exams.TSC_ID = teachersubjectsclasses.TSC_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID LEFT JOIN grads ON grads.Student_ID = students.Student_ID AND  grads.Exam_ID = exams.Exam_ID WHERE students.Student_ID = ? AND exams.Exam_Status = 1';
var studentPayment = "SELECT studentsubscribtion.SS_ID,expenses.Expense_PaymentMethod,expenses.Expense_Label,studentspayments.*,levelexpenses.Expense_Cost FROM `studentsubscribtion` INNER JOIN studentspayments ON studentspayments.SS_ID = studentsubscribtion.SS_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN expenses ON expenses.Expense_ID = levelexpenses.Expense_ID WHERE studentsubscribtion.Student_ID = ?  AND studentsubscribtion.SS_Status = 1 ;";
var adddate = 1;
var classeID;
var startDate = new Date();
const readXlsxFile = require('read-excel-file/node');
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];
//SELECT students.*,levels.Level_Label FROM students INNER JOIN studentsclasses ON studentsclasses.Student_ID = students.Student_ID INNER JOIN studentsubscribtion ON studentsubscribtion.Student_ID = studentsclasses.Student_ID INNER JOIN levelexpenses ON levelexpenses.LE_ID = studentsubscribtion.LE_ID INNER JOIN levels ON levels.Level_ID = levelexpenses.Level_ID WHERE studentsclasses.Classe_ID = ? AND studentsclasses.AY_ID = ?;
const addMonths = (date, months) => {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

// -> Import Excel Data to MySQL database
const importExcelData2MySQL = (filePath,req,res) => {
  /* 0 => First_Name ,
   1 => Last_Name , 
  2=> Gender , 
  3=>Birthdate,
  4=>Phone number,
  5=>Address,
  6=>Level,
  7=>Class,
  8=>Parent1_Name,
  9=>PArent1_Phone
  10=>Parent2_Name,
  11=>PArent2_Phone,
  12=>Expenses_1,
  13=>Expenses_2,
  14=>Expenses_3,
  15=>Expenses_4,
  */

}

var studentController = {
  studentView:  function(req, res, next) {
    connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ? AND institutionsusers.User_Role='Admin'", [req.userId], (err, accounts, fields) => {
        connection.query("SELECT users.*,institutionsusers.User_Role as role FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_ID = ? AND institutionsusers.IU_Status = 1 ", [req.Institution_ID,req.userId], (err, users, fields) => {                
          connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
              connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
                connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID],async (err, levels, fields) => {
                  if (req.role === 'Teacher')
                      classes = await teacherModel.findClasses(req.userId);
                  res.render('students', { title: 'Students' , user: user[0], institution:institutions[0], classes:classes,levels:levels,accounts,users,role:req.role});
                })
              })
            })
          })
        })
      })
    })
  },
  getStudent: function(req, res, next) {
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
      connection.query(queryParents, [req.query.user_id], (err, parents, fields) => {
        connection.query("SELECT * FROM `absencesanddelays` WHERE User_ID = ? AND AD_Status = 1 AND User_Type='Student'", [req.query.user_id], (err, absences, fields) => {
            connection.query(queryAttitude, [req.query.user_id], (err, attitudes, fields) => {
              connection.query(querySubstudent, [req.query.user_id,req.Institution_ID], (err, substudent, fields) => {
                connection.query(querySubstudentPay, [req.query.user_id,req.Institution_ID], (err, substudentpay, fields) => {
                  connection.query(homeworkQuery, [req.query.user_id], (err, homeworks, fields) => {
                    connection.query(examsQuery, [req.query.user_id], (err, exams, fields) => {
                      connection.query(studentPayment, [req.query.user_id], (err, payStudent, fields) => {
                        connection.query("SELECT AVG(grads.Exam_Score) as average FROM `students` INNER JOIN studentsclasses On studentsclasses.Student_ID = students.Student_ID INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = studentsclasses.Classe_ID INNER JOIN exams ON exams.TSC_ID = teachersubjectsclasses.TSC_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID LEFT JOIN grads ON grads.Student_ID = students.Student_ID AND  grads.Exam_ID = exams.Exam_ID WHERE students.Student_ID = ? AND exams.Exam_Status = 1 ", [req.query.user_id],async (err, grade, fields) => {
                         if (err) {
                              console.log(err);
                                res.json({
                                  errors: [{
                                  field: "Access denied",
                                  errorDesc: "List Students Error"
                                }]});
                            } else 
                            {
                                for (var i = homeworks.length - 1; i >= 0; i--) {
                                  homeworks[i].files = await studentModel.findHomeworkFiles(homeworks[i].Homework_ID);
                                }
                               res.json({
                                  parents:parents,
                                  substudent:substudent,
                                  substudentpay:substudentpay,
                                  absences:absences,
                                  attitudes:attitudes,
                                  homeworks:homeworks,
                                  exams:exams,
                                  start:academic[0].AY_Satrtdate,
                                  end:academic[0].AY_EndDate,
                                  academicyear:academic[0].AY_Label,
                                  average:grade[0].average,
                                  payStudent:payStudent,
                                  declaredBy:req.userId,
                                  role:req.role
                                });
                            }
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
  getAllStudents: function(req, res, next) {

    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
      connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
        connection.query(queryAllSub, [academic[0].AY_ID], (err, subscription, fields) => {

          if (req.role === 'Admin'){

            connection.query(queryAllStudents, [academic[0].AY_ID],  async (err, students, fields) => {

                    for(var s=0 ; s < students.length ; s++){
                        studentsAbsenceDelay = await studentModel.getStudentsAbsenceDelay(students[s].Student_ID,req.Institution_ID);
                        students[s].studentsAbsenceDelay = studentsAbsenceDelay;
                    }

                    res.json({
                          students:students,
                          subscription:subscription
                    });

            })

          }else{

            connection.query(queryAllStudentsTeacher, [academic[0].AY_ID,req.userId], async (err, students, fields) => {

                    for(var s=0 ; s < students.length ; s++){
                        studentsAbsenceDelay = await studentModel.getStudentsAbsenceDelay(students[s].Student_ID,req.Institution_ID);
                        students[s].studentsAbsenceDelay = studentsAbsenceDelay;
                    }

                    res.json({
                          students:students,
                          subscription:subscription
                    });

            });

          }
          
        })
      })
    })
  },
  getStudentsByClasse: function(req, res, next) {
      connection.query("SELECT students.* FROM `studentsclasses` INNER JOIN classes ON classes.Classe_ID = studentsclasses.Classe_ID INNER JOIN students ON students.Student_ID = studentsclasses.Student_ID WHERE classes.Classe_Label = ? AND students.Institution_ID = ? AND students.Student_Status = 1 ", [req.query.class_label,req.Institution_ID],async (err, names, fields) => {
         res.json({
                names
              });
      })
  },
  getSubscriptions: function(req, res, next) {
    connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
        connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
          connection.query("SELECT Max(c.Level_ID) as 'MaxLevel' , l.Level_Label FROM classes c inner join studentsclasses sc on(c.Classe_ID = sc.Classe_ID ) inner join levels l on (l.Level_ID = c.Level_ID ) WHERE sc.Student_ID = ? and sc.AY_ID = ? and sc.SC_Status = 1 and c.Classe_Status = 1 and l.Level_Status = 1 ", [req.query.student_id,academic[0].AY_ID], (err, Student_Level , fields) => {
            connection.query("SELECT Level_ID FROM `levels` WHERE `Level_Label` = ? AND AY_ID = ? LIMIT 1", [req.query.level_label,academic[0].AY_ID], (err, level, fields) => {
              connection.query("SELECT * FROM `classes` WHERE `Level_ID` = ?", [level[0].Level_ID], (err, classes, fields) => {
                connection.query(querySubscriptions, [level[0].Level_ID,academic[0].AY_ID], (err, subscriptions, fields) => {
                   if (err) {
                        console.log(err);
                          res.json({
                            errors: [{
                            field: "Access denied",
                            errorDesc: "List Students Error"
                          }]});
                      } else 
                      {
                         res.json({
                            subscriptions:subscriptions,
                            classes:classes,
                            studentLevel:Student_Level,
                          });
                      }
                 })
              })
            })
        })
    })
    })
  },
  saveStudent: function(req, res, next) {


     form_errors = {} ;
     student_error = {};
     parents_error = {};
     parent_emails_error = [];
     parent_phones_error = [];
     existing_parents = []

     user_id = -1;


      // Parents unique email , phone 
      for (let p = 0 ; p < req.body.parent_email.length ; p++ ) {
         // Parent unique email  
          connection.query("SELECT Count(*) as 'Email_Count' , Parent_Email, Parent_Name, Parent_Phone, Parent_ID  FROM `parents` WHERE `Parent_Email` = ? AND Parent_Status = 1 AND Institution_ID = ? ", [req.body.parent_email[p] , req.Institution_ID ], (err, parentEmail, fields) => {
                // unique email
                if(parentEmail[0].Email_Count > 0){
                    if(parentEmail[0].Parent_Name !== req.body.parent_name[p] || parentEmail[0].Parent_Phone !== req.body.parent_phone[p]) {
                      parent_emails_error.push(parentEmail[0].Parent_Email);
                    } else {
                      existing_parents.push(parentEmail[0]);
                      console.log('existing parents', existing_parents); 
                    }
                }
          });
      }

      for (let p = 0 ; p < req.body.parent_phone.length ; p++ ) {
          // Parent unique phone  
          connection.query("SELECT Count(*) as 'Tel_Count' , Parent_Email, Parent_Name, Parent_Phone, Parent_ID FROM `parents` WHERE `Parent_Phone` = ? AND Parent_Status = 1   AND Institution_ID = ? ", [req.body.parent_phone[p] , req.Institution_ID ], (err, parentTel, fields) => {
                // unique phone
                if(parentTel[0].Tel_Count > 0 && (parentTel[0].Parent_Name !== req.body.parent_name[p] || parentTel[0].Parent_Email !== req.body.parent_email[p])){
                   parent_phones_error.push(parentTel[0].Parent_Phone);
                }
          });
      }

      // Parent unique email , phone 
      parents_error["Email"]=parent_emails_error;
      parents_error["Tel"]=parent_phones_error;
      form_errors["Parents"]=parents_error;

     // student unique email , phone 
     connection.query("SELECT Count(*) as 'Email_Count' FROM `students` WHERE `Student_Email` = ? AND Student_Status = 1 AND Institution_ID = ? limit 1  ", [req.body.student_email , req.Institution_ID ], (err, studentEmail, fields) => {

          // unique email
          if(studentEmail[0].Email_Count > 0 ){ 
             student_error["Email"]=req.body.student_email;
          }

          connection.query("SELECT Count(*) as 'Tel_Count' FROM `students` WHERE `Student_Phone` = ? AND Student_Status = 1  AND Institution_ID = ? limit 1 ", [req.body.phone_number , req.Institution_ID ], (err, studentTel, fields) => {

          // unique phone
          if(studentTel[0].Tel_Count > 0 ){
             student_error["Tel"]=req.body.phone_number;
          }

          // test if there is student uniqueness error
          form_errors["Student"]= student_error ;

          if(parent_emails_error.length == 0 && parent_phones_error.length == 0 && 
             (Object.keys(student_error).length === 0 && student_error.constructor === Object) ) // user.length === 0
          {
             connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
              connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
                    connection.query(studentQuery, [req.body.first_name,req.body.last_name, req.body.profile_image,req.body.birthdate,req.body.student_address,req.body.phone_number,req.body.student_gender,req.body.student_email,req.Institution_ID], (err, student, fields) => {
                       if (err) {
                            console.log(err);
                            res.json({saved : false,error:err});
                          } 
                          else 
                          {
                           
                             user_id = student.insertId
                             console.log("Student",student.insertId);
                             for (let i = req.body.parent_name.length - 1; i >= 0; i--) {
                               debugger;
                               const existingParent = existing_parents.find(p => p.Parent_Email === req.body.parent_email[i])
                                console.log('existing parent detected', existing_parents, existingParent);
                               if (existingParent) {
                                connection.query(spQuery, [student.insertId,existingParent.Parent_ID], (err, spresult, fields) => {
                                  if (err) {
                                       console.log(err);
                                         res.json({
                                           errors: [{
                                           field: "Access denied",
                                           errorDesc: "List Students Error"
                                         }]});
                                     }
                                 })
                               } else { 
                              connection.query(parentQuery, [req.body.parent_name[i],req.body.parent_phone[i],req.body.parent_email[i],req.Institution_ID], (err, parent, fields) => {
                               if (err) {
                                    console.log(err);
                                      res.json({
                                        errors: [{
                                        field: "Access denied",
                                        errorDesc: "List Students Error"
                                      }]});
                                  } else 
                                  {
                                     console.log("Parent",parent.insertId);

                                     connection.query(spQuery, [student.insertId,parent.insertId], (err, spresult, fields) => {
                                       if (err) {
                                            console.log(err);
                                              res.json({
                                                errors: [{
                                                field: "Access denied",
                                                errorDesc: "List Students Error"
                                              }]});
                                          } else 
                                          {
                                             console.log("SP",spresult.insertId)
                                             const [firstName = "", lastName = ""] = (req.body.parent_name[i] || "").split(" ");
                                             connection.query(
                                              "INSERT INTO users(User_Name, User_Email, User_Phone,User_Role) VALUES(?,?,?,?)",
                                              [
                                                JSON.stringify({
                                                  first_name: firstName,
                                                  last_name: lastName,
                                                }),
                                                req.body.parent_email[i],
                                                req.body.parent_phone[i],
                                                "Parent"
                                              ], (err, user) => {
                                                if (err) {
                                                  console.log(err);
                                                } else {
                                                  connection.query("INSERT INTO `institutionsusers`(`Institution_ID`, `User_ID`, `User_Role`) VALUES (?,?,?)",[req.Institution_ID, user.insertId,"Parent"], (err, institutionuser, fields) => {
                                                    if (err) console.log(err);
                                                   });
                                                }
                                              }) 
                                          }
                                      })
                                     
                                  }
                              })
                              }
                             }

                             if (req.body.checkbox_sub)
                               for (var i = req.body.checkbox_sub.length - 1; i >= 0; i--) {
                                  startDate = new Date();
                                  connection.query(ssQuery, [student.insertId,req.body.checkbox_sub[i].LE_ID,months[startDate.getMonth()],academic[0].AY_EndDate,academic[0].AY_ID], (err, ssresult, fields) => {
                                     if (err) {
                                          console.log(err);
                                            res.json({
                                              errors: [{
                                              field: "Access denied",
                                              errorDesc: "List Students Error"
                                            }]});
                                        } else 
                                        {
                                           console.log("SS",ssresult.insertId)
                                           
                                        }
                                    })
                               }
                              connection.query("SELECT Classe_ID FROM `classes` WHERE `Classe_Label` = ? AND AY_ID = ? LIMIT 1", [req.body.classe,academic[0].AY_ID], (err, classe, fields) => {
                                connection.query(scQuery, [student.insertId,classe[0].Classe_ID,academic[0].AY_ID], (err, scresult, fields) => {
                                   if (err) {
                                        console.log(err);
                                          res.json({
                                            errors: [{
                                            field: "Access denied",
                                            errorDesc: "List Students Error"
                                          }]});
                                      } else 
                                      {
                                         console.log("Sc Result",scresult.insertId)
                                         
                                      }
                                  })
                              })
                          }
                          connection.query(
                            "INSERT INTO users(User_Name, User_Image,User_Email,User_Birthdate, User_Phone,User_Address,User_Gender,User_Role) VALUES(?,?,?,?,?,?,?,?)",
                            [
                              JSON.stringify({
                                first_name: req.body.first_name,
                                last_name: req.body.last_name
                              }),
                              req.body.profile_image,
                              req.body.student_email,
                              req.body.birthdate,
                              req.body.phone_number,
                              req.body.student_address,
                              req.body.student_gender,
                              "Student"
                            ], (err, user) => {
                            if (err)
                              console.log(err);
                            else {
                              connection.query("INSERT INTO `institutionsusers`(`Institution_ID`, `User_ID`, `User_Role`) VALUES (?,?,?)",[req.Institution_ID, user.insertId,"Student"], (err, institutionuser, fields) => {
                                if (err) console.log(err);
                               });
                            }
                           })
                     })
              })
            });

            res.json({saved : true,user_id});

          } else {
            res.json({saved : false , form_errors });
          }

        });

    });

  },
  saveAbsence: function(req, res, next) {
           connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
                  connection.query(absenceQuery, [req.body.user_id,  "Student",  req.body.ad_type,  req.body.ad_fromto, req.body.ad_date, req.userId], (err, absence, fields) => {
                     if (err) {
                          console.log(err);
                            res.json({
                              errors: [{
                              field: "Access denied",
                              errorDesc: "List Students Error"
                            }]});
                        } else 
                        {
                          res.json({saved : true,id:absence.insertId});
                        }
                   })
            })
          })
  },
  savePayments: function(req, res, next) {
    for (var i = req.body.payments.length - 1; i >= 0; i--) {
      if (req.body.payments[i].period)
        for (var j = req.body.payments[i].period.length - 1; j >= 0; j--) {
          connection.query(paymentsQuery, [req.body.payments[i].ssid, req.body.payments[i].period[j]]);
        }
    }
    res.json({saved : true});
  },
  saveAttitude: function(req, res, next) {
    //Student_ID, Attitude_Interaction, Attitude_Note, Declaredby_ID, AY_ID
     connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
                  connection.query(attitudeQuery, [req.body.user_id,  req.body.at_type,  req.body.at_note, req.body.at_date, req.userId,academic[0].AY_ID], (err, attitude, fields) => {
                     if (err) {
                          console.log(err);
                            res.json({
                              errors: [{
                              field: "Access denied",
                              errorDesc: "List Students Error"
                            }]});
                        } else 
                        {
                          res.json({saved : true,id:attitude.insertId});
                        }
                   })
            })
          })
  },
  deleteAttitude: function(req, res, next) {
    console.log("declaredBy",req.body.declaredBy)
    if (parseInt(req.body.declaredBy) === req.userId)
      connection.query("UPDATE  `attitude` SET Attitude_Status = 0 WHERE `Attitude_ID` = ?", [req.body.id], (err, student, fields) => {
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
    else
      res.json({removed : false});
  },
  deleteAbsence: function(req, res, next) {
    if (parseInt(req.body.declaredBy) === req.userId)
      connection.query("UPDATE `absencesanddelays` SET  `AD_Status`=0 WHERE `AD_ID` = ?", [req.body.id], (err, student, fields) => {
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
    else
      res.json({removed : false});
  },
  deleteStudent: function(req, res, next) {
    connection.query("UPDATE `students` SET `Student_Status`=0 WHERE `Student_ID` = ?", [req.body.id], (err, student, fields) => {
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
  updateStudent: async function(req, res, next) {

    /**____ form_errors ______________________**/

      form_errors = {} ;
      student_error = {};
      parents_error = {};
      parent_emails_error = [];
      parent_phones_error = [];

      // Parents unique email , phone 
      for (var p = 0 ; p < req.body.parent_email.length ; p++ ) {

         var em = await studentModel.studentParentUniqueEmail( req.body.parent_email[p].email , req.body.parent_email[p].id , req.Institution_ID );

         if(em[0].Email_Count > 0 ){
            parent_emails_error.push(em[0].Parent_Email);
         }

      }

      for (var p = 0 ; p < req.body.parent_phone.length ; p++ ) {
          // Parent unique phone  
         var tel = await studentModel.studentParentUniqueTel( req.body.parent_phone[p].phone , req.body.parent_phone[p].id , req.Institution_ID );
         
         if(tel[0].Tel_Count > 0 ){
            parent_phones_error.push(tel[0].Parent_Phone);
         }
      }

      // Parent unique email , phone 
      parents_error["Email"] = parent_emails_error;
      parents_error["Tel"]   = parent_phones_error;
      form_errors["Parents"] = parents_error;

      // student unique email , phone 
      var tel = await studentModel.studentUniqueTel( req.body.student_phone , req.body.id , req.Institution_ID );
      // unique phone
      if(tel[0].Tel_Count > 0 ){
        student_error["Tel"]=req.body.student_phone;
      }

      // unique email 
      var eml = await studentModel.studentUniqueEmail( req.body.student_email , req.body.id , req.Institution_ID );
      // unique phone
      if(eml[0].Email_Count > 0 ){
        student_error["Email"]= eml[0].Student_Email ;
      }

      form_errors["Student"] = student_error ;

    /**____ End form_errors ______________________**/

    if(parent_emails_error.length == 0 && parent_phones_error.length == 0 && 
             (Object.keys(student_error).length === 0 && student_error.constructor === Object) ) // user.length === 0
    {
      connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
        connection.query("UPDATE `students` SET `Student_FirstName`=?,`Student_LastName`=?,`Student_Image`=?,`Student_birthdate`=?,`Student_Address`=?,`Student_Phone`=?,Student_Gender=?,Student_Email=? WHERE Student_ID = ?", [req.body.student_fname,req.body.student_lname,req.body.student_img,req.body.student_birthdat,req.body.student_address,req.body.student_phone,req.body.student_gender,req.body.student_email,req.body.id],async (err, student, fields) => {
           if (err) {
                console.log(err);
                  res.json({
                    errors: [{
                    field: "Access denied",
                    errorDesc: "Cannot Remove it"
                  }]});
              } else 
              {
                connection.query("UPDATE `studentsclasses` SET `Classe_ID`=? WHERE `Student_ID` = ?", [req.body.student_classe,req.body.id]);
                for (var i = req.body.parent_name.length - 1; i >= 0; i--) {
                  if (req.body.parent_name[i].id === 'null')
                  {
                    connection.query(parentQuery, [req.body.parent_name[i].name,req.body.parent_phone[i].phone,req.body.parent_email[i].email,req.Institution_ID], (err, parent, fields) => {
                       if (err) {
                            console.log(err);
                              res.json({
                                errors: [{
                                field: "Access denied",
                                errorDesc: "List Students Error"
                              }]});
                          } else 
                            {
                             connection.query(spQuery, [req.body.id,parent.insertId], (err, spresult, fields) => {
                               if (err) {
                                    console.log(err);
                                      res.json({
                                        errors: [{
                                        field: "Access denied",
                                        errorDesc: "List Students Error"
                                      }]});
                                  } else 
                                  {

                                  }
                              })
                             
                          }
                        })
                  }
                  else
                    connection.query("UPDATE `parents` SET  Parent_Name = ?,Parent_Phone= ? , Parent_Email= ? WHERE `Parent_ID` = ?", [req.body.parent_name[i].name,req.body.parent_phone[i].phone,req.body.parent_email[i].email,req.body.parent_name[i].id])
                }

                var new_ = false;
                
                if((req.body.student_level_changed * 1 ) == 0){ // test still in the same level
                    // Cancel Subscriptions
                    if (req.body.unchecked){
                      for (var i = req.body.unchecked.length - 1; i >= 0; i--) {
                        connection.query("UPDATE `studentsubscribtion` SET `Subscription_EndDate`=?, `SS_Status`= 0 WHERE `LE_ID` = ?", [new Date(),req.body.unchecked[i]])
                      }
                    }
                    // New Subscriptions
                    if (req.body.checked){
                      for (var i = req.body.checked.length - 1; i >= 0; i--) {
                          var le_id = await studentModel.findLe(req.body.checked[i],req.body.id,academic[0].AY_ID);

                          startDate = new Date();
                          if (le_id.length === 0) // New Subscriptions
                          {
                            connection.query("INSERT INTO studentsubscribtion(Student_ID, LE_ID, Subscription_StartDate, Subscription_EndDate, AY_ID) VALUES(?,?,?,?,?)", [req.body.id,req.body.checked[i],months[startDate.getMonth()],academic[0].AY_EndDate,academic[0].AY_ID])
                          } else // Reactive Old Subscriptions
                          {
                            connection.query("UPDATE `studentsubscribtion` SET Subscription_StartDate=? , `Subscription_EndDate`=?,`SS_Status`=1 WHERE `LE_ID` = ? AND `Student_ID` = ? AND `SS_Status` = 0 ", [months[startDate.getMonth()],academic[0].AY_EndDate,req.body.checked[i],req.body.id])
                          }
                      }
                    }
                }else{ // else  remove old ones and add new

                    // Remove Subscriptions

                    connection.query("UPDATE `studentsubscribtion` SET `SS_Status`= '-1' WHERE `Student_ID` = ? and AY_ID = ? ", [req.body.id,academic[0].AY_ID] );

                    // New Subscriptions
                    if (req.body.checked){
                      for (var i = req.body.checked.length - 1; i >= 0; i--) {
                          // New Subscriptions
                          startDate = new Date();
                            connection.query("INSERT INTO studentsubscribtion(Student_ID, LE_ID, Subscription_StartDate, Subscription_EndDate, AY_ID) VALUES(?,?,?,?,?)", [req.body.id,req.body.checked[i],months[startDate.getMonth()],academic[0].AY_EndDate,academic[0].AY_ID]);
                      }
                    }

                    new_ = true;

                }

                res.json({updated : true , checked : req.body.checked , new_ : new_ , student_level_changed : req.body.student_level_changed });
              }
         })
      });
    }else{
      res.json({updated : false , form_errors });
    }


  },
  updateAttitude: function(req, res, next) {
    if (parseInt(req.body.declaredBy) === req.userId)
      connection.query("UPDATE `attitude` SET  Attitude_Note = ?,Attitude_Addeddate= ? WHERE `Attitude_ID` = ?", [req.body.Attitude_Note,req.body.Attitude_Addeddate,req.body.id], (err, student, fields) => {
         if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "Cannot Update it"
                }]});
            } else 
            {
              res.json({updated : true});
            }
       })
    else
      res.json({updated : false});
  }, 
  updateAbsence: function(req, res, next) {
    if (parseInt(req.body.declaredBy) === req.userId)
      connection.query("UPDATE `absencesanddelays` SET  AD_FromTo = ?, AD_Date = ? WHERE `AD_ID` = ?", [req.body.AD_FromTo,req.body.AD_Date,req.body.id], (err, absence, fields) => {
         if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "Cannot Update it"
                }]});
            } else 
            {
              res.json({updated : true});
            }
       })
    else
      res.json({updated : false});
  },
  importFile: function(req, res, next) {

    /*


        Student : First name 0    Last name 1 Gender 2  Birthdate 3 Phone number 4  Email 5 Address 6
        Lvl-cls : Level 7 Class 8
        Parent 1: First name 9   Last name 10    Phone number 11 Email 12
        Parent 2: First name 13   Last name 14   Phone number 15 Email 16
        Subscription: schooling fees 17 = > Expenses 2  Expenses 3  Expenses 4

        saveParent f_name  ,l_name  , birthdate  , address  , phone , gender  , Email  , Institution_ID

        saveParent  first_name , last_name , phone , email , Institution_ID

         findLeByLevel expense,academicId,level

    */

    readXlsxFile('./public/assets/files/'+req.file.filename).then((rows) => {
    rows.splice(0,2);
    console.log('Rows',rows);
    connection.query("SELECT * FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID],async (err, academic, fields) => {
    res.json({saved:true});
    for (var i = rows.length - 1; i >= 0 ; i--) { 

            var student = await studentModel.saveStudent(rows[i][0],rows[i][1],rows[i][3],rows[i][6],rows[i][4],rows[i][2],rows[i][5],req.Institution_ID);
          
            if (rows[i][9]){
              var parent = await studentModel.saveParent(rows[i][9],rows[i][10],rows[i][11],rows[i][12],req.Institution_ID);
              var spresult = await studentModel.saveStudentParent(student.insertId,parent.insertId);
            }

            if (rows[i][13]){
               var parent = await studentModel.saveParent(rows[i][13],rows[i][14],rows[i][15],rows[i][16],req.Institution_ID);
               var spresult = await studentModel.saveStudentParent(student.insertId,parent.insertId);
            }
            
            console.log('expenses',rows[i][17]);
            startDate = new Date();

            if(rows[i][17]){
              var le_id = await studentModel.findLeByLevel(rows[i][17],academic[0].AY_ID,rows[i][7]);
              try{
                  var ssresult = await studentModel.saveStudentSub(student.insertId,le_id[0].LE_ID,months[startDate.getMonth()],academic[0].AY_EndDate,academic[0].AY_ID);
              }catch(e){
                 console.log(e)
              }
            }

            if(rows[i][18]){
              var le_id = await studentModel.findLeByLevel(rows[i][18],academic[0].AY_ID,rows[i][7]);
              try{
                  var ssresult = await studentModel.saveStudentSub(student.insertId,le_id[0].LE_ID,months[startDate.getMonth()],academic[0].AY_EndDate,academic[0].AY_ID);
              }catch(e){
                 console.log(e)
              }
            }

            if(rows[i][19]){
              var le_id = await studentModel.findLeByLevel(rows[i][19],academic[0].AY_ID,rows[i][7]);
              try{
                  var ssresult = await studentModel.saveStudentSub(student.insertId,le_id[0].LE_ID,months[startDate.getMonth()],academic[0].AY_EndDate,academic[0].AY_ID);
              }catch(e){
                 console.log(e)
              }
            }

            if(rows[i][20]){
              var le_id = await studentModel.findLeByLevel(rows[i][20],academic[0].AY_ID,rows[i][7]);
              try{
                  var ssresult = await studentModel.saveStudentSub(student.insertId,le_id[0].LE_ID,months[startDate.getMonth()],academic[0].AY_EndDate,academic[0].AY_ID);
              }catch(e){
                 console.log(e)
              }
            }

            var classe = await studentModel.findClasse(rows[i][8],academic[0].AY_ID);
            if(classe[0]){
              var scresult = await studentModel.saveStudentClasse(student.insertId,classe[0].Classe_ID,academic[0].AY_ID);
            }
    }
    })
  })
  },
};

module.exports = studentController;