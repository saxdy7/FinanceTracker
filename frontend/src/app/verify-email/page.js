'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// ── Inner component uses useSearchParams — must be inside <Suspense> ──────────
function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail]                       = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading]                   = useState(false);
  const [success, setSuccess]                   = useState(false);
  const [error, setError]                       = useState('');
  const [resending, setResending]               = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !verificationCode) { setError('Email and verification code are required'); return; }
    setLoading(true); setError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        email, verificationToken: verificationCode
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) { setError('Please enter your email first'); return; }
    setResending(true); setError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-verification-email`, { email });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-500 text-sm mt-1">Enter the code sent to your email address</p>
          </div>

          {success && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-800 text-sm font-medium">Email verified! Redirecting…</span>
            </div>
          )}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Verification Code</label>
              <input type="text" value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.toUpperCase())}
                placeholder="Paste your verification code" disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>

            <button type="button" onClick={handleResend} disabled={resending}
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm">
              {resending && <Loader className="w-4 h-4 animate-spin" />}
              {resending ? 'Sending…' : 'Resend Code'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 space-y-1.5">
            <p>Already verified? <Link href="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link></p>
            <p>Need help? <Link href="/login" className="text-blue-600 hover:underline font-semibold">Contact support</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page export wraps the form in Suspense to fix the Next.js deopt warning ──
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-white/40 border-t-white animate-spin" />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
