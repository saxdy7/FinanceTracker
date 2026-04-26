'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Clock, AlertCircle, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';



export default function BankAccountsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: ''
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

    fetchBankAccounts(token);
  }, [router]);

  const fetchBankAccounts = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/users/bank-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBankAccounts(response.data.bankAccounts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setLoading(false);
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/users/bank-accounts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ bankName: '', accountNumber: '', accountHolder: '' });
      setShowForm(false);
      fetchBankAccounts(token);
    } catch (error) {
      console.error('Error adding bank account:', error);
      const msg = error?.response?.data?.message || 'Failed to add bank account';
      alert(msg);
    }
  };

  const handleDeleteBank = async (accountId) => {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to remove this bank account?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/users/bank-accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBankAccounts(token);
    } catch (error) {
      console.error('Error deleting bank account:', error);
      alert('Failed to remove bank account');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!mounted) return null;

  const pageActions = (
    <button
      onClick={() => setShowForm(!showForm)}
      className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xs sm:text-sm font-semibold shadow-sm"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Add Bank Account</span>
      <span className="sm:hidden">Add</span>
    </button>
  );

  return (
    <DashboardLayout pageTitle="Bank Accounts" actions={pageActions}>
      <div className="p-4 sm:p-8 space-y-6">
          {/* Info Alert */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">Secure Bank Connection</h3>
              <p className="text-blue-800 text-xs sm:text-sm mt-1">Your bank account information is securely stored and encrypted. We never share your account details without your permission.</p>
            </div>
          </motion.div>

          {/* Add Bank Button */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
            >
              <Plus className="w-5 h-5" />
              <span>Add Bank Account</span>
            </button>
          </motion.div>

          {/* Add Bank Form */}
          {showForm && (
            <motion.form
              onSubmit={handleAddBank}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 space-y-4"
            >
              <h3 className="font-poppins font-bold text-lg text-gray-900">Connect Bank Account</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Chase, Wells Fargo, Bank of America"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    placeholder="Last 4 digits: ****1234"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    maxLength="4"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">For security, only enter the last 4 digits</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Your name as it appears on the account"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                >
                  Add Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Connected Accounts */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-4">
            <h2 className="font-poppins font-bold text-xl text-gray-900">Connected Accounts</h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading your accounts...</div>
            ) : bankAccounts.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">No bank accounts connected yet</p>
                <p className="text-gray-500 text-sm">Connect a bank account to start auto-tracking your expenses</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankAccounts.map((account, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-poppins font-bold text-lg text-gray-900">{account.bankName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Account: ****{account.accountNumber}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteBank(account._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                        title="Remove account"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Holder:</span> {account.accountHolder}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Added:</span> {new Date(account.addedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      {account.verified ? (
                        <>
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-600">Pending Verification</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info Box */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-poppins font-bold text-lg text-gray-900 mb-3">How It Works</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Add your bank account information securely</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>An admin will verify your account (24-48 hours)</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Once verified, expenses will auto-sync from your bank</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                <span>Track and manage your finances automatically</span>
              </li>
            </ol>
          </motion.div>
      </div>
    </DashboardLayout>
  );
}
