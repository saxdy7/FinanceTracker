// Analytics Routes for spending insights and financial analysis
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// GET /api/v1/analytics/overview - Get spending overview
router.get('/overview', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const monthlyExpenses = await Expense.find({
      userId: userId,
      date: { $gte: monthStart }
    });

    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = {};
    const categoryCount = {};

    monthlyExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0] || [
      'None',
      0
    ];

    res.json({
      success: true,
      overview: {
        totalSpent: totalSpent.toFixed(2),
        transactionCount: monthlyExpenses.length,
        averageExpense: (monthlyExpenses.length > 0 ? totalSpent / monthlyExpenses.length : 0).toFixed(2),
        topCategory: topCategory[0],
        topCategoryAmount: topCategory[1] ? topCategory[1].toFixed(2) : '0.00',
        categoryBreakdown: categoryTotals,
        categoryCount: categoryCount
      }
    });
  } catch (error) {
    console.error('Analytics Overview Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/analytics/trends - Get spending trends
router.get('/trends', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const trends = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const monthExpenses = await Expense.find({
        userId: userId,
        date: { $gte: monthDate, $lte: monthEnd }
      });

      const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      trends.push({
        month: monthDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
        total: total.toFixed(2),
        transactionCount: monthExpenses.length
      });
    }

    res.json({
      success: true,
      trends: trends
    });
  } catch (error) {
    console.error('Trends Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/analytics/category-breakdown - Get category breakdown
router.get('/category-breakdown', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();

    const expenses = await Expense.find({
      userId: userId,
      date: { $gte: start, $lte: end }
    });

    const categoryData = {};
    expenses.forEach(exp => {
      categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
    });

    const breakdown = Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount: amount.toFixed(2),
      percentage: ((amount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)
    }));

    res.json({
      success: true,
      breakdown: breakdown.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    });
  } catch (error) {
    console.error('Category Breakdown Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/analytics/budget-vs-actual - Compare budgets with actual spending
router.get('/budget-vs-actual', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ userId: userId });

    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const comparison = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Expense.find({
          userId: userId,
          category: budget.category,
          date: { $gte: monthStart }
        });

        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const variance = budget.limit - totalSpent;

        return {
          category: budget.category,
          budgeted: budget.limit.toFixed(2),
          actual: totalSpent.toFixed(2),
          variance: variance.toFixed(2),
          percentage: ((totalSpent / budget.limit) * 100).toFixed(1),
          status: variance > 0 ? 'Under Budget' : 'Over Budget'
        };
      })
    );

    res.json({
      success: true,
      comparison: comparison
    });
  } catch (error) {
    console.error('Budget Comparison Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/analytics/recommendations - Get AI-powered recommendations
router.get('/recommendations', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId: userId });
    const budgets = await Budget.find({ userId: userId });

    const recommendations = [];
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Rule-based recommendations
    budgets.forEach((budget) => {
      const categoryExpenses = expenses.filter(e => e.category === budget.category);
      const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      const percentage = (spent / budget.limit) * 100;

      if (percentage > 100) {
        recommendations.push({
          type: 'warning',
          category: budget.category,
          message: `You've exceeded your ${budget.category} budget by $${(spent - budget.limit).toFixed(2)}.`,
          priority: 'high'
        });
      } else if (percentage > 80) {
        recommendations.push({
          type: 'alert',
          category: budget.category,
          message: `You've reached ${percentage.toFixed(1)}% of your ${budget.category} budget.`,
          priority: 'medium'
        });
      }
    });

    // Savings opportunity recommendations
    const avgMonthlySpent = totalSpent / Math.max(expenses.length / 30, 1);
    if (avgMonthlySpent > 3000) {
      recommendations.push({
        type: 'opportunity',
        message: 'Your monthly spending is high. Consider setting stricter budget limits.',
        priority: 'medium'
      });
    }

    // Category variability
    budgets.forEach((budget) => {
      const categoryExpenses = expenses
        .filter(e => e.category === budget.category)
        .map(e => e.amount)
        .sort((a, b) => a - b);

      if (categoryExpenses.length > 0) {
        const avg = categoryExpenses.reduce((a, b) => a + b) / categoryExpenses.length;
        const variance = Math.sqrt(
          categoryExpenses.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / categoryExpenses.length
        );

        if (variance > avg * 0.5) {
          recommendations.push({
            type: 'insight',
            category: budget.category,
            message: `High variability in ${budget.category} spending. Try to maintain consistent expenses.`,
            priority: 'low'
          });
        }
      }
    });

    res.json({
      success: true,
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
    });
  } catch (error) {
    console.error('Recommendations Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/analytics/comparison - Compare spending periods
router.get('/comparison', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();

    // Current month
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthExpenses = await Expense.find({
      userId: userId,
      date: { $gte: currentMonthStart }
    });

    // Previous month
    const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const prevMonthExpenses = await Expense.find({
      userId: userId,
      date: { $gte: prevMonthStart, $lte: prevMonthEnd }
    });

    const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const prevTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const change = ((currentTotal - prevTotal) / prevTotal * 100).toFixed(1);

    res.json({
      success: true,
      comparison: {
        currentMonth: currentTotal.toFixed(2),
        previousMonth: prevTotal.toFixed(2),
        change: change,
        trend: change > 0 ? 'increased' : 'decreased',
        transactionCount: {
          current: currentMonthExpenses.length,
          previous: prevMonthExpenses.length
        }
      }
    });
  } catch (error) {
    console.error('Comparison Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
