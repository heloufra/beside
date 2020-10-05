var express = require('express');
var router = express.Router();
var studentController  = require('../controllers/studentController');
var connection  = require('../lib/db');

router.get('/', (req, res, next) => {
	connection.query("SELECT * FROM `users` WHERE `User_ID` = ? LIMIT 1", [req.userId], (err, user, fields) => {
        connection.query("SELECT * FROM `institutions` WHERE `Institution_ID` = ? LIMIT 1", [req.userId], (err, institutions, fields) => {
          connection.query("SELECT AY_ID FROM `academicyear` WHERE `Institution_ID` = ? LIMIT 1", [institutions[0].Institution_ID], (err, academic, fields) => {
            connection.query("SELECT * FROM `classes` WHERE AY_ID = ?", [academic[0].AY_ID], (err, classes, fields) => {
              connection.query("SELECT * FROM `levels` WHERE AY_ID = ?", [academic[0].AY_ID], (err, levels, fields) => {
                res.render('teacher', { title: 'Teachers' , user: user[0], institution:institutions[0], classes:classes,levels:levels});
              })
            })
          })
        })
      })
});

module.exports = router;