'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, LogOut, Settings, Bell, Download, Filter, Calendar, Eye, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNav from '@/components/MobileNav';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { containerVariants, itemVariants, headerVariants, sidebarVariants, contentVariants } from '@/utils/animations';
import axios from 'axios';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Transactions', href: '/transactions' },
  { icon: MessageSquare, label: 'Expenses', href: '/expenses' },
  { icon: Wallet, label: 'Budgets', href: '/budgets' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ReportsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [reportType, setReportType] = useState('monthly'); // monthly, yearly, custom
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    monthlyComparison: [],
    categoryBreakdown: [],
    budgetPerformance: [],
    totalSpent: 0,
    totalBudgeted: 0,
    spentVsBudget: 0
  });

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

    fetchReportData(token);
  }, [router]);

  const fetchReportData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const [expenseRes, budgetRes] = await Promise.all([
        axios.get(`${apiUrl}/expenses`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/budgets`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const expenseList = expenseRes.data.expenses || [];
      const budgetList = budgetRes.data.budgets || [];
      
      setExpenses(expenseList);
      setBudgets(budgetList);
      
      generateReport(expenseList, budgetList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  const generateReport = (expenseList, budgetList) => {
    // Monthly comparison
    const monthMap = {};
    expenseList.forEach(exp => {
      const date = new Date(exp.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthMap[month] = (monthMap[month] || 0) + exp.amount;
    });

    const monthlyComparison = Object.entries(monthMap)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-6)
      .map(([month, amount]) => {
        const [year, monthNum] = month.split('-');
        const monthName = new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return { month: monthName, amount: Math.round(amount) };
      });

    // Category breakdown
    const catMap = {};
    expenseList.forEach(exp => {
      catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
    });

    const categoryBreakdown = Object.entries(catMap)
      .map(([name, value]) => ({
        name,
        value: Math.round(value)
      }))
      .sort((a, b) => b.value - a.value);

    // Budget performance
    const budgetPerformance = budgetList.map(budget => {
      const spent = expenseList
        .filter(exp => exp.category === budget.category)
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        category: budget.category,
        budgeted: budget.limit,
        spent: Math.round(spent),
        percentage: Math.round((spent / budget.limit) * 100)
      };
    });

    const totalSpent = expenseList.reduce((sum, exp) => sum + exp.amount, 0);
    const totalBudgeted = budgetList.reduce((sum, b) => sum + b.limit, 0);

    setReportData({
      monthlyComparison,
      categoryBreakdown,
      budgetPerformance,
      totalSpent: Math.round(totalSpent),
      totalBudgeted: Math.round(totalBudgeted),
      spentVsBudget: totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0
    });
  };

  const exportAsCSV = () => {
    let csv = 'Financial Report\n';
    csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    csv += 'Monthly Spending\n';
    csv += 'Month,Amount\n';
    reportData.monthlyComparison.forEach(row => {
      csv += `${row.month},${row.amount}\n`;
    });
    
    csv += '\nCategory Breakdown\n';
    csv += 'Category,Amount\n';
    reportData.categoryBreakdown.forEach(row => {
      csv += `${row.name},${row.value}\n`;
    });

    csv += '\nBudget Performance\n';
    csv += 'Category,Budgeted,Spent,Percentage\n';
    reportData.budgetPerformance.forEach(row => {
      csv += `${row.category},${row.budgeted},${row.spent},${row.percentage}%\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportAsPDF = () => {
    // Simple PDF-like export as text (full PDF would need library)
    const pdf = `
FINANCIAL REPORT
Generated: ${new Date().toLocaleDateString()}
==========================================

SUMMARY
-------
Total Spent: $${reportData.totalSpent.toFixed(2)}
Total Budgeted: $${reportData.totalBudgeted.toFixed(2)}
Spent vs Budget: ${reportData.spentVsBudget}%

MONTHLY SPENDING (Last 6 Months)
---------
${reportData.monthlyComparison.map(m => `${m.month}: $${m.amount.toFixed(2)}`).join('\n')}

CATEGORY BREAKDOWN
------------------
${reportData.categoryBreakdown.map(c => `${c.name}: $${c.value.toFixed(2)}`).join('\n')}

BUDGET PERFORMANCE
------------------
${reportData.budgetPerformance.map(b => `${b.category}: $${b.spent}/$${b.budgeted} (${b.percentage}%)`).join('\n')}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pdf));
    element.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!mounted || !user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 animate-spin mx-auto"></div>
          <p className="text-gray-600 font-inter">Generating report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex-col z-30">
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-poppins font-bold text-lg text-gray-900">FinanceTracker</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-inter font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3 space-y-1">
          <Link
            href="/settings"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-inter font-medium text-sm">Settings</span>
          </Link>
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
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center space-x-4 lg:hidden">
              <MobileNav menuItems={menuItems} pathname={pathname} onLogout={handleLogout} />
            </div>
            
            <h1 className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">Financial Reports</h1>
            
            <div className="flex items-center space-x-1 sm:space-x-4 gap-1">
              <button
                onClick={exportAsCSV}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-inter font-medium text-xs sm:text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={exportAsPDF}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-inter font-medium text-xs sm:text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export Report</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Report Type Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-poppins font-bold text-lg text-gray-900 mb-4">Report Type</h3>
            <div className="flex space-x-4">
              {[
                { value: 'monthly', label: 'Monthly Report' },
                { value: 'yearly', label: 'Yearly Report' },
                { value: 'custom', label: 'Custom Range' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setReportType(option.value)}
                  className={`px-6 py-2 rounded-lg font-inter font-medium transition ${
                    reportType === option.value
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {reportType === 'custom' && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg font-inter focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg font-inter focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-inter mb-2">Total Spent</p>
              <h2 className="font-poppins font-bold text-3xl text-gray-900">
                ${reportData.totalSpent.toFixed(2)}
              </h2>
              <p className="text-blue-600 text-sm font-inter mt-2">
                All time spending
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-inter mb-2">Total Budgeted</p>
              <h2 className="font-poppins font-bold text-3xl text-gray-900">
                ${reportData.totalBudgeted.toFixed(2)}
              </h2>
              <p className="text-green-600 text-sm font-inter mt-2">
                Across all budgets
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-inter mb-2">Spent vs Budget</p>
              <h2 className="font-poppins font-bold text-3xl text-gray-900">
                {reportData.spentVsBudget}%
              </h2>
              <p className={`text-sm font-inter mt-2 ${
                reportData.spentVsBudget > 100 ? 'text-red-600' : 'text-green-600'
              }`}>
                {reportData.spentVsBudget > 100 ? 'Over budget' : 'Within budget'}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-poppins font-bold text-lg text-gray-900 mb-4">Last 6 Months Spending</h3>
              {reportData.monthlyComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.monthlyComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-12">No data</p>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-poppins font-bold text-lg text-gray-900 mb-4">Spending by Category</h3>
              {reportData.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-12">No data</p>
              )}
            </div>
          </div>

          {/* Budget Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-poppins font-bold text-lg text-gray-900">Budget Performance</h3>
            </div>
            {reportData.budgetPerformance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Budgeted</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Spent</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Remaining</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.budgetPerformance.map((item, idx) => {
                      const remaining = item.budgeted - item.spent;
                      const isOver = item.spent > item.budgeted;

                      return (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 font-inter text-sm text-gray-900">{item.category}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                            ${item.budgeted.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                            ${item.spent.toFixed(2)}
                          </td>
                          <td className={`px-6 py-4 text-sm font-semibold text-right ${
                            isOver ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ${Math.abs(remaining).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isOver
                                ? 'bg-red-100 text-red-800'
                                : item.percentage > 80
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {item.percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No budget data available</p>
              </div>
            )}
          </div>

          {/* Category Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-poppins font-bold text-lg text-gray-900">Category Breakdown</h3>
            </div>
            <div className="space-y-4 p-6">
              {reportData.categoryBreakdown.map((cat, idx) => {
                const percentage = reportData.totalSpent > 0 
                  ? (cat.value / reportData.totalSpent * 100)
                  : 0;

                return (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        ></div>
                        <span className="font-inter font-medium text-gray-900">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${cat.value.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">{percentage.toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
            <h3 className="font-poppins font-bold text-lg text-blue-900 mb-4">Report Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-blue-700 font-inter mb-2">Report Generated</p>
                <p className="font-semibold text-blue-900">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-inter mb-2">Total Records</p>
                <p className="font-semibold text-blue-900">{expenses.length} transactions</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-inter mb-2">Date Range</p>
                <p className="font-semibold text-blue-900">
                  {reportType === 'monthly' ? 'Current Month' : reportType === 'yearly' ? 'Current Year' : `${dateRange.startDate} to ${dateRange.endDate}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-inter mb-2">Categories Tracked</p>
                <p className="font-semibold text-blue-900">{reportData.categoryBreakdown.length}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
