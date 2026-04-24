'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, pageTransition } from '@/utils/animations';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!email || !verificationCode) {
      setError('Email and verification code are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
        {
          email,
          verificationToken: verificationCode
        }
      );

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setResending(true);
    setError('');
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/send-verification-email`,
        { email }
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Verify Email</h1>
            <p className="text-gray-600 mt-2">
              Enter the verification code sent to your email
            </p>
          </div>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 text-sm">Email verified successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyEmail} className="space-y-4">
            {/* Email Input */}
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

            {/* Verification Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                placeholder="Enter 32-character code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-mono"
                disabled={loading}
              />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            {/* Resend Code Button */}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400 font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              {resending && <Loader className="w-4 h-4 animate-spin" />}
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <p>
              Already verified?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
            <p>
              Need help?{' '}
              <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
