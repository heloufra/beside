const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
     "803374857080-9sl1n8u9j5g2oo0kid8622r1vq41sg24.apps.googleusercontent.com", 
     "-G3VM-iwstuWFKF7kf1stS8E", 
     "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ 
     refresh_token: "1//04yLIn8iDd9m9CgYIARAAGAQSNwF-L9Irpqk9B47Ag1njlIAQfvvivYIQBTb8o1Mgeo_oaRRsjcOo9OtMYVogcDIlbqeDieR8dns"

});

const accessToken = oauth2Client.getAccessToken();
const smtpConfig = {
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "contact@beside.ma",
          clientId: "803374857080-9sl1n8u9j5g2oo0kid8622r1vq41sg24.apps.googleusercontent.com", 
          clientSecret:  "-G3VM-iwstuWFKF7kf1stS8E", 
          refreshToken: "1//04yLIn8iDd9m9CgYIARAAGAQSNwF-L9Irpqk9B47Ag1njlIAQfvvivYIQBTb8o1Mgeo_oaRRsjcOo9OtMYVogcDIlbqeDieR8dns",
          accessToken: accessToken
     }
};


const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;