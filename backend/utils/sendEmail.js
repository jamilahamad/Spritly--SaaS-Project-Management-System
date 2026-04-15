const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async ({ email, subject, message, html }) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false, // use false for port 587
    auth: {
      user: config.SMTP_EMAIL,
      pass: config.SMTP_PASSWORD,
    },
  });

  await transporter.verify();

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