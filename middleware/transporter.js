const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
     "736519892367-9tupn5vrr1cro4e6g3fb6gojabv0mfm4.apps.googleusercontent.com", 
     "cO6dZe4wiNeaJPtf7KbVl-YG", 
     "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
     refresh_token: "1//04zjXU1ZiNe3eCgYIARAAGAQSNwF-L9IrNeOMHD2y9WhAIFgmiYyNFX5cJi-Xm_MSiwo0pDl7jTTe2pYLQ3DbyGHMj3_GQd8bF_c"
});

const accessToken = oauth2Client.getAccessToken()
const smtpConfig = {
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "mailertester146@gmail.com", 
          clientId: "736519892367-9tupn5vrr1cro4e6g3fb6gojabv0mfm4.apps.googleusercontent.com",
          clientSecret: "cO6dZe4wiNeaJPtf7KbVl-YG",
          refreshToken: "1//04zjXU1ZiNe3eCgYIARAAGAQSNwF-L9IrNeOMHD2y9WhAIFgmiYyNFX5cJi-Xm_MSiwo0pDl7jTTe2pYLQ3DbyGHMj3_GQd8bF_c",
          accessToken: accessToken
     }
};


const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;