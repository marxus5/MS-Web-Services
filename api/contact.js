const nodemailer = require('nodemailer');

const recipient = 'marcus@mswebservices.org';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanSingleLine(value, maxLength) {
  return typeof value === 'string'
    ? value.replace(/[\r\n]+/g, ' ').trim().slice(0, maxLength)
    : '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessName, email, phone, message, website } = req.body || {};
  if (typeof website === 'string' && website.trim()) {
    return res.status(200).json({ ok: true });
  }

  const cleanBusinessName = cleanSingleLine(businessName, 120);
  const cleanEmail = cleanSingleLine(email, 254);
  const cleanPhone = cleanSingleLine(phone, 40);
  const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 5000) : '';

  if (!cleanBusinessName || !emailPattern.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please provide a business name and valid email.' });
  }

  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  if (!user || !password) {
    console.error('Contact email is not configured: set GMAIL_USER and GMAIL_APP_PASSWORD.');
    return res.status(503).json({ error: 'Contact form is temporarily unavailable.' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass: password }
  });

  try {
    await transporter.sendMail({
      from: `Marcus Surjopolos Web Services <${user}>`,
      to: recipient,
      replyTo: cleanEmail,
      subject: `New Website Quote request from ${cleanBusinessName}`,
      text: [
        `Business Name: ${cleanBusinessName}`,
        `Email: ${cleanEmail}`,
        `Phone: ${cleanPhone || 'Not provided'}`,
        '',
        'Project details:',
        cleanMessage || 'No additional details provided'
      ].join('\n')
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return res.status(502).json({ error: 'Contact form is temporarily unavailable.' });
  }
};
