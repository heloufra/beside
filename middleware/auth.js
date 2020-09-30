const jwt = require("jsonwebtoken");
const config = require('../config');

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
    req.userId = decoded.userId;
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