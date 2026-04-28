const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// POST /api/v1/contact/submit
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Send emails
    const result = await emailService.sendContactFormSubmission({
      name,
      email,
      subject,
      message
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been sent. We will get back to you soon.',
        data: { name, email, subject }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error sending message. Please try again later.',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      error: error.message
    });
  }
});

module.exports = router;
