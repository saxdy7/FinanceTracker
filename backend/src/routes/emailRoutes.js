// Email Routes for sending notifications and reports
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const emailService = require('../services/emailService');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// POST /api/v1/email/alert - Send budget alert
router.post('/alert', authMiddleware, async (req, res) => {
  try {
    const { category, spent, limit } = req.body;
    const userEmail = req.user.email;

    if (!category || !spent || !limit) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const percentage = ((spent / limit) * 100).toFixed(1);

    const result = await emailService.sendBudgetAlert(userEmail, {
      category,
      spent,
      limit,
      percentage
    });

    res.json(result);
  } catch (error) {
    console.error('Email Alert Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/email/weekly-summary - Send weekly summary
router.post('/weekly-summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Get user expenses from this week
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyExpenses = await Expense.find({
      userId: userId,
      date: { $gte: sevenDaysAgo }
    });

    // Get user budgets
    const userBudgets = await Budget.find({ userId: userId });

    const totalSpent = weeklyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const budgetStatus = userBudgets.map(b => ({
      category: b.category,
      spent: weeklyExpenses
        .filter(e => e.category === b.category)
        .reduce((sum, e) => sum + e.amount, 0),
      limit: b.limit
    }));

    const result = await emailService.sendWeeklySummary(userEmail, {
      totalSpent,
      budgetStatus,
      savings: (budgetStatus.reduce((sum, b) => sum + (b.limit - b.spent), 0)),
      period: `${sevenDaysAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}`
    });

    res.json(result);
  } catch (error) {
    console.error('Weekly Summary Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/email/monthly-report - Send monthly report
router.post('/monthly-report', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const { month } = req.body;

    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyExpenses = await Expense.find({
      userId: userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const categoryBreakdown = {};
    monthlyExpenses.forEach(exp => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    });

    const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthName = monthStart.toLocaleString('default', { month: 'long', year: 'numeric' });

    const result = await emailService.sendMonthlyReport(userEmail, {
      month: monthName,
      totalIncome: 0, // This would come from income tracking
      totalExpenses,
      categoryBreakdown,
      savings: 0 // This would be calculated from income - expenses
    });

    res.json(result);
  } catch (error) {
    console.error('Monthly Report Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/email/verification - Send verification email
router.post('/verification', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: 'Email and token required' });
    }

    const result = await emailService.sendVerificationEmail(email, token);
    res.json(result);
  } catch (error) {
    console.error('Verification Email Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/email/password-reset - Send password reset email
router.post('/password-reset', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: 'Email and token required' });
    }

    const result = await emailService.sendPasswordReset(email, token);
    res.json(result);
  } catch (error) {
    console.error('Reset Email Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/email/test - Test email configuration
router.post('/test', authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const testHtml = `
      <h2>Test Email from FinanceTracker</h2>
      <p>Hi ${req.user.name},</p>
      <p>This is a test email to verify your email configuration is working correctly.</p>
      <p>If you received this, your email notifications are set up properly!</p>
      <p>Best regards,<br>FinanceTracker Team</p>
    `;

    const result = await emailService.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Test Email - FinanceTracker',
      html: testHtml
    });

    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test Email Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
