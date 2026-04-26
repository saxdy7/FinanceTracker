const express = require('express');
const Expense = require('../models/Expense');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Expenses for User
router.get('/', verifyToken, async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
    let query = { userId: req.user.id };

    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(query);

    res.status(200).json({
      expenses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create Expense
router.post('/', verifyToken, async (req, res) => {
  try {
    const { description, amount, category, date, paymentMethod, bankAccountId, bankAccountName, tags, notes } = req.body;

    const expense = new Expense({
      userId: req.user.id,
      description,
      amount,
      category: category ? category.toLowerCase() : category, // normalise casing
      date,
      paymentMethod,
      bankAccountId: bankAccountId || null,
      bankAccountName: bankAccountName || null,
      tags,
      notes
    });

    await expense.save();
    res.status(201).json({ message: 'Expense created', expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Single Expense
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Expense
router.put('/:id', verifyToken, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(expense, req.body);
    expense.updatedAt = Date.now();
    await expense.save();

    res.status(200).json({ message: 'Expense updated', expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete Expense
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
