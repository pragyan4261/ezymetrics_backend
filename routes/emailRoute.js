const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Configure the email transport using the default SMTP transport and a Gmail account
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: 'parakhdas45@gmail.com', // your email
    pass: 'tccm hujo nujt nrub', // your email password or app-specific password
  },
});

// Send Email Endpoint
router.post('/send-email', async (req, res) => {
  const { recipient, subject, message } = req.body;

  const mailOptions = {
    from: 'parakhdas45@gmail.com', // sender address
    to: recipient, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
