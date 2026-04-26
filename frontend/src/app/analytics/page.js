'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, LogOut, Settings, Bell, Calendar, Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, itemVariants, headerVariants, sidebarVariants, contentVariants, chartVariants } from '@/utils/animations';
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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

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

    fetchAnalyticsData(token);
  }, [router]);

  const fetchAnalyticsData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const expenseList = response.data.expenses || [];
      setExpenses(expenseList);

      // Process monthly data
      const monthMap = {};
      expenseList.forEach(exp => {
        const date = new Date(exp.date);
        const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthMap[month] = (monthMap[month] || 0) + exp.amount;
      });

      const monthlyArray = Object.entries(monthMap)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .map(([month, amount]) => ({
          month,
          amount: Math.round(amount)
        }));

      setMonthlyData(monthlyArray);

      // Process category data
      const catMap = {};
      expenseList.forEach(exp => {
        catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
      });

      const categoryArray = Object.entries(catMap)
        .map(([name, value]) => ({
          name,
          value: Math.round(value)
        }))
        .sort((a, b) => b.value - a.value);

      setCategoryData(categoryArray);

      // Process trend data (last 30 days)
      const trendMap = {};
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        trendMap[dateStr] = 0;
      }

      expenseList.forEach(exp => {
        const dateStr = new Date(exp.date).toISOString().split('T')[0];
        if (trendMap.hasOwnProperty(dateStr)) {
          trendMap[dateStr] += exp.amount;
        }
      });

      const trendArray = Object.entries(trendMap).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.round(amount)
      }));

      setTrendData(trendArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
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
          <p className="text-gray-600 font-inter">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgDaily = expenses.length > 0 ? totalExpenses / 30 : 0;
  const avgTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0;

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
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-4 lg:hidden">
              <MobileNav menuItems={menuItems} pathname={pathname} onLogout={handleLogout} />
            </div>
            
            <h1 className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">Analytics</h1>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-inter text-xs sm:text-sm">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Date Range</span>
              </button>
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
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Total Spent</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                ${totalExpenses.toFixed(2)}
              </h2>
              <p className="text-green-600 text-xs sm:text-sm font-inter mt-2">
                All time
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Daily Average</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                ${avgDaily.toFixed(2)}
              </h2>
              <p className="text-blue-600 text-xs sm:text-sm font-inter mt-2">
                Last 30 days
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Avg Transaction</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                ${avgTransaction.toFixed(2)}
              </h2>
              <p className="text-orange-600 text-xs sm:text-sm font-inter mt-2">
                Per expense
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Transactions</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                {expenses.length}
              </h2>
              <p className="text-purple-600 text-xs sm:text-sm font-inter mt-2">
                Total records
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Monthly Trend */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Monthly Spending</h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
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
            </motion.div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-poppins font-bold text-lg text-gray-900 mb-4">By Category</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
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

          {/* 30-Day Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-poppins font-bold text-lg text-gray-900 mb-4">Daily Spending (Last 30 Days)</h3>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">No data</p>
            )}
          </div>

          {/* Category Breakdown Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-poppins font-bold text-lg text-gray-900">Category Summary</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Percentage</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((cat, idx) => (
                  <tr key={cat.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-inter text-sm text-gray-900 flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                      ${cat.value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                      {((cat.value / totalExpenses) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600">
                      ↗ Stable
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
