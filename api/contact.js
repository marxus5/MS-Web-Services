const nodemailer = require('nodemailer');

const recipient = 'marcus@mswebservices.org';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactReasons = {
  website_starter: 'Starter website-only plan ($59/mo)',
  website_business: 'Business website-only plan ($89/mo)',
  website_growth: 'Growth & Ecommerce website-only plan ($149/mo)',
  marketing_starter: 'Starter website + social management plan ($199/mo)',
  marketing_business: 'Business website + social management plan ($399/mo)',
  marketing_growth: 'Growth website + social management plan ($699/mo)',
  other: 'Something else'
};

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

  const { name, email, phone, reason, message, website } = req.body || {};
  if (typeof website === 'string' && website.trim()) {
    return res.status(200).json({ ok: true });
  }

  const cleanName = cleanSingleLine(name, 120);
  const cleanEmail = cleanSingleLine(email, 254);
  const cleanPhone = cleanSingleLine(phone, 40);
  const cleanReason = cleanSingleLine(reason, 60);
  const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 5000) : '';
  const contactReason = Object.prototype.hasOwnProperty.call(contactReasons, cleanReason)
    ? contactReasons[cleanReason]
    : '';

  if (!cleanName || !emailPattern.test(cleanEmail) || !cleanPhone || !contactReason) {
    return res.status(400).json({ error: 'Please provide your name, a valid email, phone number, and reason for contacting us.' });
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
      subject: `New ${contactReason} quote request from ${cleanName}`,
      text: [
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Phone: ${cleanPhone || 'Not provided'}`,
        `Reason for contacting: ${contactReason}`,
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
