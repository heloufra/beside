const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
     "284865258866-0mbmm3m21jn607l5ih66786vm0pormu4.apps.googleusercontent.com", 
     "2aCkxnogXn2CGs_eBqVAmJsK", 
     "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ 
     refresh_token: "1//04g5mGYtyd9RPCgYIARAAGAQSNwF-L9Irv5GXIfwQJUXgJ9p4o-dPE3MprlD6mkqm-oiLjkPTzqcrUpTfYL1S8I8lC_VAAgSVxws"
});

const accessToken = oauth2Client.getAccessToken();
const smtpConfig = {
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "teambeside.ma@gmail.com",
          clientId: "284865258866-0mbmm3m21jn607l5ih66786vm0pormu4.apps.googleusercontent.com",
          clientSecret: "2aCkxnogXn2CGs_eBqVAmJsK",
          refreshToken: "1//04g5mGYtyd9RPCgYIARAAGAQSNwF-L9Irv5GXIfwQJUXgJ9p4o-dPE3MprlD6mkqm-oiLjkPTzqcrUpTfYL1S8I8lC_VAAgSVxws",
          accessToken: accessToken
     }
};


const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;