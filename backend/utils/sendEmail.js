const axios = require('axios');
const config = require('../config/config');

const sendEmail = async ({ email, subject, message, html }) => {
  if (!config.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is missing');
  }

  if (!config.SENDER_EMAIL) {
    throw new Error('SENDER_EMAIL is missing');
  }

  const payload = {
    sender: {
      name: config.FROM_NAME || 'Sprintly',
      email: config.SENDER_EMAIL,
    },
    to: [
      {
        email,
      },
    ],
    subject,
    htmlContent: html || `<p>${message || ''}</p>`,
    textContent: message || '',
  };

  const response = await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    payload,
    {
      headers: {
        'api-key': config.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 15000,
    }
  );

  return response.data;
};

module.exports = sendEmail;