'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, Edit2, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

const CATEGORIES = ['food', 'transport', 'shopping', 'entertainment', 'utilities', 'healthcare', 'education', 'other'];

const EMPTY_BUDGET = { category: 'food', limit: '', period: 'monthly', alerts: true };

export default function BudgetsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Create modal
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState(EMPTY_BUDGET);
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [editBudget, setEditBudget] = useState(null); // the budget being edited
  const [editForm, setEditForm] = useState({ limit: '', period: 'monthly', alerts: true });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchData(token);
  }, [router]);

  const fetchData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const [budgetRes, expenseRes] = await Promise.all([
        axios.get(`${apiUrl}/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/expenses?limit=500`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBudgets(budgetRes.data.budgets || []);
      setExpenses(expenseRes.data.expenses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ── CREATE ── */
  const handleAddBudget = async () => {
    if (!newBudget.limit || isNaN(newBudget.limit) || Number(newBudget.limit) <= 0) {
      alert('Please enter a valid budget amount in ₹');
      return;
    }
    setCreating(true);
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
      setBudgets(prev => [...prev, response.data.budget]);
      setShowModal(false);
      setNewBudget(EMPTY_BUDGET);
    } catch (error) {
      alert('Error creating budget: ' + (error.response?.data?.message || error.message));
    } finally {
      setCreating(false);
    }
  };

  /* ── EDIT OPEN ── */
  const openEdit = (budget) => {
    setEditBudget(budget);
    setEditForm({ limit: budget.limit, period: budget.period, alerts: budget.alerts?.enabled ?? true });
    setEditError('');
  };

  /* ── EDIT SAVE ── */
  const handleEditSave = async () => {
    if (!editForm.limit || isNaN(editForm.limit) || Number(editForm.limit) <= 0) {
      setEditError('Please enter a valid budget limit in ₹');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const today = new Date();
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const payload = {
        limit: parseFloat(editForm.limit),
        period: editForm.period,
        alerts: { enabled: editForm.alerts, threshold: 80 },
        startDate: today.toISOString(),
        endDate: endDate.toISOString()
      };
      const response = await axios.put(`${apiUrl}/budgets/${editBudget._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(prev => prev.map(b => b._id === editBudget._id ? response.data.budget : b));
      setEditBudget(null);
    } catch (error) {
      setEditError(error.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/budgets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBudgets(prev => prev.filter(b => b._id !== id));
    } catch {
      alert('Failed to delete budget.');
    }
  };

  const getBudgetSpent = (category) =>
    expenses.filter(e => e.category === category).reduce((s, e) => s + e.amount, 0);

  const getProgressPct = (spent, limit) => Math.min((spent / limit) * 100, 100);

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-1 min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-gray-500 text-sm">Loading budgets...</p>
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
      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xs sm:text-sm font-semibold shadow-sm"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Create Budget</span>
      <span className="sm:hidden">Add</span>
    </button>
  );

  return (
    <DashboardLayout pageTitle="Budgets" actions={pageActions}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Budget', value: `₹${totalBudget.toLocaleString('en-IN')}`, sub: `${budgets.length} budget${budgets.length !== 1 ? 's' : ''}`, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Spent',  value: `₹${totalSpent.toLocaleString('en-IN')}`,  sub: 'Across all budgets', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Remaining',   value: `₹${totalLeft.toLocaleString('en-IN')}`,   sub: 'Left to spend',      color: 'text-green-600',  bg: 'bg-green-50' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">{stat.label}</p>
              <h2 className="font-bold text-2xl sm:text-3xl text-gray-900">{stat.value}</h2>
              <p className={`text-xs sm:text-sm mt-1.5 font-medium ${stat.color}`}>{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {budgets.length > 0 ? budgets.map((budget, i) => {
              const spent = getBudgetSpent(budget.category);
              const pct   = getProgressPct(spent, budget.limit);
              const over  = spent > budget.limit;

              return (
                <motion.div
                  key={budget._id}
                  layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 capitalize">{budget.category}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 capitalize mt-0.5">{budget.period} budget</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* EDIT button */}
                      <button
                        onClick={() => openEdit(budget)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition"
                        title="Edit budget"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {/* DELETE button */}
                      <button
                        onClick={() => handleDeleteBudget(budget._id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition"
                        title="Delete budget"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Over-budget alert */}
                  {over && (
                    <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-red-600 font-medium">
                        Over budget by ₹{(spent - budget.limit).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {/* Spent / Budget */}
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Spent</p>
                      <p className="font-bold text-xl sm:text-2xl text-gray-900">₹{spent.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Budget</p>
                      <p className="font-bold text-xl sm:text-2xl text-gray-900">₹{budget.limit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-3 rounded-full ${over ? 'bg-red-500' : pct > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span className="font-medium">{pct.toFixed(0)}% used</span>
                    <span className={over ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
                      {over ? '❌ Over budget' : `✅ ₹${(budget.limit - spent).toLocaleString('en-IN')} remaining`}
                    </span>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-2 bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-2 font-medium">No budgets created yet</p>
                <p className="text-gray-400 text-sm mb-4">Set spending limits in ₹ to track your finances</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
                >
                  + Create Your First Budget
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CREATE MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-gray-900">Create Budget</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select
                    value={newBudget.category}
                    onChange={e => setNewBudget({ ...newBudget, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white capitalize"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget Limit (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={newBudget.limit}
                      onChange={e => setNewBudget({ ...newBudget, limit: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Period</label>
                  <select
                    value={newBudget.period}
                    onChange={e => setNewBudget({ ...newBudget, period: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    checked={newBudget.alerts}
                    onChange={e => setNewBudget({ ...newBudget, alerts: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Alert me when near budget limit</span>
                </label>

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={handleAddBudget} disabled={creating}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                    {creating ? 'Creating...' : 'Create Budget'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {editBudget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-xl text-gray-900">Edit Budget</h2>
                  <p className="text-sm text-gray-500 capitalize mt-0.5">{editBudget.category}</p>
                </div>
                <button onClick={() => setEditBudget(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current info */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">Current limit</span>
                <span className="font-bold text-blue-900">₹{editBudget.limit.toLocaleString('en-IN')}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Budget Limit (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      placeholder={`Current: ₹${editBudget.limit}`}
                      value={editForm.limit}
                      onChange={e => setEditForm({ ...editForm, limit: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Enter the new amount in ₹ (Indian Rupees)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Period</label>
                  <select
                    value={editForm.period}
                    onChange={e => setEditForm({ ...editForm, period: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    checked={editForm.alerts}
                    onChange={e => setEditForm({ ...editForm, alerts: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Alert me when near budget limit</span>
                </label>

                {editError && (
                  <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{editError}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setEditBudget(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={handleEditSave} disabled={saving}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
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
