const jwt = require("jsonwebtoken");
const config = require("../config");

/*
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.session.token;

  // Check if not token
  if (!token) {
    //res.redirect("/");
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
      req.currentStudentId = decoded.currentStudentId;
      next();
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
*/

module.exports = (req, res, next) => {
  var token = jwt.sign(
    {
      User: "admin@beside.ma",
    },
    config.privateKey
  );

  console.log(token);

  if (!req.headers["authorization"]) {
    res.json({
      Error: "Authorization Header Unsetted ",
    });
    return next(500);
  } else {
    authHeader = req.headers["authorization"];
    bearerToken = authHeader.split(" ");
    token = bearerToken[1];
    jwt.verify(token, config.privateKey, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        res.json({
          Error: err.name,
        });
        return next(500);
      }
      req.payload = payload;
      next();
    });
  }
};
