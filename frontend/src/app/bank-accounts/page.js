'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, LogOut, Settings, Bell, Plus, Trash2, Check, Clock, AlertCircle, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/utils/animations';
import MobileNav from '@/components/MobileNav';
import axios from 'axios';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Transactions', href: '/transactions' },
  { icon: MessageSquare, label: 'Expenses', href: '/expenses' },
  { icon: Wallet, label: 'Budgets', href: '/budgets' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function BankAccountsPage() {
  const router = useRouter();
  const pathname = usePathname();
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
      alert('Failed to add bank account');
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

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex-col z-30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-lg text-gray-900">FinanceTracker</h1>
              <p className="text-xs text-gray-500">Group 11</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-inter text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3 space-y-1">
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
            <h1 className="font-poppins font-bold text-lg sm:text-2xl text-gray-900">Bank Accounts</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block">
                <Bell className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm cursor-pointer">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          className="p-4 sm:p-8 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Info Alert */}
          <motion.div variants={itemVariants} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">Secure Bank Connection</h3>
              <p className="text-blue-800 text-xs sm:text-sm mt-1">Your bank account information is securely stored and encrypted. We never share your account details without your permission.</p>
            </div>
          </motion.div>

          {/* Add Bank Button */}
          <motion.div variants={itemVariants} className="flex gap-4">
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
          <motion.div variants={itemVariants} className="space-y-4">
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
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
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
        </motion.div>
      </main>
    </div>
  );
}
