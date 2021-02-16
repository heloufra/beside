const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
     "284865258866-h725pjpfk4v47u6ititt5hh72d1k4g7s.apps.googleusercontent.com", 
     "6PQPSMILn2JJoeoMxNaI5RvH", 
     "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ 
     refresh_token: "1//04VlbjLQDG_zDCgYIARAAGAQSNwF-L9IrZeznKwgqkaBeSMcFP9N_ftfLnQg8ddCLTmske4b8Dj6fd72Z2EaNSHsOMOGLZGmrSgg"

});

const accessToken = oauth2Client.getAccessToken();
const smtpConfig = {
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "teambeside.ma@gmail.com",
          clientId: "284865258866-h725pjpfk4v47u6ititt5hh72d1k4g7s.apps.googleusercontent.com",
          clientSecret: "6PQPSMILn2JJoeoMxNaI5RvH",
          refreshToken: "1//04VlbjLQDG_zDCgYIARAAGAQSNwF-L9IrZeznKwgqkaBeSMcFP9N_ftfLnQg8ddCLTmske4b8Dj6fd72Z2EaNSHsOMOGLZGmrSgg",
          accessToken: accessToken
     }
};


const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;