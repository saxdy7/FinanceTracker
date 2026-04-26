'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Settings, MoreVertical, LogOut, TrendingUp, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, Eye, EyeOff, Trash2, Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MobileNav from '@/components/MobileNav';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Transactions', href: '/transactions' },
  { icon: MessageSquare, label: 'Expenses', href: '/expenses', badge: false },
  { icon: Wallet, label: 'Budgets', href: '/budgets' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Zap, label: 'Insights', href: '/insights' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: MessageSquare, label: 'AI Advisor', href: '/chat' },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [showBalance, setShowBalance] = useState(true);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [moneyFlowData, setMoneyFlowData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  // Initialize user data from localStorage
  useEffect(() => {
    setMounted(true);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Fetch expenses
      const expensesRes = await axios.get(`${apiUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const expenseList = expensesRes.data.expenses || [];
      setExpenses(expenseList.slice(0, 5)); // Recent 5 transactions

      // Calculate total spent by category
      const categoryMap = {};
      expenseList.forEach(exp => {
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
      });

      // Convert to spending data
      const spendingArray = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value: Math.round(value)
      })).slice(0, 5);

      setSpendingData(spendingArray);

      // Generate money flow data (last 7 days)
      const flowData = generateMoneyFlowData(expenseList);
      setMoneyFlowData(flowData);

      // Calculate total balance
      const total = expenseList.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalBalance(Math.max(0, 50000 - total));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
      // Show empty state instead of fake data
      setMoneyFlowData([]);
      setSpendingData([]);
      setExpenses([]);
      setTotalBalance(50000);
    }
  };

  const generateMoneyFlowData = (expenseList) => {
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const dayExpenses = expenseList
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.toDateString() === date.toDateString();
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      data.push({
        date: dateStr,
        income: 0, // No income data available in current schema
        expenses: dayExpenses
      });
    }
    return data;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Show loading state until mounted
  if (!mounted || !user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 animate-spin mx-auto"></div>
          <p className="text-gray-600 font-inter">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex-col z-30">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-poppins font-bold text-lg text-gray-900">FinanceTracker</span>
          </Link>
        </div>

        {/* Main Menu */}
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
                {item.badge && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
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
        {/* Top Bar - Mobile responsive */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:hidden">
              <MobileNav 
                menuItems={menuItems} 
                pathname={pathname}
                onLogout={handleLogout}
              />
            </div>
            
            <h1 className="font-poppins font-bold text-xl sm:text-2xl text-gray-900">Dashboard</h1>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 sm:px-4 py-2 w-40 sm:w-64">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent ml-2 outline-none text-sm font-inter w-full"
                />
              </div>
              <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block">
                <Bell className="w-5 h-5 text-gray-600" />
              </Link>
              <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block">
                <Settings className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm cursor-pointer hover:shadow-md transition" title={`${user?.firstName} ${user?.lastName}`}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Wallet Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="col-span-1 md:col-span-2 space-y-4 sm:space-y-6">
              {/* Money Flow */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                  <h3 className="font-poppins font-bold text-lg text-gray-900">Money Flow</h3>
                  <select className="text-sm border border-gray-200 rounded-lg px-2 py-1 font-inter w-full sm:w-auto">
                    <option>Jan 10 - Jan 16</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={moneyFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                  <h3 className="font-poppins font-bold text-lg text-gray-900">Recent Transactions</h3>
                  <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">View all →</a>
                </div>
                <div className="space-y-3 overflow-x-auto">
                  {expenses.length > 0 ? expenses.map((exp) => (
                    <div key={exp._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                          💰
                        </div>
                        <div>
                          <p className="font-inter font-semibold text-sm text-gray-900">{exp.description}</p>
                          <p className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-semibold text-green-600">
                          Recorded
                        </span>
                        <span className="font-semibold text-gray-900 w-24 text-right">-${exp.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 space-y-3">
                      <p className="text-gray-500">No expenses recorded yet.</p>
                      <Link
                        href="/expenses"
                        className="inline-block px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                      >
                        Add First Expense
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="col-span-1 space-y-4 sm:space-y-6">
              {/* Wallet Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="font-poppins font-bold text-xs sm:text-sm opacity-90">Wallet</h3>
                  <MoreVertical className="w-4 h-4 opacity-50 cursor-pointer hover:opacity-100" />
                </div>
                <div className="space-y-3 mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm opacity-80">Balance</p>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-poppins font-bold text-2xl sm:text-3xl">${showBalance ? totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '****'}</h2>
                    <button onClick={() => setShowBalance(!showBalance)} className="p-1 hover:bg-white/20 rounded transition flex-shrink-0">
                      {showBalance ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs opacity-70 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
                  <span>Wallet Balance</span>
                  <span>PRIMARY</span>
                </div>
              </motion.div>

              {/* Quick Transfer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/expenses"
                    className="w-full py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold transition text-sm text-center"
                  >
                    + Add Expense
                  </Link>
                  <Link
                    href="/budgets"
                    className="w-full py-2 px-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-semibold transition text-sm text-center"
                  >
                    + Create Budget
                  </Link>
                  <Link
                    href="/analytics"
                    className="w-full py-2 px-3 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-semibold transition text-sm text-center"
                  >
                    View Analytics
                  </Link>
                </div>
              </motion.div>

              {/* Spending Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Total Spent</h3>
                <div className="flex items-center justify-center mb-6 h-24 sm:h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={spendingData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} dataKey="value">
                        {spendingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {spendingData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">${item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
