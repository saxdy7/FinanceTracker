const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
const { createNotification } = require('../utils/notificationHelper');

const router = express.Router();

// Get User Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update User Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, preferences } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── BANK ACCOUNTS ─────────────────────────────────────────────────────────────

// GET /api/v1/users/bank-accounts
router.get('/bank-accounts', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('bankAccounts');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ bankAccounts: user.bankAccounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/v1/users/bank-accounts
router.post('/bank-accounts', verifyToken, async (req, res) => {
  try {
    const { accountType, bankName, accountNumber, accountHolder, ifscCode, upiId, cardNetwork } = req.body;
    
    // Validate required fields based on type
    if (!accountHolder) {
      return res.status(400).json({ message: 'accountHolder is required' });
    }
    if (accountType === 'upi' && !upiId) {
      return res.status(400).json({ message: 'upiId is required for UPI accounts' });
    }
    if (accountType !== 'upi' && (!bankName || !accountNumber)) {
      return res.status(400).json({ message: 'bankName and last 4 digits of accountNumber are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bankAccounts.push({
      accountType: accountType || 'bank',
      bankName,
      accountNumber,
      accountHolder,
      ifscCode,
      upiId,
      cardNetwork,
      verified: true   // auto-verified
    });
    await user.save();

    // 🔔 Notification
    const io = req.app.get('io');
    const accLabel = accountType === 'upi'
      ? `UPI (${upiId})`
      : accountType === 'credit-card' || accountType === 'debit-card'
        ? `${cardNetwork || ''} ${accountType} ****${accountNumber}`
        : `${bankName} Bank ****${accountNumber}`;
    await createNotification({
      userId: req.user.id,
      title: '🏦 Payment Method Added',
      message: `${accLabel} linked to your account`,
      type: 'success',
      category: 'payment',
      data: { accountType, bankName, accountNumber }
    }, io);

    res.status(201).json({ message: 'Payment method added', bankAccounts: user.bankAccounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/v1/users/bank-accounts/:accountId
router.delete('/bank-accounts/:accountId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const removed = user.bankAccounts.find(acc => acc._id.toString() === req.params.accountId);
    user.bankAccounts = user.bankAccounts.filter(
      (acc) => acc._id.toString() !== req.params.accountId
    );
    await user.save();

    // 🔔 Notification
    const io = req.app.get('io');
    if (removed) {
      await createNotification({
        userId: req.user.id,
        title: '🏦 Payment Method Removed',
        message: `${removed.bankName || removed.upiId || 'A payment method'} was unlinked from your account`,
        type: 'warning',
        category: 'payment',
        data: {}
      }, io);
    }

    res.status(200).json({ message: 'Payment method removed', bankAccounts: user.bankAccounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/v1/users/bank-accounts/:accountId/verify  (admin)
router.put('/bank-accounts/:accountId/verify', verifyToken, async (req, res) => {
  try {
    const { userId } = req.body; // admin passes target userId
    const targetId = userId || req.user.id;
    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const account = user.bankAccounts.id(req.params.accountId);
    if (!account) return res.status(404).json({ message: 'Bank account not found' });

    account.verified = true;
    await user.save();
    res.status(200).json({ message: 'Bank account verified', bankAccounts: user.bankAccounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
