const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fcscourse13@gmail.com',
    pass: 'lvlfttvlnrlqzrhh'
  }
});


exports.sendMail = function (reciever, message) {

    var mailOptions = {
        from: 'fcscourse13@gmail.com',
        to: "" + reciever,
        subject: 'OTP for your account',
        text: "" + message
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent');
        }
      });
}