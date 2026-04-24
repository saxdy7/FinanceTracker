'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, LogOut, Settings, Bell, Trash2, Edit2, PieChart as PieChartIcon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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
  { icon: BarChart3, label: 'Reports', href: '/reports' },  { icon: Bell, label: 'Notifications', href: '/notifications' },];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ExpensesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Card'
  });
  const [categoryStats, setCategoryStats] = useState([]);

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

    fetchExpenses(token);
  }, [router]);

  const fetchExpenses = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const expenseList = response.data.expenses || [];
      setExpenses(expenseList);

      // Calculate category statistics
      const stats = {};
      expenseList.forEach(exp => {
        stats[exp.category] = (stats[exp.category] || 0) + exp.amount;
      });

      const categoryData = Object.entries(stats)
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a, b) => b.value - a.value);
      
      setCategoryStats(categoryData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/expenses`, newExpense, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses([response.data.expense, ...expenses]);
      
      // Recalculate stats
      const newStats = categoryStats.map(stat => 
        stat.name === newExpense.category 
          ? { ...stat, value: stat.value + Math.round(parseFloat(newExpense.amount)) }
          : stat
      );
      if (!newStats.some(s => s.name === newExpense.category)) {
        newStats.push({ name: newExpense.category, value: Math.round(parseFloat(newExpense.amount)) });
      }
      setCategoryStats(newStats.sort((a, b) => b.value - a.value));

      setShowModal(false);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Card'
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
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
          <p className="text-gray-600 font-inter">Loading expenses...</p>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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
            
            <h1 className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">Expenses</h1>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-inter font-medium text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Expense</span>
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
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Total Expenses</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                ${totalExpenses.toFixed(2)}
              </h2>
              <p className="text-green-600 text-xs sm:text-sm font-inter mt-2">
                {expenses.length} transactions
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Average Expense</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                ${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
              </h2>
              <p className="text-blue-600 text-xs sm:text-sm font-inter mt-2">
                Per transaction
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm font-inter mb-2">Categories</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
                {categoryStats.length}
              </h2>
              <p className="text-orange-600 text-xs sm:text-sm font-inter mt-2">
                Tracked categories
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Pie Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Expenses by Category</h3>
              {categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-12">No data</p>
              )}
            </motion.div>

            {/* Category Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {categoryStats.map((stat, idx) => (
                  <div key={stat.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        ></div>
                        <span className="font-inter text-xs sm:text-sm text-gray-700">{stat.name}</span>
                      </div>
                      <span className="font-semibold text-xs sm:text-sm text-gray-900">${stat.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(stat.value / totalExpenses * 100) || 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Expenses Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900">Recent Expenses</h3>
            </div>
            {expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Description</th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.slice(0, 10).map((exp) => (
                      <tr key={exp._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-inter text-gray-900 truncate">{exp.description}</td>
                        <td className="hidden sm:table-cell px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {exp.category}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-sm font-inter text-gray-600">
                          {new Date(exp.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-right text-gray-900">
                          ${exp.amount.toFixed(2)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="p-1 sm:p-2 hover:bg-red-100 text-red-600 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No expenses yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Add Expense Modal */}
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
              <h2 className="font-poppins font-bold text-xl sm:text-2xl mb-6">Add Expense</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:border-blue-500"
                />
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
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
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-inter font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExpense}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-inter font-medium text-sm"
                  >
                    Add
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
