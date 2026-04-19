const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async ({ email, subject, message, html }) => {
  console.log('SMTP DEBUG', {
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  user: config.SMTP_EMAIL,
  hasPassword: !!config.SMTP_PASSWORD
});
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: Number(config.SMTP_PORT) === 465,
    auth: {
      user: config.SMTP_EMAIL,
      pass: config.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: `${config.FROM_NAME || 'Sprintly'} <${config.SMTP_EMAIL}>`,
    to: email,
    subject,
    text: message || '',
    html: html || '',
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;