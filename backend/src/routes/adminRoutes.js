const express = require('express');
const User = require('../models/User');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Users (Admin only)
router.get('/users', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Unverified Bank Accounts (Admin only)
router.get('/bank-accounts/unverified', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({
      'bankAccounts.verified': false
    });

    const unverifiedAccounts = [];
    users.forEach(user => {
      user.bankAccounts.forEach(account => {
        if (!account.verified) {
          unverifiedAccounts.push({
            userId: user._id,
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email,
            ...account.toObject()
          });
        }
      });
    });

    res.status(200).json({ unverifiedAccounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard Stats (Admin only)
router.get('/stats', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const admins = await User.countDocuments({ role: 'admin' });

    res.status(200).json({
      stats: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        admins
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
