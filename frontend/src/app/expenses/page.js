'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ExpensesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
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
    if (userData) setUser(JSON.parse(userData));
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
      const updated = [response.data.expense, ...expenses];
      setExpenses(updated);

      const stats = {};
      updated.forEach(exp => {
        stats[exp.category] = (stats[exp.category] || 0) + exp.amount;
      });
      setCategoryStats(
        Object.entries(stats)
          .map(([name, value]) => ({ name, value: Math.round(value) }))
          .sort((a, b) => b.value - a.value)
      );

      setShowModal(false);
      setNewExpense({
        description: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash'
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      const networkError = error.message === 'Network Error' ? 'Backend is offline.' : null;
      const msg = error?.response?.data?.message || error?.response?.data?.error || networkError || error.message || 'Error adding expense. Please check all fields.';
      alert(`Add Expense Failed: ${msg}`);
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
      const updated = expenses.filter(e => e._id !== id);
      setExpenses(updated);
      const stats = {};
      updated.forEach(exp => {
        stats[exp.category] = (stats[exp.category] || 0) + exp.amount;
      });
      setCategoryStats(
        Object.entries(stats)
          .map(([name, value]) => ({ name, value: Math.round(value) }))
          .sort((a, b) => b.value - a.value)
      );
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-1 min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 animate-spin mx-auto" />
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const pageActions = (
    <button
      onClick={() => setShowModal(true)}
      className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-inter font-medium text-xs sm:text-sm"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Add Expense</span>
      <span className="sm:hidden">Add</span>
    </button>
  );

  return (
    <DashboardLayout pageTitle="Expenses" actions={pageActions}>
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <p className="text-gray-600 text-xs sm:text-sm mb-2">Total Expenses</p>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">${totalExpenses.toFixed(2)}</h2>
            <p className="text-green-600 text-xs sm:text-sm mt-2">{expenses.length} transactions</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <p className="text-gray-600 text-xs sm:text-sm mb-2">Average Expense</p>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">
              ${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
            </h2>
            <p className="text-blue-600 text-xs sm:text-sm mt-2">Per transaction</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <p className="text-gray-600 text-xs sm:text-sm mb-2">Categories</p>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">{categoryStats.length}</h2>
            <p className="text-orange-600 text-xs sm:text-sm mt-2">Tracked categories</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Expenses by Category</h3>
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%" cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={90}
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
              <p className="text-center text-gray-500 py-20">No data yet — add your first expense!</p>
            )}
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Category Breakdown</h3>
            {categoryStats.length > 0 ? (
              <div className="space-y-3">
                {categoryStats.map((stat, idx) => (
                  <div key={stat.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-xs sm:text-sm text-gray-700 capitalize">{stat.name}</span>
                      </div>
                      <span className="font-semibold text-xs sm:text-sm text-gray-900">${stat.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(stat.value / totalExpenses * 100) || 0}%`,
                          backgroundColor: COLORS[idx % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-20">No data yet</p>
            )}
          </motion.div>
        </div>

        {/* Recent Expenses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900">Recent Expenses</h3>
          </div>
          {expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Description</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 20).map((exp) => (
                    <tr key={exp._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 truncate max-w-[150px]">{exp.description}</td>
                      <td className="hidden sm:table-cell px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">{exp.category}</span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-right text-gray-900">${exp.amount.toFixed(2)}</td>
                      <td className="px-4 sm:px-6 py-4 text-center">
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
              <p className="mb-4">No expenses yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Add First Expense
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl"
            >
              <h2 className="font-poppins font-bold text-xl sm:text-2xl mb-6">Add Expense</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="digital-wallet">Digital Wallet</option>
                </select>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExpense}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
