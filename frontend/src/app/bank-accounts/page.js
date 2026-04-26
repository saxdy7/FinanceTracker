'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Check, Wallet, CreditCard, Smartphone,
  Building2, ShieldCheck, ChevronDown, ChevronUp, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

const ACCOUNT_TYPES = [
  { value: 'bank', label: 'Bank Account', icon: Building2, color: 'bg-blue-100 text-blue-700', desc: 'Savings / Current account' },
  { value: 'upi', label: 'UPI', icon: Smartphone, color: 'bg-purple-100 text-purple-700', desc: 'Google Pay, PhonePe, BHIM, Paytm' },
  { value: 'credit-card', label: 'Credit Card', icon: CreditCard, color: 'bg-orange-100 text-orange-700', desc: 'Visa, Mastercard, RuPay' },
  { value: 'debit-card', label: 'Debit Card', icon: CreditCard, color: 'bg-green-100 text-green-700', desc: 'ATM / Debit card' },
];

const INDIAN_BANKS = [
  'State Bank of India (SBI)', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
  'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India',
  'Bank of India', 'IndusInd Bank', 'Yes Bank', 'IDBI Bank', 'Federal Bank',
  'South Indian Bank', 'UCO Bank', 'IOB', 'Central Bank of India', 'Other'
];

const CARD_NETWORKS = ['Visa', 'Mastercard', 'RuPay', 'American Express', 'Diners Club'];

function getTypeConfig(type) {
  return ACCOUNT_TYPES.find(t => t.value === type) || ACCOUNT_TYPES[0];
}

function AccountCard({ account, onDelete }) {
  const config = getTypeConfig(account.accountType);
  const Icon = config.icon;
  const displayName = account.accountType === 'upi'
    ? account.upiId
    : `${account.bankName}`;
  const displaySub = account.accountType === 'upi'
    ? 'UPI ID'
    : account.accountType === 'credit-card' || account.accountType === 'debit-card'
    ? `${account.cardNetwork || ''} ****${account.accountNumber}`
    : `Acct ****${account.accountNumber}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{displaySub}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(account._id)}
          className="p-2 hover:bg-red-50 rounded-xl transition text-red-500 flex-shrink-0 ml-2"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{account.accountHolder}</span>
          {account.ifscCode && <span className="ml-2 text-gray-400">· {account.ifscCode}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span className="text-xs font-semibold text-green-600">Verified</span>
        </div>
      </div>

      <div className="mt-2">
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
          {config.label}
        </span>
        <span className="text-[10px] text-gray-400 ml-2">
          Added {new Date(account.addedAt).toLocaleDateString('en-IN')}
        </span>
      </div>
    </motion.div>
  );
}

export default function BankAccountsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeType, setActiveType] = useState('bank');
  const [formData, setFormData] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    cardNetwork: 'Visa',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchBankAccounts(token);
  }, [router]);

  const fetchBankAccounts = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/users/bank-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBankAccounts(response.data.bankAccounts || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = { ...formData, accountType: activeType };
      await axios.post(`${apiUrl}/users/bank-accounts`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ accountHolder: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '', cardNetwork: 'Visa' });
      fetchBankAccounts(token);
    } catch (error) {
      setFormError(error?.response?.data?.message || 'Failed to add. Please check details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (accountId) => {
    if (!confirm('Remove this payment method?')) return;
    const token = localStorage.getItem('token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/users/bank-accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBankAccounts(token);
    } catch {
      alert('Failed to remove. Please try again.');
    }
  };

  if (!mounted) return null;

  const pageActions = (
    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xs sm:text-sm font-semibold shadow-sm"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Add Payment Method</span>
      <span className="sm:hidden">Add</span>
    </button>
  );

  return (
    <DashboardLayout pageTitle="Payment Methods" actions={pageActions}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Security Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900">Secure & Encrypted</p>
            <p className="text-xs text-blue-700 mt-0.5">
              Your payment details are encrypted and stored securely. We never share your information.
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACCOUNT_TYPES.map(type => {
            const count = bankAccounts.filter(a => a.accountType === type.value).length;
            const Icon = type.icon;
            return (
              <motion.div
                key={type.value}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm text-center"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 ${type.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{type.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Accounts List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">
              Connected Accounts <span className="text-gray-400 text-sm font-normal">({bankAccounts.length})</span>
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:underline"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : bankAccounts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center"
            >
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-semibold mb-1">No payment methods added yet</p>
              <p className="text-gray-400 text-sm mb-4">Add a bank account, UPI ID, or card to link with your transactions</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                + Add Payment Method
              </button>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bankAccounts.map((account) => (
                  <AccountCard key={account._id} account={account} onDelete={handleDelete} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-gray-900">Add Payment Method</h2>
                <button onClick={() => { setShowModal(false); setFormError(''); }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Type Selector */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {ACCOUNT_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setActiveType(type.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition ${
                        activeType === type.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${type.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${activeType === type.value ? 'text-blue-700' : 'text-gray-700'}`}>
                          {type.label}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight">{type.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={handleAdd} className="space-y-4">
                {/* Account Holder — always shown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="As shown on your account"
                    value={formData.accountHolder}
                    onChange={e => setFormData({ ...formData, accountHolder: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* UPI fields */}
                {activeType === 'upi' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      UPI ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. yourname@okicici"
                      value={formData.upiId}
                      onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">Google Pay, PhonePe, BHIM, Paytm UPI ID</p>
                  </div>
                )}

                {/* Bank-specific fields */}
                {activeType === 'bank' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Name <span className="text-red-500">*</span></label>
                      <select
                        value={formData.bankName}
                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                      >
                        <option value="">Select Bank</option>
                        {INDIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last 4 Digits <span className="text-red-500">*</span></label>
                        <input
                          type="text" maxLength={4} placeholder="1234"
                          value={formData.accountNumber}
                          onChange={e => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">IFSC Code</label>
                        <input
                          type="text" placeholder="SBIN0001234"
                          value={formData.ifscCode}
                          onChange={e => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Card fields */}
                {(activeType === 'credit-card' || activeType === 'debit-card') && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Name <span className="text-red-500">*</span></label>
                      <select
                        value={formData.bankName}
                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                      >
                        <option value="">Select Bank</option>
                        {INDIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last 4 Digits <span className="text-red-500">*</span></label>
                        <input
                          type="text" maxLength={4} placeholder="4321"
                          value={formData.accountNumber}
                          onChange={e => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Card Network</label>
                        <select
                          value={formData.cardNetwork}
                          onChange={e => setFormData({ ...formData, cardNetwork: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                          {CARD_NETWORKS.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {formError && (
                  <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setFormError(''); }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                    {saving ? 'Adding...' : 'Add Payment Method'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
