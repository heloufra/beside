const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.session.token;

  // Check if not token
  if (!token) {
    res.redirect("/");
    res.json({
      errors: [
        {
          field: "Access denied",
          errorDesc: "Token Expired",
        },
      ],
    });
  } else {
    try {
      const decoded = jwt.verify(token, config.privateKey);
      req.userId = decoded.userId;
      req.Institution_ID = decoded.Institution_ID;
      req.role = decoded.role;
      switch(req.role) {
        case "Student":
          res.redirect("/my-absences");
          break;
        case "Parent":
          res.redirect("/student-absences");
          break;
        case "Admin":
        case "Teacher":
          res.redirect("/Students");
          break;
        default:
          break;
      }
    } catch (err) {
      res.json({
        errors: [
          {
            field: "Access denied",
            errorDesc: "Token is not valid",
          },
        ],
      });
    }
  }
};
