const nodemailer = require('nodemailer');

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

  message = (from, to, subject, html) => {
    return {
      from,
      to,
      subject,
      html,
    };
  };

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