'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, TrendingUp, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, pageTransition, formInputVariants } from '@/utils/animations';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setSuccess('Registration successful! Redirecting to dashboard...');
        
        // Small delay for user feedback
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand with Feature */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute opacity-10 w-96 h-96 bg-blue-400 rounded-full -top-48 -left-48"></div>
        <div className="absolute opacity-10 w-80 h-80 bg-blue-300 rounded-full bottom-0 right-0"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 backdrop-blur">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">FinanceTracker</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          {/* Feature Showcase */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Send Money Instantly</h3>
              <Send className="w-6 h-6 text-blue-300" />
            </div>
            <div className="space-y-2 mb-6">
              <div className="text-sm text-blue-100">Recent Transfer</div>
              <div className="text-3xl font-bold">$56,476.00</div>
              <div className="text-sm text-blue-100">+35% • February 20, 2026</div>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">J</div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">S</div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">K</div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-lg text-blue-100">Get better with money and make smarter financial decisions.</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-50">Send money instantly</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-50">Track spending automatically</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-50">Get AI-powered insights</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-blue-100">
          10K+ Users • Bank-level Security
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Sign up for an account</h1>
            <p className="text-gray-600">Send, spend and save smarter</p>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign up with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">Or with email</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    name="firstName"
                    placeholder="Alesia"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  name="lastName"
                  placeholder="Karpova"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="h-11 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="alesiakarpova@"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 h-11 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-xs text-gray-600">
              <input type="checkbox" id="terms" className="mt-1" required />
              <label htmlFor="terms">
                By creating an account, you agree to our{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Electronic Communication Policy
                </Link>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-lg">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 space-y-2">
            <p>
              <Link href="#" className="hover:underline">Privacy Policy</Link>
            </p>
            <p>© 2026 FinanceTracker. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
