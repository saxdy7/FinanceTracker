'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Trash2, Edit2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';



export default function TransactionsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    bankAccountId: '',
    bankAccountName: ''
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

    fetchTransactions(token);
    fetchBankAccounts(token);
  }, [router]);

  const fetchTransactions = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.expenses || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const fetchBankAccounts = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/users/bank-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBankAccounts(response.data.bankAccounts || []);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.put(`${apiUrl}/expenses/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTransactions(transactions.map(t => t._id === id ? { ...t, ...editData } : t));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleAddTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = {
        ...newTransaction,
        category: newTransaction.category.toLowerCase()
      };
      // if a bank account was selected, populate its name too
      if (payload.bankAccountId) {
        const acc = bankAccounts.find(a => a._id === payload.bankAccountId);
        if (acc) payload.bankAccountName = `${acc.bankName} ****${acc.accountNumber}`;
      }
      const response = await axios.post(`${apiUrl}/expenses`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTransactions([response.data.expense, ...transactions]);
      setShowAddModal(false);
      setNewTransaction({
        description: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        bankAccountId: '',
        bankAccountName: ''
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-1 min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 animate-spin mx-auto" />
            <p className="text-gray-600">Loading transactions...</p>
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
      className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm font-medium"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Add Transaction</span>
      <span className="sm:hidden">Add</span>
    </button>
  );

  return (
    <DashboardLayout pageTitle="All Transactions" actions={pageActions}>
      <div className="p-4 sm:p-8">
          {/* Filters */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-inter text-sm">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>

          {/* Transactions Table - Responsive */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            {filteredTransactions.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Description</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-inter text-gray-900 truncate">{tx.description}</td>
                      <td className="hidden sm:table-cell px-6 py-4 text-sm font-inter">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm font-inter text-gray-600">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 text-sm font-inter text-gray-600">{tx.paymentMethod}</td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-right text-gray-900">
                        -${tx.amount.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingId(tx._id);
                              setEditData(tx);
                            }}
                            className="p-1 sm:p-2 hover:bg-blue-100 text-blue-600 rounded transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx._id)}
                            className="p-1 sm:p-2 hover:bg-red-100 text-red-600 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 space-y-4">
                <p>No transactions found.</p>
                <button 
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    try {
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                      const sampleData = [
                        { description: 'Rent', amount: 1200, category: 'other', date: new Date(Date.now() - 2 * 86400000).toISOString() },
                        { description: 'Groceries', amount: 150, category: 'food', date: new Date(Date.now() - 5 * 86400000).toISOString() },
                        { description: 'Netflix', amount: 15, category: 'entertainment', date: new Date(Date.now() - 10 * 86400000).toISOString() },
                        { description: 'Gas', amount: 40, category: 'transport', date: new Date(Date.now() - 12 * 86400000).toISOString() },
                        { description: 'Electric Bill', amount: 90, category: 'utilities', date: new Date(Date.now() - 15 * 86400000).toISOString() },
                        { description: 'Restaurant', amount: 65, category: 'food', date: new Date(Date.now() - 18 * 86400000).toISOString() }
                      ];
                      for (const exp of sampleData) {
                        await axios.post(`${apiUrl}/expenses`, exp, { headers: { Authorization: `Bearer ${token}` } });
                      }
                      window.location.reload();
                    } catch (err) {
                      console.error('Failed to load sample data', err);
                    }
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-semibold transition inline-block"
                >
                  Load Sample Data
                </button>
              </div>
            )}
          </div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
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
              <h2 className="font-poppins font-bold text-xl sm:text-2xl mb-6">Add Transaction</h2>
              <div className="space-y-4">
                <input
                  type="text" placeholder="Description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number" placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                {bankAccounts.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Paid from Bank Account (optional)</label>
                    <select
                      value={newTransaction.bankAccountId}
                      onChange={(e) => setNewTransaction({...newTransaction, bankAccountId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- No bank account --</option>
                      {bankAccounts.map((acc) => (
                        <option key={acc._id} value={acc._id}>
                          {acc.bankName} ****{acc.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex space-x-3 pt-2">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Cancel</button>
                  <button onClick={handleAddTransaction} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">Add</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
