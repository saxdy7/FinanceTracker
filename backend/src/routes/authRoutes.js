const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Email Transporter ────────────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register User
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login User
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Current User
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Verify Email
router.post('/verify-email', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('verificationToken').notEmpty().withMessage('Verification token is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, verificationToken } = req.body;

    const user = await User.findOne({ email, verificationToken });
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token or email' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request Password Reset — sends real email with reset link
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    // Always respond with success to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate a cryptographically secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Build the reset URL pointing to the frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email
    const transporter = createTransporter();
    const mailOptions = {
      from: `"FinanceTracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your FinanceTracker Password',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:12px">
          <div style="text-align:center;margin-bottom:32px">
            <h1 style="color:#1e40af;font-size:28px;margin:0">💰 FinanceTracker</h1>
          </div>
          <div style="background:white;border-radius:8px;padding:32px;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
            <h2 style="color:#111827;margin-top:0">Reset Your Password</h2>
            <p style="color:#6b7280">Hi ${user.firstName},</p>
            <p style="color:#6b7280">We received a request to reset your FinanceTracker password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
            <div style="text-align:center;margin:32px 0">
              <a href="${resetUrl}" style="background:#2563eb;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block">Reset Password</a>
            </div>
            <p style="color:#9ca3af;font-size:13px">If you didn't request this, you can safely ignore this email. Your password will not change.</p>
            <p style="color:#9ca3af;font-size:13px">Or copy this link: <a href="${resetUrl}" style="color:#2563eb">${resetUrl}</a></p>
          </div>
          <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:24px">© 2026 FinanceTracker. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
});

// Reset Password — token comes from the URL link sent in email
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, email, newPassword } = req.body;

    // Hash the incoming token and compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send Verification Email (for registration)
router.post('/send-verification-email', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.verificationToken = verificationToken;
    await user.save();

    res.status(200).json({
      message: 'Verification email sent',
      verificationToken: verificationToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google OAuth
router.post('/google', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('googleId').notEmpty().withMessage('Google ID is required')
], async (req, res) => {
  try {
    console.log('🔐 Google Auth Request:', { email: req.body.email, name: req.body.name });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation Error:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, image, googleId } = req.body;
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || 'Google';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    console.log('📝 Processing Google User:', { firstName, lastName, email, googleId });

    // Check if user exists
    let user = await User.findOne({ email });
    console.log('🔍 User Found:', user ? 'YES' : 'NO (creating new)');

    if (!user) {
      // Create new user from Google
      user = new User({
        firstName: firstName,
        lastName: lastName,
        email,
        profilePicture: image,
        password: Math.random().toString(36).substring(2, 15),
        isVerified: true
      });
      console.log('💾 Saving New User:', user);
      await user.save();
      console.log('✅ User Saved:', user._id);
    }

    const token = generateToken(user._id, user.role);
    console.log('🔑 Token Generated:', token.substring(0, 20) + '...');

    const response = {
      message: 'Google login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified
      },
      token
    };

    console.log('✅ Google Auth Success:', response.user.id);
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Google Auth Error:', error.message);
    console.error('Error Stack:', error.stack);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
