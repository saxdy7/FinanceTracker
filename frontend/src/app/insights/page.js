'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, LogOut, Settings, Bell, Zap, Target, AlertCircle, TrendingDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, itemVariants, headerVariants, sidebarVariants, contentVariants } from '@/utils/animations';
import MobileNav from '@/components/MobileNav';
import axios from 'axios';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Transactions', href: '/transactions' },
  { icon: MessageSquare, label: 'Expenses', href: '/expenses' },
  { icon: Wallet, label: 'Budgets', href: '/budgets' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Zap, label: 'Insights', href: '/insights' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
];

export default function InsightsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchInsights(token);
  }, [router]);

  const fetchInsights = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Fetch expenses and budgets
      const [expensesRes, budgetsRes] = await Promise.all([
        axios.get(`${apiUrl}/expenses?limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/budgets`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const expenseList = expensesRes.data.expenses || [];
      const budgetList = budgetsRes.data.budgets || [];

      setExpenses(expenseList);
      setBudgets(budgetList);

      // Generate insights
      const generatedInsights = generateFinancialInsights(expenseList, budgetList);
      setInsights(generatedInsights);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setLoading(false);
    }
  };

  const generateFinancialInsights = (expenseList, budgetList) => {
    if (expenseList.length === 0) {
      return {
        summary: 'No expenses yet. Start tracking to get insights!',
        recommendations: [],
        alerts: [],
        spendingPatterns: [],
        budgetStatus: []
      };
    }

    // Calculate totals by category
    const categoryTotals = {};
    const categoryCount = {};
    expenseList.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    });

    const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    const avgExpense = totalSpent / expenseList.length;

    // Get top spending category
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    // Calculate monthly data
    const monthlyData = {};
    expenseList.forEach(exp => {
      const date = new Date(exp.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[month] = (monthlyData[month] || 0) + exp.amount;
    });

    const months = Object.entries(monthlyData).sort();
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    const monthlyGrowth = previousMonth 
      ? ((currentMonth[1] - previousMonth[1]) / previousMonth[1] * 100).toFixed(1)
      : 0;

    // Budget status
    const budgetStatus = budgetList.map(budget => {
      const categoryExpenses = categoryTotals[budget.category] || 0;
      const percentage = (categoryExpenses / budget.limit) * 100;
      return {
        category: budget.category,
        limit: budget.limit,
        spent: categoryExpenses,
        percentage: percentage.toFixed(1),
        status: percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'ok'
      };
    });

    // Generate recommendations
    const recommendations = [];

    if (topCategory && categoryTotals[topCategory[0]] > totalSpent * 0.4) {
      recommendations.push({
        type: 'warning',
        title: `High ${topCategory[0]} Spending`,
        description: `${topCategory[0]} accounts for ${((categoryTotals[topCategory[0]] / totalSpent) * 100).toFixed(1)}% of your spending. Consider setting a budget limit.`,
        icon: AlertCircle
      });
    }

    if (monthlyGrowth > 10) {
      recommendations.push({
        type: 'warning',
        title: 'Spending Increased',
        description: `Your spending increased by ${monthlyGrowth}% this month compared to last month. Review your expenses.`,
        icon: TrendingUp
      });
    } else if (monthlyGrowth < -10) {
      recommendations.push({
        type: 'success',
        title: 'Great Progress!',
        description: `Your spending decreased by ${Math.abs(monthlyGrowth)}% this month. Keep up the good work!`,
        icon: TrendingDown
      });
    }

    const exceededBudgets = budgetStatus.filter(b => b.status === 'exceeded').length;
    if (exceededBudgets > 0) {
      recommendations.push({
        type: 'error',
        title: `${exceededBudgets} Budget(s) Exceeded`,
        description: `You have exceeded ${exceededBudgets} budget limit(s). Review and adjust your spending.`,
        icon: AlertCircle
      });
    }

    if (budgetStatus.filter(b => b.status === 'warning').length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Approaching Budget Limits',
        description: `You are approaching limits in ${budgetStatus.filter(b => b.status === 'warning').length} categories.`,
        icon: Target
      });
    }

    if (avgExpense < totalSpent / 5) {
      recommendations.push({
        type: 'info',
        title: 'Set Category Budgets',
        description: 'You don\'t have budgets set for all categories. Consider creating budgets for better control.',
        icon: Wallet
      });
    }

    recommendations.push({
      type: 'info',
      title: 'Track Regularly',
      description: 'Keep tracking your expenses consistently for better financial insights and patterns.',
      icon: BarChart3
    });

    // Spending patterns
    const spendingPatterns = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: amount.toFixed(2),
        percentage: ((amount / totalSpent) * 100).toFixed(1),
        count: categoryCount[category]
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      summary: `You've spent $${totalSpent.toFixed(2)} across ${expenseList.length} transactions. Average expense: $${avgExpense.toFixed(2)}`,
      recommendations,
      spendingPatterns,
      budgetStatus,
      monthlyGrowth,
      totalSpent,
      avgExpense
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!mounted) return null;
  if (loading) return <div className="flex items-center justify-center h-screen">Loading insights...</div>;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex-col z-30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-lg text-gray-900">FinanceTracker</h1>
              <p className="text-xs text-gray-500">Group 11</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-inter text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-inter font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:hidden">
              <MobileNav menuItems={menuItems} pathname={pathname} onLogout={handleLogout} />
            </div>

            <h1 className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">Financial Insights</h1>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block">
                <Bell className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm cursor-pointer hover:shadow-md transition" title={`${user?.firstName} ${user?.lastName}`}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          className="p-4 sm:p-8 space-y-8"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Summary Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-lg"
          >
            <p className="text-blue-100 text-sm sm:text-base mb-2">Financial Overview</p>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl mb-4">{insights?.summary}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Total Spent</p>
                <p className="font-poppins font-bold text-lg sm:text-2xl">${insights?.totalSpent?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Average Expense</p>
                <p className="font-poppins font-bold text-lg sm:text-2xl">${insights?.avgExpense?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Monthly Growth</p>
                <p className={`font-poppins font-bold text-lg sm:text-2xl ${insights?.monthlyGrowth > 0 ? 'text-red-300' : 'text-green-300'}`}>
                  {insights?.monthlyGrowth > 0 ? '+' : ''}{insights?.monthlyGrowth}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-poppins font-bold text-xl text-gray-900">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights?.recommendations?.map((rec, idx) => {
                const Icon = rec.icon;
                const bgColor = {
                  error: 'bg-red-50 border-red-200',
                  warning: 'bg-yellow-50 border-yellow-200',
                  success: 'bg-green-50 border-green-200',
                  info: 'bg-blue-50 border-blue-200'
                }[rec.type];

                const iconColor = {
                  error: 'text-red-600',
                  warning: 'text-yellow-600',
                  success: 'text-green-600',
                  info: 'text-blue-600'
                }[rec.type];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`rounded-lg p-4 border ${bgColor}`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-1 ${iconColor}`} />
                      <div>
                        <h4 className="font-poppins font-bold text-gray-900 text-sm">{rec.title}</h4>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">{rec.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Spending Patterns */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-poppins font-bold text-xl text-gray-900">Spending Patterns by Category</h3>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Total</th>
                      <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700">Percentage</th>
                      <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700">Transactions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {insights?.spendingPatterns?.map((pattern, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 sm:px-6 py-4 font-semibold text-gray-900 capitalize text-xs sm:text-sm">{pattern.category}</td>
                        <td className="px-4 sm:px-6 py-4 text-gray-600 text-xs sm:text-sm">${pattern.amount}</td>
                        <td className="hidden sm:table-cell px-6 py-4 text-gray-600 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pattern.percentage}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500">{pattern.percentage}%</span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-gray-600 text-sm">{pattern.count}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Budget Status */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-poppins font-bold text-xl text-gray-900">Budget Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights?.budgetStatus?.map((budget, idx) => {
                const statusColor = {
                  exceeded: 'border-red-200 bg-red-50',
                  warning: 'border-yellow-200 bg-yellow-50',
                  ok: 'border-green-200 bg-green-50'
                }[budget.status];

                const progressColor = {
                  exceeded: 'bg-red-600',
                  warning: 'bg-yellow-600',
                  ok: 'bg-green-600'
                }[budget.status];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`rounded-lg p-4 border ${statusColor}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-poppins font-bold text-gray-900 capitalize">{budget.category}</h4>
                      <span className="text-xs font-semibold text-gray-600">{budget.percentage}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 mb-3">
                      <div className={`h-3 rounded-full ${progressColor}`} style={{ width: `${Math.min(budget.percentage, 100)}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}</span>
                      <span className={`font-semibold ${budget.status === 'exceeded' ? 'text-red-600' : budget.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {budget.status === 'exceeded' ? 'Exceeded' : budget.status === 'warning' ? 'Warning' : 'On Track'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              {insights?.budgetStatus?.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>No budgets created yet. Create budgets to track your spending limits.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
