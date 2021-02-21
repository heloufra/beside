 var mysql=require('mysql');
 const config = require('../config');
 var connection=mysql.createConnection({
   host:config.db.host,
   port: config.db.port,
   user:config.db.user,
   password:config.db.password,
   database:config.db.database,
   multipleStatements: true
 });
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
   }
 });  

let institutions = `create table if  not exists institutions(
                          Institution_ID int primary key auto_increment,  
                          Institution_Name varchar(255) default null,  
                          Institution_Logo MEDIUMTEXT default null,
                          Institution_Email varchar(255) default null,  
                          Institution_Phone varchar(255) default null,  
                          Institution_wtsp varchar(255) default null,  
                          Institution_Adress varchar(255) default null,  
                          Institution_Adress varchar(255) default null,
                          Institution_Link varchar(255) default null, 
                          Institution_Addeddate datetime default CURRENT_TIMESTAMP, 
                          Institution_Status varchar(2) default 1);`;

  connection.query(institutions, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  var users = `create table if  not exists users(
                          User_ID int primary key auto_increment, 
                          User_Name varchar(255) default null, 
                          User_Password varchar(255) default null, 
                          User_Email varchar(255) default null, 
                          User_Phone varchar(255) default null, 
                          User_Image MEDIUMTEXT default null,
                          User_Gender varchar(255) default null,
                          User_Addeddate datetime default CURRENT_TIMESTAMP, 
                          User_Role varchar(255) default null,
                          User_Address varchar(255) default null,
                          User_Birthdate varchar(255) default null,
                          User_Status varchar(2) default 1);`;

connection.query(users, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var institutionsusers = `create table if  not exists institutionsusers(
                          IU_ID int primary key auto_increment, 
                          Institution_ID int not null, 
                          User_ID int not null, 
                          User_Role varchar(255) default null, 
                          IU_Addeddate datetime default CURRENT_TIMESTAMP, 
                          IU_Status varchar(2) default 1);`;

connection.query(institutionsusers, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var academicyear = `create table if  not exists academicyear(
                          AY_ID int primary key auto_increment, 
                          AY_Label varchar(255) default null,
                          AY_Satrtdate  varchar(255) default null, 
                          AY_EndDate  varchar(255) default null, 
                          Institution_ID int not null);`;

connection.query(academicyear, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var levels = `create table if  not exists levels(
                         Level_ID int primary key auto_increment, 
                         Level_Label varchar(255) default null,
                         Level_Addeddate datetime default CURRENT_TIMESTAMP, 
                         Level_Status varchar(2) default 1,
                         AY_ID int not null);`;

connection.query(levels, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var classes = `create table if  not exists classes(
                        Classe_ID int primary key auto_increment,
                        Level_ID int not null, 
                        Classe_Label varchar(255) default null, 
                        Classe_Status varchar(2) default 1, 
                        AY_ID int not null);`;

connection.query(classes, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var subjects = `create table if  not exists subjects(
                       Subject_ID int primary key auto_increment,
                       Subject_Label varchar(20) default null,
                       Subject_initial varchar(255) default null,
                       Subject_Color varchar(255) default null,
                       Institution_ID int not null ,
                       Subject_Status varchar(2) default 1);`


connection.query(subjects, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var insertSubjects = `INSERT INTO subjects (Subject_Label,Subject_Color,Institution_ID) VALUES
                ('Arabic','#d5d0e5', -1),
                ('French','#d1f6fc', -1);`;


connection.query(insertSubjects, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
});

var levelsubjects = `create table if  not exists levelsubjects(
                       LS_ID int primary key auto_increment, 
                       Level_ID int not null, 
                       Subject_ID int not null, 
                       LS_Status varchar(2) default 1, 
                       AY_ID int not null);`


connection.query(levelsubjects, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var expenses = `create table if  not exists expenses(
                       Expense_ID int primary key auto_increment, 
                       Expense_Label varchar(255) default null, 
                       Expense_PaymentMethod varchar(255) default null,
                       Expense_Status varchar(2) default 1, 
                       AY_ID int not null);`


connection.query(expenses, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var levelexpenses = `create table if  not exists levelexpenses(
                      LE_ID int primary key auto_increment, 
                      Level_ID int not null, 
                      Expense_ID int not null, 
                      Expense_Cost varchar(255) default null, 
                      LE_Status varchar(2) default 1, 
                      AY_ID int not null);`


connection.query(levelexpenses, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var students = `create table if  not exists students(
                     Student_ID int primary key auto_increment,  
                     Student_FirstName varchar(255) default null,  
                     Student_LastName varchar(255) default null, 
                     Student_Image MEDIUMTEXT default null,  
                     Student_birthdate varchar(255) default null,  
                     Student_Address varchar(255) default null,  
                     Student_Gender varchar(255) default null,
                     Student_Phone varchar(255) default null,  
                     Student_Email varchar(255) default null,
                     Student_Addeddate datetime default CURRENT_TIMESTAMP, 
                     Student_Status varchar(2) default 1, 
                     Institution_ID int not null);`


connection.query(students, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var studentsparents = `create table if  not exists studentsparents(
                     SP_ID int primary key auto_increment, 
                     Student_ID int not null, 
                     Parent_ID int not null, 
                     SP_Status varchar(2) default 1);`


connection.query(studentsparents, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var studentsubscribtion = `create table if  not exists studentsubscribtion(
                     SS_ID int primary key auto_increment, 
                     Student_ID int not null, 
                     LE_ID int not null, 
                     Subscription_StartDate  varchar(255) default null, 
                     Subscription_EndDate  varchar(255) default null,
                     SS_Status varchar(2) default 1,
                     AY_ID int not null);`


connection.query(studentsubscribtion, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var teachersubjectsclasses = `create table if  not exists teachersubjectsclasses(
                     TSC_ID int primary key auto_increment, 
                     Teacher_ID int not null, 
                     Subject_ID int not null,
                     Classe_ID int not null, 
                     TSC_Status varchar(2) default 1, 
                     AY_ID int not null);`


connection.query(teachersubjectsclasses, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var parents = `create table if  not exists parents(
                     Parent_ID int primary key auto_increment,  
                     Parent_Name varchar(255) default null,  
                     Parent_Phone varchar(255) default null,  
                     Parent_Email varchar(255) default null,  
                     Parent_Addeddate datetime default CURRENT_TIMESTAMP, 
                     Parent_Status varchar(2) default 1,
                     Institution_ID int not null);`


connection.query(parents, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var absencesanddelays = `create table if  not exists absencesanddelays(
                     AD_ID int primary key auto_increment,  
                     User_ID int not null,  
                     User_Type varchar(255) default null,  
                     AD_Type int not null,  
                     AD_FromTo varchar(255) default null, 
                     AD_Date varchar(255) default null,  
                     AD_Addeddate datetime default CURRENT_TIMESTAMP, 
                     AD_Status varchar(2) default 1, 
                     Declaredby_ID int not null);`


connection.query(absencesanddelays, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var studentsclasses = `create table if  not exists studentsclasses(
                     SC_ID int primary key auto_increment, 
                     Student_ID int not null, 
                     Classe_ID int not null, 
                     SC_Status varchar(2) default 1, 
                     AY_ID int not null);`


connection.query(studentsclasses, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var studentspayments = `create table if  not exists studentspayments(
                     SP_ID int primary key auto_increment, 
                     SS_ID int not null, 
                     SP_Addeddate datetime default CURRENT_TIMESTAMP, 
                     SP_PaidPeriod varchar(20) default null,
                     SP_Status varchar(2) default 1);`


connection.query(studentspayments, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var homeworks = `create table if  not exists homeworks(
                     Homework_ID int primary key auto_increment,
                     TSC_ID int not null,  
                     Homework_Title  varchar(255) default null, 
                     Homework_Deatils  TEXT default null,
                     Homework_DeliveryDate  varchar(255) default null, 
                     Homework_Addeddate datetime default CURRENT_TIMESTAMP,
                     Homework_Status  varchar(255) default null);`


connection.query(homeworks, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var exams = `create table if  not exists exams(
                     Exam_ID int primary key auto_increment,
                     TSC_ID int not null,  
                     Exam_Title  varchar(255) default null, 
                     Exam_Deatils  TEXT default null,
                     Exam_Date  varchar(255) default null, 
                     Exam_Addeddate datetime default CURRENT_TIMESTAMP,
                     Exam_Status  varchar(255) default null);`


connection.query(exams, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var grads = `create table if  not exists grads(
                     Grad_ID int primary key auto_increment,
                     Exam_ID int not null,
                     Student_ID int not null,  
                     Exam_Score  varchar(255) default null, 
                     Grad_Addeddate datetime default CURRENT_TIMESTAMP);`


connection.query(grads, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });


var attitude = `create table if  not exists attitude(
                     Attitude_ID int primary key auto_increment,
                     Student_ID int not null,
                     Attitude_Interaction  int not null,
                     Attitude_Note  varchar(255) default null, 
                     Attitude_Status  varchar(255) default null, 
                     Declaredby_ID  varchar(255) default null, 
                     AY_ID  int not null, 
                     Attitude_Addeddate varchar(255) default null);`


connection.query(attitude, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });


var homeworks_attachement = `CREATE TABLE IF NOT EXISTS homeworks_attachement (
  HA_ID int(11) NOT NULL AUTO_INCREMENT,
  Homework_ID int(11) NOT NULL,
  Homework_Link varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  Homework_Title varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  HA_Status tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (HA_ID)
);`


connection.query(homeworks_attachement, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

// sql_mode
var sql_mode = `SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';`;

connection.query(sql_mode, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }else{
      console.log("sql_mode params");
    }
});

// sql_mode
var sql_mode = `SET SESSION sql_mode = '';`;

connection.query(sql_mode, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }else{
      console.log("SESSION sql_mode params");
    }
});



module.exports = connection; 