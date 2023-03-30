const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const refresh_token = "1//04SKkIjHQE4oVCgYIARAAGAQSNwF-L9IrHwYnYwsYaHFdY5LmuMX9sOhGHRT7r9ralVVQeqIVXdPRXywz9tCluj-f-jfz-q8wkHs";
const clientId = "803374857080-9sl1n8u9j5g2oo0kid8622r1vq41sg24.apps.googleusercontent.com";
const clientSecret = "_AC9IplZ5MRt9NHXv9vtZmC9";
const oauthplayground =  "https://developers.google.com/oauthplayground";
const oauth2Client = new OAuth2(
     clientId,
     clientSecret, 
     oauthplayground
);

oauth2Client.setCredentials({ 
     refresh_token: refresh_token
});

google.options({ auth: oauth2Client }); // Apply the settings globally 


const accessToken = new Promise( async (resolve, reject) => {
     oauth2Client.getAccessToken((err, token) => {
          if (err){
               console.log("err =>",err);
          }
          else{
               console.log("token =>",token);
               resolve(token);
          } 
     });
});



//oauth2Client.getAccessToken().then(data=> console.log("accessToken data =>",data)).catch(e=>console.log(e));

//const accessToken = "ya29.A0ARrdaM_W1URLn5Ox6NpSMa90cfkiJmA5sDPSDiMnniqZxVLJJLKRYC7R9QeeGZ4qHAWzMIB77_QXb5J3V7WaoTQRwUEBZzwdqCgr8P-CKbLnP-Q4u9oVYO-Tw8FfZLuOGtRTlPoH2Pi7GUFKcDpX6HGmZwIY"; 

const smtpConfig = {
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "contact@beside.ma",
          clientId: clientId, 
          clientSecret:  clientSecret,
          refreshToken:refresh_token,
          accessToken: accessToken
     }
};


const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;