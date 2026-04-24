'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Lock, CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, pageTransition } from '@/utils/animations';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState('email'); // email or reset

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        { email }
      );

      setResetToken(response.data.resetToken);
      setStage('reset');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Lock className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Forgot Password?</h1>
            <p className="text-gray-600 mt-2">
              {stage === 'email'
                ? 'Enter your email to receive a reset link'
                : 'Check your email for the reset link'}
            </p>
          </div>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 text-sm">
                {stage === 'email'
                  ? 'Reset link sent to your email!'
                  : 'Password reset link generated!'}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {stage === 'email' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 text-sm">
                  <strong>Reset Token:</strong>
                </p>
                <p className="text-blue-800 text-xs font-mono mt-2 break-all bg-white p-2 rounded border border-blue-300">
                  {resetToken}
                </p>
                <p className="text-blue-700 text-xs mt-2">
                  Use this token with your new password to reset it.
                </p>
              </div>

              <button
                onClick={() => router.push('/reset-password')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                Go to Reset Password
              </button>
            </div>
          )}

          {/* Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            <p>
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
