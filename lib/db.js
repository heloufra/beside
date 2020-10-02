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
                          Institution_Link varchar(255) default null, 
                          Institution_Addeddate datetime default CURRENT_TIMESTAMP, 
                          Institution_Status varchar(255) default null);`;

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
                          User_Addeddate datetime default CURRENT_TIMESTAMP, 
                          User_Status varchar(255) default null);`;

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
                          IU_Status varchar(255) default null);`;

connection.query(institutionsusers, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var academicyear = `create table if  not exists academicyear(
                          AY_ID int primary key auto_increment, 
                          AY_Label varchar(255) default null,
                          AY_Satrtdate datetime default null, 
                          AY_EndDate datetime default null, 
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
                         Level_Status varchar(255) default null,
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
                        Classe_Status varchar(255) default null, 
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
                       Subject_Status varchar(255) default null);`


connection.query(subjects, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var levelsubjects = `create table if  not exists levelsubjects(
                       LS_ID int primary key auto_increment, 
                       Level_ID int not null, 
                       Subject_ID int not null, 
                       LS_Status varchar(255) default null, 
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
                       Expense_Status varchar(255) default null, 
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
                      LE_Status varchar(255) default null, 
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
                     Student_Phone varchar(255) default null,  
                     Student_Addeddate datetime default CURRENT_TIMESTAMP, 
                     Student_Status varchar(255) default null, 
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
                     SP_Status varchar(255) default null);`


connection.query(studentsparents, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var studentsubscribtion = `create table if  not exists studentsubscribtion(
                     SS_ID int primary key auto_increment, 
                     Student_ID int not null, 
                     LE_ID int not null, 
                     Subscription_StartDate datetime default null, 
                     Subscription_EndDate datetime default null, 
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
                     TSC_Status varchar(255) default null, 
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
                     Parent_Addeddate datetime default CURRENT_TIMESTAMP, 
                     Parent_Status varchar(255) default null,
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
                     AD_Status varchar(255) default null, 
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
                     SC_Status varchar(255) default null, 
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
                     SP_PaidPeriod datetime default null,
                     SP_Status varchar(255) default null);`


connection.query(studentspayments, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

var homeworks = `create table if  not exists homeworks(
                     Homework_ID int primary key auto_increment,
                     TSC_ID int not null,  
                     Homework_Title  varchar(255) default null, 
                     Homework_Deatils  varchar(255) default null,
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
                     Exam_Deatils  varchar(255) default null,
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
// Attitude_Interaction, Attitude_Note, Attitude_Addeddate,  Attitude_Status, Declaredby_ID, AY_ID
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

connection.query("ALTER TABLE subjects ADD UNIQUE KEY `subject_unique` (`Subject_Label`);", function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

module.exports = connection; 