const nodemailer = require('nodemailer');
require('dotenv').config();

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  message = (to, subject, html) => ({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  });

  sendMail(mail) {
    this.transporter.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Message sent: ${info.response}`);
      }
    });
  }
}

module.exports = Mailer;
