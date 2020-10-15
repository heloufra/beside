var express = require('express');
var router = express.Router();
var studentController  = require('../controllers/studentController');
var connection  = require('../lib/db');

router.get('/', (req, res, next) => {
 connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
      connection.query("SELECT institutions.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE users.User_ID = ?", [req.userId], (err, accounts, fields) => {
        connection.query("SELECT users.* FROM users INNER JOIN institutionsusers ON institutionsusers.User_ID = users.User_ID INNER JOIN institutions ON institutionsusers.Institution_ID = institutions.Institution_ID WHERE institutions.Institution_ID = ? AND users.User_Email = ?", [req.Institution_ID,user[0].User_Email], (err, users, fields) => {                
          connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, institutions, fields) => {
            connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [req.Institution_ID], (err, academic, fields) => {
              connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
                connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                  res.render('finance', { title: 'Finance' , user: user[0], institution:institutions[0], classes:classes,levels:levels,accounts,users});
                })
              })
            })
          })
        })
      })
    })
});

module.exports = router;