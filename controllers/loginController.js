var connection  = require('../lib/db');
var transporter  = require('../middleware/transporter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

var loginController = {
  loginView: function(req, res, next) {
    if (req.session.token)
      res.redirect('/Students');
    else
      res.render('login', { title: 'Login'});
  },
  checkEmail: function(req, res, next) {
    const makeid = (length) => {
       var result           = '';
       var characters       = '0123456789';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          if ((i + 1) % 2 === 0)
            result += " ";
       }
       return result;
    }

    var password = makeid(6);
    console.log(req.body)
     connection.query("SELECT `User_ID`,`User_Email` FROM `users` WHERE `User_Email` = ? OR `User_Phone` = ? LIMIT 1", [req.body.email, req.body.email], (err, userResult, fields) => {
       if (err)   res.json({
            errors: [{
            field: "Access denied",
            errorDesc: "Email not exist"
          }]});
        else
        {
          if (userResult.length === 0)
             res.json({
                errors: [{
                field: "Access denied",
                errorDesc: "Email not exist"
              }]});
           else
           {
            console.log(userResult);
              res.json({exist : true});
               transporter.sendMail({
                  from: 'besideyou@contact.com',
                  to: userResult[0].User_Email,
                  subject: 'Verification Code',
                  html: '<h1>Verification Code!</h1><h4>'+ password + '</h4>'
                }, function(error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
                 bcrypt.hash(password.replace(/\s/g, ''), 10, function(err, hash) {
                    connection.query("UPDATE `users` SET `User_Password`= ? WHERE  `User_Email` = ? OR `User_Phone` = ? LIMIT 1", [hash,req.body.email, req.body.email]);
                 })
           }
        }
      });
  },
  checkCode: function(req, res, next) {
    console.log(req.body)
     connection.query("SELECT `User_ID`,`User_Password` FROM `users` WHERE `User_Email` = ? OR `User_Phone` = ? LIMIT 1", [req.body.email, req.body.email], (err, user, fields) => {
       if (err)   res.json({
            errors: [{
            field: "Access denied",
            errorDesc: "Code not valid"
          }]});
        else
        {
          bcrypt.compare(req.body.code, user[0].User_Password, function(err, result) {
             if (err)   res.json({
                errors: [{
                field: "Access denied",
                errorDesc: "Code not valid"
              }]});
            else
            {
              if (result)
              {
                var userId = user[0].User_ID;
                var token = jwt.sign({
                      userId
                    }, config.privateKey);
                req.session.token = token;
                console.log(token);
              } else
                req.session.destroy();
              res.json({login : result});
            }
          })
        }
      });
  },
  logout: function(req, res) {
    req.session.destroy();
    res.redirect('/');
  },
};

module.exports = loginController;