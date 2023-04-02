var connection = require('../lib/db');
var commonModel = require('../models/commonModel');
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var arrLang = require('../languages/languages.js');

var selectSubject = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE classes.Classe_Label = ? AND teachersubjectsclasses.TSC_Status<>0 and Institution_ID = ? ";

var selectSubjectTeacher = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE classes.Classe_Label = ? AND teachersubjectsclasses.Teacher_ID = ? AND teachersubjectsclasses.TSC_Status<>0 and Institution_ID = ? ";

var selectSubjectTeacherAll = "SELECT DISTINCT subjects.* FROM `classes` INNER JOIN teachersubjectsclasses ON teachersubjectsclasses.Classe_ID = classes.Classe_ID INNER JOIN subjects ON subjects.Subject_ID = teachersubjectsclasses.Subject_ID WHERE teachersubjectsclasses.Teacher_ID = ? AND teachersubjectsclasses.TSC_Status<>0 and Institution_ID = ? ";

const jwt = require('jsonwebtoken');
const config = require('../config');
const { notify } = require('../routes');

const base64ToImage = require('base64-to-image');

var commonController = {
  getSubjects: function(req, res, next) {
    if (req.query.classe === 'All')
      if (req.role === 'Admin')
        connection.query("SELECT * FROM subjects where Institution_ID = ? and Subject_Status = 1 ",[req.query.classe,req.session.Institution_ID], (err, subjects, fields) => {
          res.json({
                    subjects:subjects,
                  });
        })
      else
        connection.query(selectSubjectTeacherAll,[req.session.userId,req.session.Institution_ID], (err, subjects, fields) => {
          res.json({
                    subjects:subjects,
                  });
        })
    else
      if(req.role === 'Admin')
        connection.query(selectSubject,[req.query.classe,req.session.Institution_ID], (err, subjects, fields) => {
          res.json({
                    subjects:subjects,
                  });
        })
      else
        connection.query(selectSubjectTeacher,[req.query.classe,req.session.userId,req.session.Institution_ID], (err, subjects, fields) => {
          res.json({
                    subjects:subjects,
                  });
        })
  },
  postSubjects: function(req, res, next) {
        connection.query("SELECT * FROM subjects where Institution_ID = ? ",[req.session.Institution_ID], (err, subjects, fields) => {
          res.json({
                    subjects:subjects,
                  });
        })
  },
  switchAccount: function(req, res, next) {

    connection.query(
      "SELECT ac.* , ins.* FROM academicyear ac INNER JOIN institutions ins ON(ac.Institution_ID = ins.Institution_ID) WHERE ins.Institution_ID = ? LIMIT 1",
      [req.body.id], 
      async (err, academic, fields) => {

            var token = jwt.sign({
                  userId:req.session.userId,
                  role: req.session.role,
                  Institution_ID:req.body.id,
                  currentStudentId: req.session.currentStudentId,
            }, config.privateKey);

            // set request admin variables 
            req.session.userId = req.session.userId ;
            req.session.role   = req.session.role;
            req.session.Institution_ID = req.body.id;
            req.session.AY_ID  = academic[0].AY_ID;
            req.session.token = token;

            console.log("res switch req.session =>",req.session);

            res.json({
              switched:true
            });
      });

  },

  switchRole: function(req, res, next) {
    console.log("switchRole session",req.session);
    var token = jwt.sign({
          userId:req.session.userId,
          role: req.body.role,
          Institution_ID:req.session.Institution_ID,
          currentStudentId: req.session.currentStudentId,
        }, config.privateKey);

    req.session.token = token;
    req.session.userId = req.session.userId;
    req.session.role = req.body.role;
    req.session.Institution_ID = req.session.Institution_ID;
    req.session.currentStudentId = req.session.currentStudentId;

    res.json({
      switched:true
    })
  },
  
  switchStudent: function(req, res, next) {
    var token = jwt.sign({
      userId:req.session.userId,
      role: req.session.role,
      Institution_ID:req.session.Institution_ID,
      currentStudentId: req.body.currentStudentId
    }, config.privateKey);

    req.session.token = token;
    req.session.userId = req.session.userId;
    req.session.role =  req.session.role;
    req.session.Institution_ID = req.session.Institution_ID;
    req.session.currentStudentId= req.body.currentStudentId

    res.json({
      switched:true
    }) 
  },
  getUser: function(req, res, next) {
    connection.query("SELECT `User_Name`,`User_Email`,`User_Phone`,`User_Image`,`User_Address`,`User_Birthdate`,User_Gender FROM `users` WHERE User_ID=?", [req.session.userId], (err, user, fields) => {
       res.json({
        user:user[0]
      })
    })
  },

  getUserInfo: async function(req, res, next) {

   userInfoQuery = '';
   userInfoQueryParams = [];
   url = req.protocol + '://' + req.get('host') + '/';
   limit = 10;

   let offset = req.body.OffSet  == 0 ? 0 : (req.body.OffSet - 1);

   switch(req.body.UserInfo.role){

      case 'Student': {
       
        userInfoQuery = `Select c.Classe_Label as 'User_Class' , s.Student_Gender as 'User_Gender' ,  Concat(s.Student_FirstName,' ',s.Student_LastName) as User_Full_Name , 'Student' as User_Role , s.Student_ID as 'User_ID' , s.Student_Image as 'User_ImageUrl' ,
        n.Notification_ID , n.Notification_Read_Status , Notification_Addeddate as 'Notification_Added_Date' , n.Notification_Inserted_Module_ID ,
        m.* 
        From notifications n inner join modules m on(m.Module_ID = n.Module_ID) inner join students s on(n.User_ID = s.Student_ID) 
        inner join studentsclasses sc on(s.Student_ID = sc.Student_ID ) inner join classes c on(c.Classe_ID = sc.Classe_ID)
        Where
        m.Module_Status = 1 AND s.Student_Status = 1 AND sc.SC_Status = 1 AND c.Classe_Status = 1 AND n.User_ID = ? AND n.User_Role = ? AND sc.AY_ID = ?        
        `;
        
        userInfoQueryParams = [req.body.UserInfo.currentUserId, req.body.UserInfo.role, req.body.UserInfo.AY_ID];
       
        userInfoQuery += ` order by Date(n.Notification_Addeddate) Desc limit ? OFFSET ? `;
        userInfoQueryParams.push(limit);
        userInfoQueryParams.push( offset * limit );
       
        break;
       
      }

      case 'Parent':{
        
        userInfoQuery = `Select n.Notification_ID , n.Notification_Read_Status , Date(Notification_Addeddate) as 'Notification_Added_Date' , n.Notification_Inserted_Module_ID ,
        m.* 
        From notifications n inner join modules m on(m.Module_ID = n.Module_ID) 
        Where
        m.Module_Status = 1 AND n.User_ID = ? AND n.User_Role = ? `;
        
        userInfoQueryParams = [req.body.UserInfo.currentUserId, req.body.UserInfo.role];
       
        if (req.body.CurrentUser && req.body.CurrentUser != -1 ) {
          userInfoQuery += ` AND n.Parent_Child_ID = ? `;
          userInfoQueryParams.push(req.body.CurrentUser);
        }
       
        userInfoQuery += ` order by Date(n.Notification_Addeddate) Desc limit ? OFFSET ? `;
        userInfoQueryParams.push(limit);
        userInfoQueryParams.push( offset * limit );

        break;
      }
      
      default:{
        break;
      }
      
   }

   connection.query(userInfoQuery,userInfoQueryParams, async (err, Notifications, fields) => {

        Notification_Array = [];
     
        if(err){

          console.log(err);

          res.json({
            errors: [{
            field: "failed to select info",
            errorDesc: "get User Info :"+err+' '+req.body.UserInfo.role
          }]});

        }else{

          if(req.body.UserInfo.role == "Student"){

            const Notification_Array = await commonModel.getNotificationModuleExtraInfo(Notifications,url,req.body.UserInfo.AY_ID,req.body.UserInfo.Institution_ID,-1);
            const expoToken = await commonModel.setExpoToken(req.body.UserInfo.currentUserId, req.body.UserInfo.role, req.body.User_Expo_Token);
            
            const Notification_Array_Extra_Info = await commonModel.getNotificationExtraInfo(req);

            console.log("Notification_Array_Extra_Info Student ==>",Notification_Array_Extra_Info);

            res.json({
              Notifications: Notification_Array,
              Notification_Array_Extra_Info,
              Status:200
            })

          }else if(req.body.UserInfo.role == "Parent"){

            Notifications_IDs_Array = [];

            Notifications.map((notif) => {
              Notifications_IDs_Array.push(notif.Notification_ID);
            });

            userInfoQuery = `Select c.Classe_Label as 'User_Class' , s.Student_Gender as 'User_Gender' ,  Concat(s.Student_FirstName,' ',s.Student_LastName) as User_Full_Name , 'Student' as User_Role , s.Student_ID as 'User_ID' , s.Student_Image as 'User_ImageUrl'  ,
            n.Notification_ID , n.Notification_Read_Status , Notification_Addeddate as 'Notification_Added_Date' , n.Notification_Inserted_Module_ID ,
            m.* 
            From notifications n inner join modules m on(m.Module_ID = n.Module_ID) 
            inner join studentsparents sp on(n.User_ID = sp.Parent_ID) 
            inner join students s on(s.Student_ID = sp.Student_ID)
            inner join studentsclasses sc on(s.Student_ID = sc.Student_ID ) inner join classes c on(c.Classe_ID = sc.Classe_ID)
            Where
            m.Module_Status = 1 AND s.Student_Status = 1 AND sc.SC_Status = 1 AND c.Classe_Status = 1 AND n.Notification_ID in(?) AND sc.AY_ID = ? AND s.Student_ID = n.Parent_Child_ID
            order by n.Notification_Addeddate Desc
            `;

            userInfoQueryParams = [ Notifications_IDs_Array ,req.body.UserInfo.AY_ID];

            connection.query(userInfoQuery,userInfoQueryParams, async (err, NotificationsByChild, fields) => {

              if(err){
                res.json({
                  Notifications:[],
                  Children_Array:[],
                  Status: 500,
                   errors: [{
                    field: "failed to select Notification",
                    errorDesc: "get User Info :"+err+' '+req.body.UserInfo.role
                  }]
                })

              }else{

                var Children_Array = [];
                var NotificationsByChild_Prov = NotificationsByChild;
                var Children_IDs= [];

                NotificationsByChild_Prov.map((NotificationsByChild) => {
                  
                  if (String(NotificationsByChild["User_ImageUrl"]).match(/\.(jpeg|jpg|png|gif|svg)/g) == null) {
                    const base64Str = NotificationsByChild["User_ImageUrl"];
                    const path = './public/assets/images/profiles/'; // Add trailing slash
                    const optionalObj = { fileName: `${NotificationsByChild["User_Role"]}_${NotificationsByChild["User_ID"]}`, type: 'png' };
                    const dataImg = base64ToImage(base64Str, path, optionalObj) // Only synchronous using
                    NotificationsByChild["User_ImageUrl"] = `assets/images/profiles/${NotificationsByChild["User_Role"]}_${NotificationsByChild["User_ID"]}.png`;
                  } else {
                    NotificationsByChild["User_ImageUrl"] = NotificationsByChild["User_ImageUrl"];
                  }

                  if(!Children_IDs.includes(NotificationsByChild.User_ID)){
                    NotificationsByChild.Selected = 0;
                    Children_Array.push(NotificationsByChild);
                    Children_IDs.push(NotificationsByChild.User_ID);
                  }

                });

                const Notification_Array = await commonModel.getNotificationModuleExtraInfo(NotificationsByChild,url,req.body.UserInfo.AY_ID,req.body.UserInfo.Institution_ID,-1);
                const expoToken = await commonModel.setExpoToken(req.body.UserInfo.currentUserId, req.body.UserInfo.role, req.body.User_Expo_Token);
                
                const Notification_Array_Extra_Info = await commonModel.getNotificationExtraInfo(req);
                
                console.log("Notification_Array_Extra_Info Parent ==>", Notification_Array_Extra_Info);

                console.log("Parent Extra ===>", {
                  Notifications: Notification_Array,
                  Children_Array,
                  Status: 200,
                  "Notification_Array_Extra_Info":Notification_Array_Extra_Info,
                  OffSet: req.body.OffSet
                });
  
                res.json({
                  Notifications: Notification_Array,
                  Children_Array,
                  Notification_Array_Extra_Info,
                  Status: 200
                });

              }
            });
          }
        }
    })
  },

  updateUser: async function(req, res, next) {

      user_error = {};
      form_errors = {};

      // student unique email , phone 
      var tel = await commonModel.userUniqueTel( req.body.user_phone , req.session.userId , req.session.Institution_ID );
      // unique phone
      if(tel[0].Tel_Count > 0 ){
        user_error["Tel"]=tel[0].User_Phone;
      }

      // unique email 
      var eml = await commonModel.userUniqueEmail( req.body.user_email , req.session.userId , req.session.Institution_ID );
      // unique phone
      if(eml[0].Email_Count > 0 ){
        user_error["Email"]= eml[0].User_Email ;
      }

      form_errors["User"] = user_error ;

      if( Object.keys(user_error).length === 0 && user_error.constructor === Object) {

          var name;
          connection.query("SELECT `User_Name` FROM `users` WHERE User_ID=?", [req.session.userId], (err, user, fields) => {
            
          if (req.body.user_fname === ""){
            name = user[0].User_Name;
          }
          else{
            name = JSON.stringify({first_name:req.body.user_fname, last_name:req.body.user_lname});
          }

          connection.query("UPDATE `users` SET  `User_Name` = ?,`User_Email` = ?,`User_Phone` = ?,`User_Image` = ?,`User_Address` = ?,`User_Birthdate` = ?, `User_Gender` = ? WHERE `User_ID` = ?", [name,req.body.user_email,req.body.user_phone,req.body.user_image,req.body.user_address,req.body.user_date,req.body.user_gender,req.session.userId], (err, teacher, fields) => {
             if (err) {
                  console.log(err);
                    res.json({
                      errors: [{
                      field: "Access denied",
                      errorDesc: "Cannot Remove it"
                    }]});
                } else 
                {
                  res.json({update : true });
                }
           })
        });

      }else{
          res.json({update : false , form_errors });
      }
  },

  getUserSingleNotification: async function(req, res, next) {

   userInfoQuery = '';
   userInfoQueryParams = [];
   url = req.protocol + '://' + req.get('host') + '/';

   switch(req.body.UserInfo.role){

      case 'Student': {
       
        userInfoQuery = `Select c.Classe_Label as 'User_Class' , s.Student_Gender as 'User_Gender' ,  Concat(s.Student_FirstName,' ',s.Student_LastName) as User_Full_Name , 'Student' as User_Role , s.Student_ID as 'User_ID' , s.Student_Image as 'User_ImageUrl' ,
        n.Notification_ID , n.Notification_Read_Status , Notification_Addeddate as 'Notification_Added_Date' , n.Notification_Inserted_Module_ID ,
        m.* 
        From notifications n inner join modules m on(m.Module_ID = n.Module_ID) inner join students s on(n.User_ID = s.Student_ID) 
        inner join studentsclasses sc on(s.Student_ID = sc.Student_ID ) inner join classes c on(c.Classe_ID = sc.Classe_ID)
        Where
        m.Module_Status = 1 AND s.Student_Status = 1 AND sc.SC_Status = 1 AND c.Classe_Status = 1 AND n.User_ID = ? AND n.User_Role = ? AND sc.AY_ID = ?  AND n.Notification_ID = ?
        order by Date(n.Notification_Addeddate) Desc `;
        
        userInfoQueryParams = [req.body.UserInfo.currentUserId, req.body.UserInfo.role, req.body.UserInfo.AY_ID, req.body.Notification_ID];
       
        break;
       
      }

      case 'Parent':{
        
        userInfoQuery = `Select n.Notification_ID , n.Notification_Read_Status , Date(Notification_Addeddate) as 'Notification_Added_Date' , n.Notification_Inserted_Module_ID ,
        m.* 
        From notifications n inner join modules m on(m.Module_ID = n.Module_ID) 
        Where
        m.Module_Status = 1 AND n.User_ID = ? AND n.User_Role = ? AND n.Notification_ID = ?  
        order by Date(n.Notification_Addeddate) Desc `;
        
        userInfoQueryParams = [req.body.UserInfo.currentUserId, req.body.UserInfo.role, req.body.Notification_ID];
        
        break;
       
      }
      
      default:{
        break;
      }
      
   }

   connection.query(userInfoQuery,userInfoQueryParams, async (err, Notifications, fields) => {

        Notification_Array = [];
     
        if(err){
          
          console.log(err);
          res.json({
            errors: [{
            field: "failed to select info",
            errorDesc: "get User Info :"+err+' '+req.body.UserInfo.role
          }]});

        }else{

          if(req.body.UserInfo.role == "Student"){

            const Notification_Array = await commonModel.getNotificationModuleExtraInfo(Notifications,url,req.body.UserInfo.AY_ID,req.body.UserInfo.Institution_ID,req.body.Notification_ID);
            
            const Notification_Array_Extra_Info = await commonModel.getNotificationExtraInfo(req);

            const Read_Notification = await commonModel.setReadNotification(req,res);

            res.json({
              Notifications: Notification_Array,
              Notification_Array_Extra_Info,
              Status:200
            })

          }else if(req.body.UserInfo.role == "Parent"){

            Notifications_IDs_Array = [];

            Notifications.map((notif) => {
              Notifications_IDs_Array.push(notif.Notification_ID);
            });

            userInfoQuery = `Select c.Classe_Label as 'User_Class' , s.Student_Gender as 'User_Gender' ,  Concat(s.Student_FirstName,' ',s.Student_LastName) as User_Full_Name , 'Student' as User_Role , s.Student_ID as 'User_ID' , s.Student_Image as 'User_ImageUrl'  ,
            n.Notification_ID , n.Notification_Read_Status , Notification_Addeddate as 'Notification_Added_Date' , n.Notification_Inserted_Module_ID ,
            m.* 
            From notifications n inner join modules m on(m.Module_ID = n.Module_ID) 
            inner join studentsparents sp on(n.User_ID = sp.Parent_ID) 
            inner join students s on(s.Student_ID = sp.Student_ID)
            inner join studentsclasses sc on(s.Student_ID = sc.Student_ID ) inner join classes c on(c.Classe_ID = sc.Classe_ID)
            Where
            m.Module_Status = 1 AND s.Student_Status = 1 AND sc.SC_Status = 1 AND c.Classe_Status = 1 AND n.Notification_ID in(?) AND sc.AY_ID = ? AND s.Student_ID = n.Parent_Child_ID
            order by n.Notification_Addeddate Desc
            `;

            userInfoQueryParams = [ Notifications_IDs_Array ,req.body.UserInfo.AY_ID];

            connection.query(userInfoQuery,userInfoQueryParams, async (err, NotificationsByChild, fields) => {

              if(err){
                res.json({
                  Notifications:[],
                  Children_Array:[],
                  Status: 500,
                   errors: [{
                    field: "failed to select Notification",
                    errorDesc: "get User Info :"+err+' '+req.body.UserInfo.role
                  }]
                })

              }else{

                var Children_Array = [];
                var NotificationsByChild_Prov = NotificationsByChild;
                var Children_IDs= [];

                NotificationsByChild_Prov.map((NotificationsByChild)=>{

                  if(!Children_IDs.includes(NotificationsByChild.User_ID)){
                    NotificationsByChild.Selected = 0;
                    Children_Array.push(NotificationsByChild);
                    Children_IDs.push(NotificationsByChild.User_ID);
                  }

                });

                const Notification_Array = await commonModel.getNotificationModuleExtraInfo(NotificationsByChild, url, req.body.UserInfo.AY_ID, req.body.UserInfo.Institution_ID, req.body.Notification_ID);
                
                const Notification_Array_Extra_Info = await commonModel.getNotificationExtraInfo(req);

                const Read_Notification = await commonModel.setReadNotification(req,res);
                
                console.log("Notification_Array_Extra_Info Single Parent ==>", Notification_Array_Extra_Info);

                console.log("Parent Extra ===>", {
                  Notifications: Notification_Array,
                  Children_Array:[],
                  Status: 200,
                  "Notification_Array_Extra_Info":Notification_Array_Extra_Info,
                  OffSet: req.body.OffSet
                });
  
                res.json({
                  Notifications: Notification_Array,
                  Children_Array:[],
                  Notification_Array_Extra_Info,
                  Status: 200
                });

              }
            });
          }
        }
    })
  },

  setReadNotification :(req,res,next)=>{
    commonModel.setReadNotification(req,res)
    .then((Users)=>{
      res.json({Status : 200 });
    }).catch((err)=>{
      res.json({Status : 500 , Message : err });
    });
  },
  getInstitutionCategories: function (req, res, next) {
    connection.query("SELECT * FROM institutions_categories  where IC_Status = 1 ", [], (err, categories, fields) => {
      res.json({
        categories
      });
    })
  },
  getInstitutionSubCategories: function (req, res, next) {
    connection.query("SELECT * FROM institutions_sub_categories where ISC_Status = 1 AND IC_ID = ?  ", [req.body.category_id], (err, subCategories, fields) => {
      res.json({
        subCategories
      });
    })
  },
  getStudentMonthlyUnpaidSubscriptions: async (req, res, next) => {
    let institution_ID = (req.body.Institution_ID) ? req.body.Institution_ID : req.session.Institution_ID;
    connection.query("SELECT * FROM academicyear WHERE Institution_ID = ? LIMIT 1", [institution_ID], async (err, academic, fields) => {
      if (err) {
        console.log('Erros', err);
      } else {
        let Current_Month_Date_Obj = new Date();
        let Current_Month_Date = new Date().toISOString().substring(0, 10);
        commonModel.getStudentMonthlyUnpaidSubscriptions(academic[0].AY_ID,academic[0].AY_Label,academic[0].AY_YearStart, academic[0].AY_YearEnd, academic[0].AY_Satrtdate, academic[0].AY_EndDate,Current_Month_Date)
          .then( async (studentMonthlyUnpaidSubscriptions) => {
            /*** filter Student Only Unpaid */
            let studentMonthlyUnpaidSubscriptionsFiltred = [];
            for (const key in studentMonthlyUnpaidSubscriptions) {
              if (studentMonthlyUnpaidSubscriptions[key].TotalCosts > 0) {
                  studentMonthlyUnpaidSubscriptionsFiltred.push(studentMonthlyUnpaidSubscriptions[key]);
                  /*____ Notification Finance_____*/
                  const StudentList = await commonModel.getStudentsList(academic[0].AY_ID,key,"Finance");
                  //console.log("StudentList",StudentList);
                  const Receivers = await commonModel.getReceivers(StudentList);
                  console.log("Receivers =>",Receivers);
                  if (Receivers.length > 0) {
                    for (r = 0; r < Receivers.length; r++) {
                      Receivers[r].map(async (Receiver) => {
                        if (Receiver.User_Role == "Parent"){
                          //add Notifications
                          await commonModel.addNotifications(Receiver.User_ID, Receiver.User_Role, (Current_Month_Date_Obj.getMonth() + 1) , 6 , Receiver.Parent_Child_ID);
                          //send Notification
                          const childName = Receiver.Child_Full_Name;
                          const notificationBody = arrLang["fr"]["Paiement_Note"] + ' ' + arrLang["fr"][months[Current_Month_Date_Obj.getMonth()]];
                          await commonModel.sendPushNotification(Receiver.User_Expo_Token, childName, notificationBody);
                        }
                      });
                    }
                  }     
                  /*____End Notification Finance_____*/
              }
            }
            res.json({
              Status: 200,
              "StudentMonthlyUnpaidSubscriptions": studentMonthlyUnpaidSubscriptionsFiltred,
              "studentMonthlyUnpaidSubscriptions": studentMonthlyUnpaidSubscriptions
            });
          }).catch((err) => {
            res.json({ Status: 500, Message: err });
          });
      }
    });
  },
};

module.exports = commonController;



              
