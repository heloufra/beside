const jwt = require("jsonwebtoken");
const config = require('../config');
var createError = require('http-errors');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.session.token;
 
  // Check if not token
  if (!token) {
      res.redirect('/');
     res.json({
      errors: [{
      field: "Access denied",
      errorDesc: "Token Expired"
      }]});  
   }
   else {
     try {
          const decoded = jwt.verify(token, config.privateKey);
          if (decoded.role !== 'Admin')
          {
            res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "Role is not valid"
                }]});
          }
          else
            next();
    } catch (err) {
       res.json({
                  errors: [{
                  field: "Access denied",
                  errorDesc: "Token is not valid"
                }]});  
    }
   }
};