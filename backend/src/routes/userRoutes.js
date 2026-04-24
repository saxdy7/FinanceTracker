const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get User Profile
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update User Profile
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { firstName, lastName, phone, profilePicture, preferences } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (profilePicture) user.profilePicture = profilePicture;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add Bank Account
router.post('/:id/bank-accounts', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { bankName, accountNumber, accountHolder } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.bankAccounts.push({
      bankName,
      accountNumber,
      accountHolder,
      verified: false
    });

    await user.save();
    res.status(201).json({ message: 'Bank account added', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify Bank Account (Admin only)
router.put('/:userId/bank-accounts/:accountId/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const account = user.bankAccounts.id(req.params.accountId);
    if (!account) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    account.verified = true;
    await user.save();

    res.status(200).json({ message: 'Bank account verified', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
