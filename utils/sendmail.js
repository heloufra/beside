var fs = require('fs');
var handlebars = require('handlebars');
var transporter  = require('../middleware/transporter');
var readHTMLFile = function(path, callback) {
                    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        }
                        else {
                            callback(null, html);
                        }
                    });
                };

function sendMail(email,first_name) {
	readHTMLFile(__dirname + '/../controllers/templates/email_invitation_template.html', function(err, html) {
                  var template = handlebars.compile(html);
                  var replacements = {
                       name:first_name
                  };
                  var htmlToSend = template(replacements);
                  transporter.sendMail({
                    from: 'besideyou@contact.com',
                    to: email,
                    subject: 'Invitation',
                    html: htmlToSend
                  }, function(error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });

            })

}

module.exports = sendMail;