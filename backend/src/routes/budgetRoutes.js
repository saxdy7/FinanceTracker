const express = require('express');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { verifyToken } = require('../middleware/authMiddleware');
const { createNotification } = require('../utils/notificationHelper');

const router = express.Router();

// Get All Budgets for User
router.get('/', verifyToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ budgets });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create Budget
router.post('/', verifyToken, async (req, res) => {
  try {
    const { category, limit, period, startDate, endDate, alerts } = req.body;

    const budget = new Budget({
      userId: req.user.id,
      category,
      limit,
      period,
      startDate,
      endDate,
      alerts
    });

    await budget.save();

    // 🔔 Notification
    const io = req.app.get('io');
    await createNotification({
      userId: req.user.id,
      title: '📊 Budget Created',
      message: `₹${limit.toLocaleString ? limit.toLocaleString('en-IN') : limit} ${period || 'monthly'} budget set for ${category}`,
      type: 'success',
      category: 'budget',
      data: { budgetId: budget._id, category, limit }
    }, io);

    res.status(201).json({ message: 'Budget created', budget });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Budget with Spending Summary
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const expenses = await Expense.find({
      userId: req.user.id,
      category: budget.category,
      date: { $gte: budget.startDate, $lte: budget.endDate }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const percentageSpent = (totalSpent / budget.limit) * 100;

    res.status(200).json({
      budget,
      spending: {
        total: totalSpent,
        percentage: percentageSpent,
        remaining: budget.limit - totalSpent,
        expenses: expenses.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Budget
router.put('/:id', verifyToken, async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(budget, req.body);
    budget.updatedAt = Date.now();
    await budget.save();

    // 🔔 Notification
    const io = req.app.get('io');
    await createNotification({
      userId: req.user.id,
      title: '✏️ Budget Updated',
      message: `${budget.category} budget updated to ₹${budget.limit.toLocaleString('en-IN')}`,
      type: 'info',
      category: 'budget',
      data: { budgetId: budget._id }
    }, io);

    res.status(200).json({ message: 'Budget updated', budget });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete Budget
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const budgetCat = budget.category;
    await Budget.findByIdAndDelete(req.params.id);

    // 🔔 Notification
    const io = req.app.get('io');
    await createNotification({
      userId: req.user.id,
      title: '🗑️ Budget Deleted',
      message: `Budget for ${budgetCat} category was removed`,
      type: 'warning',
      category: 'budget',
      data: {}
    }, io);

    res.status(200).json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
