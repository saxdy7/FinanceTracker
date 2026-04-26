'use client';

import { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Clock, Shield, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [unverifiedAccounts, setUnverifiedAccounts] = useState([]);
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Check if user is admin
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    fetchUnverifiedAccounts(token);
  }, [router]);

  const fetchUnverifiedAccounts = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/admin/bank-accounts/unverified`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnverifiedAccounts(response.data.unverifiedAccounts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching unverified accounts:', error);
      setLoading(false);
    }
  };

  const handleVerifyAccount = async (accountId) => {
    const token = localStorage.getItem('token');
    setVerifyingId(accountId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.post(
        `${apiUrl}/admin/bank-accounts/${accountId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Account verified successfully!');
      fetchUnverifiedAccounts(token);
      setVerifyingId(null);
    } catch (error) {
      console.error('Error verifying account:', error);
      alert('Failed to verify account');
      setVerifyingId(null);
    }
  };

  const handleRejectAccount = async (accountId) => {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to reject this account?')) return;
    setVerifyingId(accountId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/admin/bank-accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Account rejected');
      fetchUnverifiedAccounts(token);
      setVerifyingId(null);
    } catch (error) {
      console.error('Error rejecting account:', error);
      setVerifyingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!mounted) return null;
  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center flex-1 min-h-screen">
        <p className="text-gray-500">Loading admin data...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout pageTitle="Admin — Bank Verification">
      <div className="p-4 sm:p-8 space-y-6">
          {/* Info Alert */}
          <motion.div variants={itemVariants} className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start space-x-3">
            <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900 text-sm">Admin Verification Dashboard</h3>
              <p className="text-purple-800 text-xs sm:text-sm mt-1">Review and verify user bank accounts. Only verified accounts can auto-sync expenses from their banks.</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Review</p>
                  <p className="font-poppins font-bold text-3xl text-purple-600 mt-2">{unverifiedAccounts.length}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="font-poppins font-bold text-3xl text-blue-600 mt-2">—</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Verified Accounts</p>
                  <p className="font-poppins font-bold text-3xl text-green-600 mt-2">—</p>
                </div>
                <Check className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>
          </motion.div>

          {/* Unverified Accounts */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="font-poppins font-bold text-xl text-gray-900">Pending Verification</h2>

            {unverifiedAccounts.length === 0 ? (
              <div className="bg-green-50 rounded-lg border-2 border-dashed border-green-300 p-8 text-center">
                <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-900 font-medium mb-2">All Caught Up!</p>
                <p className="text-green-700 text-sm">There are no pending bank accounts to verify.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unverifiedAccounts.map((account, idx) => (
                  <motion.div
                    key={account._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border-2 border-yellow-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-poppins font-bold text-lg text-gray-900">{account.bankName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Account: ****{account.accountNumber}</p>
                      </div>
                      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4 mb-4">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">User:</span> {account.userName}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Account Holder:</span> {account.accountHolder}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Submitted:</span> {new Date(account.addedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifyAccount(account._id)}
                        disabled={verifyingId === account._id}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{verifyingId === account._id ? 'Verifying...' : 'Verify'}</span>
                      </button>
                      <button
                        onClick={() => handleRejectAccount(account._id)}
                        disabled={verifyingId === account._id}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold text-sm disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info Box */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-poppins font-bold text-lg text-gray-900 mb-3">Verification Guidelines</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Verify accounts that have valid bank and account holder information</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ensure account holder names match the user's registered name</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Once verified, user can auto-sync expenses from their bank</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Reject accounts with incomplete or suspicious information</span>
              </li>
            </ul>
          </motion.div>
      </div>
    </DashboardLayout>
  );
}
