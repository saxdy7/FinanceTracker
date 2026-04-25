'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, LogOut, Settings, Bell, Trash2, Edit2, AlertCircle, Menu, X, Zap } from 'lucide-react';
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

export default function BudgetsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'Food',
    limit: '',
    period: 'monthly',
    alerts: true
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

    fetchData(token);
  }, [router]);

  const fetchData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const [budgetRes, expenseRes] = await Promise.all([
        axios.get(`${apiUrl}/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/expenses`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setBudgets(budgetRes.data.budgets || []);
      setExpenses(expenseRes.data.expenses || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    if (!newBudget.limit) {
      alert('Please enter a budget limit');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await axios.post(`${apiUrl}/budgets`, newBudget, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBudgets([...budgets, response.data.budget]);
      setShowModal(false);
      setNewBudget({
        category: 'Food',
        limit: '',
        period: 'monthly',
        alerts: true
      });
    } catch (error) {
      console.error('Error adding budget:', error);
      alert('Error adding budget');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Delete this budget?')) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      await axios.delete(`${apiUrl}/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBudgets(budgets.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const getBudgetSpent = (category) => {
    return expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getProgressPercentage = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const isOverBudget = (spent, limit) => {
    return spent > limit;
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
          <p className="text-gray-600 font-inter">Loading budgets...</p>
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
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:hidden">
              <MobileNav menuItems={menuItems} pathname={pathname} onLogout={handleLogout} />
            </div>
            
            <h1 className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">Budgets</h1>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-inter font-medium text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Budget</span>
                <span className="sm:hidden">Add</span>
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
          {/* Budget Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Total Budget</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                ${budgets.reduce((sum, b) => sum + b.limit, 0).toFixed(2)}
              </h2>
              <p className="text-blue-600 text-xs sm:text-sm font-inter mt-2">
                {budgets.length} budgets
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Total Spent</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                ${budgets.reduce((sum, b) => sum + getBudgetSpent(b.category), 0).toFixed(2)}
              </h2>
              <p className="text-orange-600 text-xs sm:text-sm font-inter mt-2">
                Across all budgets
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Remaining</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                ${Math.max(0, budgets.reduce((sum, b) => sum + (b.limit - getBudgetSpent(b.category)), 0)).toFixed(2)}
              </h2>
              <p className="text-green-600 text-xs sm:text-sm font-inter mt-2">
                To spend
              </p>
            </motion.div>
          </div>

          {/* Budgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {budgets.length > 0 ? (
              budgets.map((budget) => {
                const spent = getBudgetSpent(budget.category);
                const percentage = getProgressPercentage(spent, budget.limit);
                const over = isOverBudget(spent, budget.limit);

                return (
                  <motion.div 
                    key={budget._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900">{budget.category}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-inter capitalize">
                          {budget.period} budget
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteBudget(budget._id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {over && (
                      <div className="mb-4 flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs sm:text-sm text-red-600 font-inter">
                          Over budget by ${(spent - budget.limit).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 font-inter">Spent</p>
                          <p className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">
                            ${spent.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm text-gray-600 font-inter">Budget</p>
                          <p className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">
                            ${budget.limit.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            over ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 font-inter">
                        {percentage.toFixed(0)}% of budget used
                      </p>

                      <p className="text-xs sm:text-sm text-gray-600 font-inter">
                        {over ? '❌ Over budget' : `✅ ${(budget.limit - spent).toFixed(2)} remaining`}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-1 lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 font-inter mb-4 text-sm sm:text-base">No budgets created yet</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-inter font-medium text-sm"
                >
                  Create Your First Budget
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Budget Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-lg"
            >
              <h2 className="font-poppins font-bold text-xl sm:text-2xl mb-6">Create Budget</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-inter font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Shopping</option>
                    <option>Entertainment</option>
                    <option>Utilities</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-inter font-medium text-gray-700 mb-2">Budget Limit ($)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-inter font-medium text-gray-700 mb-2">Period</label>
                  <select
                    value={newBudget.period}
                    onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newBudget.alerts}
                    onChange={(e) => setNewBudget({...newBudget, alerts: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-inter text-gray-700">Enable alerts when near limit</span>
                </label>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-inter font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBudget}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-inter font-medium text-sm"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
