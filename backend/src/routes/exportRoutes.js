// Export Routes for CSV/JSON data export
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const exportService = require('../services/exportService');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// GET /api/v1/export/expenses-csv - Export expenses as CSV
router.get('/expenses-csv', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId: userId });

    const result = exportService.exportExpensesToCSV(expenses);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/export/budgets-csv - Export budgets as CSV
router.get('/budgets-csv', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ userId: userId });
    const expenses = await Expense.find({ userId: userId });

    const result = exportService.exportBudgetsToCSV(budgets, expenses);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/export/monthly-report-csv - Export monthly report as CSV
router.get('/monthly-report-csv', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const currentDate = new Date();
    const selectedYear = year ? parseInt(year) : currentDate.getFullYear();
    const selectedMonth = month ? parseInt(month) - 1 : currentDate.getMonth();

    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

    const expenses = await Expense.find({
      userId: userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const monthName = monthStart.toLocaleString('default', { month: 'long', year: 'numeric' });
    const result = exportService.exportMonthlyReport(expenses, [], monthName);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/export/summary-json - Export summary as JSON
router.get('/summary-json', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId: userId });
    const budgets = await Budget.find({ userId: userId });

    const result = exportService.generateSummaryJSON(expenses, budgets, {});

    res.json(result);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/export/full-report - Export complete user data
router.get('/full-report', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;

    const expenses = await Expense.find({ userId: userId });
    const budgets = await Budget.find({ userId: userId });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const budgetStatus = budgets.map(b => ({
      category: b.category,
      limit: b.limit,
      spent: categoryTotals[b.category] || 0
    }));

    const report = exportService.exportFullReport({
      userId: userId,
      email: user.email,
      expenses: expenses,
      budgets: budgets,
      insights: budgetStatus,
      savings: 0,
      totalSpent: totalSpent
    });

    res.json(report);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/export/schedule - Schedule regular exports
router.post('/schedule', verifyToken, async (req, res) => {
  try {
    const { frequency, format, email } = req.body;

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency' });
    }

    if (!['csv', 'json', 'both'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format' });
    }

    res.json({
      success: true,
      message: `Export scheduled: ${frequency} ${format}`,
      schedule: {
        frequency,
        format,
        nextExport: new Date(Date.now() + 24 * 60 * 60 * 1000),
        email: email || req.user.email
      }
    });
  } catch (error) {
    console.error('Schedule Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
