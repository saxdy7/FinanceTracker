'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

export default function BudgetsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'food',
    limit: '',
    period: 'monthly',
    alerts: true
  });

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
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
    if (!newBudget.limit) { alert('Please enter a budget limit'); return; }
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const today = new Date();
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const payload = {
        ...newBudget,
        limit: parseFloat(newBudget.limit),
        startDate: today.toISOString(),
        endDate: endDate.toISOString()
      };
      const response = await axios.post(`${apiUrl}/budgets`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets([...budgets, response.data.budget]);
      setShowModal(false);
      setNewBudget({ category: 'food', limit: '', period: 'monthly', alerts: true });
    } catch (error) {
      console.error('Error adding budget:', error);
      alert('Error adding budget: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/budgets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBudgets(budgets.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const getBudgetSpent = (category) =>
    expenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + exp.amount, 0);

  const getProgressPct = (spent, limit) => Math.min((spent / limit) * 100, 100);

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-1 min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 animate-spin mx-auto" />
            <p className="text-gray-600">Loading budgets...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent  = budgets.reduce((s, b) => s + getBudgetSpent(b.category), 0);
  const totalLeft   = Math.max(0, totalBudget - totalSpent);

  const pageActions = (
    <button
      onClick={() => setShowModal(true)}
      className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm font-medium"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Create Budget</span>
      <span className="sm:hidden">Add</span>
    </button>
  );

  return (
    <DashboardLayout pageTitle="Budgets" actions={pageActions}>
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: 'Total Budget', value: `$${totalBudget.toFixed(2)}`, sub: `${budgets.length} budgets`, color: 'text-blue-600' },
            { label: 'Total Spent',  value: `$${totalSpent.toFixed(2)}`,  sub: 'Across all budgets',    color: 'text-orange-600' },
            { label: 'Remaining',    value: `$${totalLeft.toFixed(2)}`,   sub: 'Left to spend',          color: 'text-green-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm mb-2">{stat.label}</p>
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900">{stat.value}</h2>
              <p className={`text-xs sm:text-sm mt-2 ${stat.color}`}>{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {budgets.length > 0 ? budgets.map((budget, i) => {
            const spent = getBudgetSpent(budget.category);
            const pct   = getProgressPct(spent, budget.limit);
            const over  = spent > budget.limit;
            return (
              <motion.div
                key={budget._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 capitalize">{budget.category}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">{budget.period} budget</p>
                  </div>
                  <button onClick={() => handleDeleteBudget(budget._id)} className="p-2 hover:bg-red-100 text-red-600 rounded transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {over && (
                  <div className="mb-4 flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-100">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-red-600">Over budget by ${(spent - budget.limit).toFixed(2)}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Spent</p>
                      <p className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">${spent.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-600">Budget</p>
                      <p className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">${budget.limit.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>{pct.toFixed(0)}% used</span>
                    <span>{over ? '❌ Over budget' : `✅ $${(budget.limit - spent).toFixed(2)} remaining`}</span>
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-2 bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 mb-4">No budgets created yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Create Your First Budget
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
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
              <h2 className="font-poppins font-bold text-xl sm:text-2xl mb-6">Create Budget</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Limit ($)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <select
                    value={newBudget.period}
                    onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
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
                    onChange={(e) => setNewBudget({ ...newBudget, alerts: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Enable alerts when near limit</span>
                </label>
                <div className="flex space-x-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Cancel</button>
                  <button onClick={handleAddBudget} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">Create</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
