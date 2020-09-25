 var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'localhost',
   port: 3308,
   user:'root',
   password:'',
   database:'beside_db',
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

/*connection.query("ALTER TABLE subjects ADD UNIQUE KEY `subject_unique` (`Subject_Label`);", function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });*/

module.exports = connection; 