'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Lock, CheckCircle, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';

// ── Inner component uses useSearchParams — must be inside <Suspense> ──────────
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail]               = useState(searchParams.get('email') || '');
  const [resetToken, setResetToken]     = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const [error, setError]               = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !resetToken || !newPassword || !confirmPassword) {
      setError('All fields are required'); return;
    }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true); setError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        email, resetToken, newPassword
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your new password below</p>
          </div>

          {success && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-800 text-sm font-medium">Password reset! Redirecting to login…</span>
            </div>
          )}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reset Token</label>
              <input type="text" value={resetToken} onChange={e => setResetToken(e.target.value)}
                placeholder="Paste your reset token here" disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition" />
              <p className="text-xs text-gray-400 mt-1">Check your email for the reset token</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" disabled={loading}
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" disabled={loading}
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm mt-2">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 space-y-1.5">
            <p>Remember your password? <Link href="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link></p>
            <p>No account? <Link href="/register" className="text-blue-600 hover:underline font-semibold">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page export wraps the form in Suspense to fix the Next.js deopt warning ──
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-white/40 border-t-white animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
