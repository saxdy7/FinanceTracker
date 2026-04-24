const express = require('express');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { verifyToken } = require('../middleware/authMiddleware');

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

    await Budget.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
