// Export Service for CSV and JSON data export
const json2csv = require('json2csv').parse;

class ExportService {
  exportToCSV(data, filename) {
    try {
      const csv = json2csv(data);
      return {
        success: true,
        data: csv,
        filename: filename || 'export.csv',
        mimeType: 'text/csv'
      };
    } catch (error) {
      console.error('CSV Export Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  exportExpensesToCSV(expenses) {
    const formattedData = expenses.map(exp => ({
      Date: new Date(exp.date).toLocaleDateString(),
      Category: exp.category,
      Description: exp.description,
      Amount: `$${exp.amount.toFixed(2)}`,
      'Recurring?': exp.isRecurring ? 'Yes' : 'No',
      Notes: exp.notes || ''
    }));

    return this.exportToCSV(formattedData, 'expenses.csv');
  }

  exportBudgetsToCSV(budgets, expenses) {
    const formattedData = budgets.map(budget => {
      const categoryExpenses = expenses.filter(e => e.category === budget.category);
      const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      const percentage = ((totalSpent / budget.limit) * 100).toFixed(1);

      return {
        Category: budget.category,
        'Budget Limit': `$${budget.limit.toFixed(2)}`,
        'Total Spent': `$${totalSpent.toFixed(2)}`,
        'Remaining': `$${(budget.limit - totalSpent).toFixed(2)}`,
        'Usage %': `${percentage}%`,
        Period: budget.period,
        Status: percentage > 100 ? 'Exceeded' : percentage > 80 ? 'Warning' : 'On Track'
      };
    });

    return this.exportToCSV(formattedData, 'budgets.csv');
  }

  exportMonthlyReport(expenses, budgets, month) {
    const formattedData = expenses.map(exp => ({
      'Transaction Date': new Date(exp.date).toLocaleDateString(),
      Category: exp.category,
      Description: exp.description,
      Amount: exp.amount,
      Type: 'Expense'
    }));

    return this.exportToCSV(formattedData, `monthly_report_${month}.csv`);
  }

  generateSummaryJSON(expenses, budgets, analyticsData) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = {};

    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const budgetStatus = budgets.map(b => ({
      category: b.category,
      limit: b.limit,
      spent: categoryTotals[b.category] || 0,
      remaining: b.limit - (categoryTotals[b.category] || 0),
      percentage: ((categoryTotals[b.category] || 0) / b.limit * 100).toFixed(1)
    }));

    return {
      success: true,
      summary: {
        exportDate: new Date().toISOString(),
        totalExpenses: totalExpenses.toFixed(2),
        categoryBreakdown: categoryTotals,
        budgetStatus: budgetStatus,
        analytics: analyticsData
      }
    };
  }

  exportFullReport(userData) {
    const report = {
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        user: {
          id: userData.userId,
          email: userData.email
        },
        expenses: userData.expenses,
        budgets: userData.budgets,
        insights: userData.insights,
        totalSpent: userData.expenses.reduce((sum, e) => sum + e.amount, 0),
        savings: userData.savings
      }
    };

    return report;
  }
}

module.exports = new ExportService();
