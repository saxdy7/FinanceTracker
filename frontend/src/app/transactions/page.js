'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Trash2, Edit2, Plus, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

const CATEGORIES = ['food', 'transport', 'shopping', 'entertainment', 'utilities', 'healthcare', 'education', 'other'];
const PAYMENT_METHODS = ['cash', 'credit-card', 'debit-card', 'bank-transfer', 'digital-wallet'];

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTx, setNewTx] = useState({
    description: '', amount: '', category: 'food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash', bankAccountId: '', bankAccountName: ''
  });
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit modal state
  const [editingTx, setEditingTx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchTransactions(token);
    fetchBankAccounts(token);
  }, [router]);

  const fetchTransactions = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.get(`${apiUrl}/expenses?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data.expenses || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankAccounts = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.get(`${apiUrl}/users/bank-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBankAccounts(res.data.bankAccounts || []);
    } catch {}
  };

  /* ── ADD ── */
  const handleAdd = async () => {
    if (!newTx.description.trim()) { setAddError('Please enter a description'); return; }
    if (!newTx.amount || isNaN(newTx.amount)) { setAddError('Please enter a valid amount in ₹'); return; }
    setAddSaving(true); setAddError('');
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = { ...newTx, amount: parseFloat(newTx.amount), category: newTx.category.toLowerCase() };
      if (payload.bankAccountId) {
        const acc = bankAccounts.find(a => a._id === payload.bankAccountId);
        if (acc) payload.bankAccountName = acc.upiId || `${acc.bankName} ****${acc.accountNumber}`;
      }
      const res = await axios.post(`${apiUrl}/expenses`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(prev => [res.data.expense, ...prev]);
      setShowAddModal(false);
      setNewTx({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], paymentMethod: 'cash', bankAccountId: '', bankAccountName: '' });
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setAddSaving(false);
    }
  };

  /* ── OPEN EDIT ── */
  const openEdit = (tx) => {
    setEditingTx(tx);
    setEditForm({
      description: tx.description,
      amount: tx.amount,
      category: tx.category,
      date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : '',
      paymentMethod: tx.paymentMethod || 'cash',
      notes: tx.notes || '',
    });
    setEditError('');
  };

  /* ── SAVE EDIT ── */
  const handleEditSave = async () => {
    if (!editForm.description?.trim()) { setEditError('Description is required'); return; }
    if (!editForm.amount || isNaN(editForm.amount)) { setEditError('Please enter a valid amount in ₹'); return; }
    setEditSaving(true); setEditError('');
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = { ...editForm, amount: parseFloat(editForm.amount) };
      const res = await axios.put(`${apiUrl}/expenses/${editingTx._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = res.data.expense || { ...editingTx, ...payload };
      setTransactions(prev => prev.map(t => t._id === editingTx._id ? updated : t));
      setEditingTx(null);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setEditSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/expenses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch {
      alert('Failed to delete transaction.');
    }
  };

  /* ── CSV Export ── */
  const exportCSV = () => {
    const rows = [
      ['Description', 'Category', 'Date', 'Payment Method', 'Amount (₹)'],
      ...filteredTransactions.map(tx => [
        tx.description, tx.category,
        new Date(tx.date).toLocaleDateString('en-IN'),
        tx.paymentMethod, tx.amount
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-1 min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-gray-500 text-sm">Loading transactions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(transactions.map(t => t.category))];

  const pageActions = (
    <button
      onClick={() => setShowAddModal(true)}
      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xs sm:text-sm font-semibold shadow-sm"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Add Transaction</span>
      <span className="sm:hidden">Add</span>
    </button>
  );

  // Shared form field classes
  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <DashboardLayout pageTitle="All Transactions" actions={pageActions}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-5">

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white capitalize"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
            </select>
            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition text-gray-600 font-medium"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">{filteredTransactions.length} transactions</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs font-semibold text-gray-700">
            Total: ₹{filteredTransactions.reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Description</th>
                    <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                    <th className="hidden md:table-cell px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                    <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Payment</th>
                    <th className="px-4 sm:px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount</th>
                    <th className="px-4 sm:px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence>
                    {filteredTransactions.map((tx, idx) => (
                      <motion.tr
                        key={tx._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 truncate max-w-[180px]">
                          {tx.description}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold capitalize">
                            {tx.category}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
                          {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-500 capitalize">{tx.paymentMethod}</td>
                        <td className="px-4 sm:px-6 py-4 text-right font-bold text-gray-900 whitespace-nowrap">
                          -₹{tx.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEdit(tx)}
                              className="p-2 hover:bg-blue-50 text-blue-500 hover:text-blue-700 rounded-xl transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tx._id)}
                              className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 space-y-3">
              <div className="text-4xl">📋</div>
              <p className="font-medium text-gray-500">No transactions found</p>
              {searchTerm || categoryFilter
                ? <p className="text-sm">Try adjusting your filters</p>
                : <button onClick={() => setShowAddModal(true)}
                    className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                    + Add First Transaction
                  </button>
              }
            </div>
          )}
        </div>
      </div>

      {/* ── ADD MODAL ── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-gray-900">Add Transaction</h2>
                <button onClick={() => { setShowAddModal(false); setAddError(''); }}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
                  <input type="text" placeholder="e.g. Coffee at CCD" value={newTx.description}
                    onChange={e => setNewTx({...newTx, description: e.target.value})}
                    className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                    <input type="number" placeholder="0" value={newTx.amount}
                      onChange={e => setNewTx({...newTx, amount: e.target.value})}
                      className={`${inputCls} pl-8`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                    <select value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})}
                      className={`${inputCls} bg-white capitalize`}>
                      {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Method</label>
                    <select value={newTx.paymentMethod} onChange={e => setNewTx({...newTx, paymentMethod: e.target.value})}
                      className={`${inputCls} bg-white`}>
                      {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
                  <input type="date" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})}
                    className={inputCls} />
                </div>
                {bankAccounts.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Paid from (optional)</label>
                    <select value={newTx.bankAccountId} onChange={e => setNewTx({...newTx, bankAccountId: e.target.value})}
                      className={`${inputCls} bg-white`}>
                      <option value="">-- No account --</option>
                      {bankAccounts.map(acc => (
                        <option key={acc._id} value={acc._id}>
                          {acc.accountType === 'upi' ? acc.upiId : `${acc.bankName} ****${acc.accountNumber}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {addError && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{addError}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowAddModal(false); setAddError(''); }}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={handleAdd} disabled={addSaving}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                    {addSaving ? 'Adding...' : 'Add Transaction'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {editingTx && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-xl text-gray-900">Edit Transaction</h2>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px]">{editingTx.description}</p>
                </div>
                <button onClick={() => setEditingTx(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
                  <input type="text" value={editForm.description}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className={inputCls} autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                    <input type="number" value={editForm.amount}
                      onChange={e => setEditForm({...editForm, amount: e.target.value})}
                      className={`${inputCls} pl-8`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                    <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}
                      className={`${inputCls} bg-white capitalize`}>
                      {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Method</label>
                    <select value={editForm.paymentMethod} onChange={e => setEditForm({...editForm, paymentMethod: e.target.value})}
                      className={`${inputCls} bg-white`}>
                      {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
                  <input type="date" value={editForm.date}
                    onChange={e => setEditForm({...editForm, date: e.target.value})}
                    className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes (optional)</label>
                  <input type="text" placeholder="Add a note..." value={editForm.notes}
                    onChange={e => setEditForm({...editForm, notes: e.target.value})}
                    className={inputCls} />
                </div>
                {editError && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{editError}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditingTx(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={handleEditSave} disabled={editSaving}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                    {editSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
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
