const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
     "284865258866-h725pjpfk4v47u6ititt5hh72d1k4g7s.apps.googleusercontent.com", 
     "6PQPSMILn2JJoeoMxNaI5RvH", 
     "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ 
     refresh_token: "1//04b6WDtrqgxn8CgYIARAAGAQSNwF-L9IrNgKMl1xbgPB6IfuSZOtWrse45r0SQ4Vss6DTF1w0C9i6RiS88o8Eco_MzWaKLQa9_H8"

});

const accessToken = oauth2Client.getAccessToken();
const smtpConfig = {
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "teambeside.ma@gmail.com",
          clientId: "284865258866-h725pjpfk4v47u6ititt5hh72d1k4g7s.apps.googleusercontent.com",
          clientSecret: "6PQPSMILn2JJoeoMxNaI5RvH",
          refreshToken: "1//04b6WDtrqgxn8CgYIARAAGAQSNwF-L9IrNgKMl1xbgPB6IfuSZOtWrse45r0SQ4Vss6DTF1w0C9i6RiS88o8Eco_MzWaKLQa9_H8",
          accessToken: accessToken
     }
};


const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;