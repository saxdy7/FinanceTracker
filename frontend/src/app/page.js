'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowRight, PieChart, Target, Zap, Shield, CheckCircle2, Send, BarChart3, Smartphone, Globe, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const features = [
    {
      icon: PieChart,
      title: 'Smart Expense Tracking',
      description: 'Automatically categorize and track every transaction with intelligent insights.'
    },
    {
      icon: Target,
      title: 'Flexible Budgets',
      description: 'Create custom budgets and get instant alerts when approaching limits.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your spending patterns with beautiful visualizations.'
    },
    {
      icon: Zap,
      title: 'AI Insights',
      description: 'Get personalized financial recommendations based on your habits.'
    },
    {
      icon: Send,
      title: 'Money Transfer',
      description: 'Send and receive money instantly with secure transactions.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your finances anytime, anywhere on any device.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="font-poppins font-bold text-lg text-gray-900">FinanceTracker</span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')} 
                className="text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10"></div>
        <div className="absolute top-20 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="text-sm font-medium text-blue-600">Join thousands managing their money smarter</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="font-poppins font-bold text-5xl sm:text-6xl lg:text-7xl text-gray-900 leading-tight"
                >
                  Financial Freedom Starts Here
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-xl text-gray-600 font-inter leading-relaxed max-w-lg"
                >
                  Track expenses, manage budgets, and get AI-powered insights to take control of your finances.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/register')}
                  className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
                >
                  <span>Start Free Today</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="px-8 py-3.5 border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition font-semibold"
                >
                  Sign In
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
              >
                {[
                  { label: 'Active Users', value: '10K+' },
                  { label: 'Tracked', value: '$1B+' },
                  { label: 'Encrypted', value: '256-bit' }
                ].map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                  >
                    <div className="font-poppins font-bold text-3xl text-blue-600">{stat.value}</div>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex justify-center items-center relative h-96"
            >
              {/* Main Card - Income & Expenses */}
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ y: -5 }}
                className="absolute top-0 left-0 right-0 w-80 bg-white rounded-3xl p-6 shadow-2xl"
              >
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Income</p>
                    <p className="font-poppins font-bold text-2xl text-gray-900">$24,908</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Expenses</p>
                    <p className="font-poppins font-bold text-2xl text-gray-900">$1,028</p>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="relative h-20 mb-4 bg-gray-50 rounded-lg p-2">
                  <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                    <polyline points="0,20 20,15 40,25 60,18 80,22 100,20" fill="none" stroke="#3B82F6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <circle cx="40" cy="25" r="3" fill="#3B82F6" />
                  </svg>
                  <div className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded-full bottom-12 left-8">$5,052</div>
                </div>

                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Jan 12</span>
                  <span>Jan 13</span>
                  <span>Jan 14</span>
                  <span>Jan 15</span>
                </div>
              </motion.div>

              {/* Success Notification Card - Top Right */}
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ y: -5 }}
                className="absolute top-20 right-0 w-72 bg-white rounded-2xl p-5 shadow-xl"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Payment Received</p>
                    <p className="text-green-600 font-bold text-sm">+$34,908.00</p>
                  </div>
                </div>
              </motion.div>

              {/* Success Badge - Left */}
              <motion.div 
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ y: -5 }}
                className="absolute left-0 top-32 w-32 bg-white rounded-2xl p-5 shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Transfer was</p>
                  <p className="text-xs text-gray-600 font-semibold">successful!</p>
                </div>
              </motion.div>

              {/* Balance Card - Bottom Left */}
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ y: -5 }}
                className="absolute bottom-0 left-0 w-40 bg-white rounded-2xl p-4 shadow-lg"
              >
                <p className="text-gray-500 text-xs mb-1">Total Balance</p>
                <p className="font-poppins font-bold text-2xl text-gray-900">$35,798</p>
              </motion.div>

              {/* Transactions Card - Bottom Right */}
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ y: -5 }}
                className="absolute bottom-0 right-0 w-72 bg-white rounded-2xl p-4 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-900">Stripe</span>
                    <span className="text-green-600 font-bold">+523.10</span>
                  </div>
                  <p className="text-xs text-gray-500">Deposit • Today at 7:18 AM</p>

                  <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-900">Facebook charge</span>
                    <span className="text-red-600 font-bold">-600.00</span>
                  </div>
                  <p className="text-xs text-gray-500">Advertising • Today at 6:24 AM</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-poppins font-bold text-4xl sm:text-5xl text-gray-900">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you take full control of your finances
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 transition duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-600 transition flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition" />
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 font-inter">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Security Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-white animate-fade-blur" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-poppins font-bold text-3xl mb-4">Bank-Level Security</h3>
                <p className="text-blue-100 text-lg font-inter leading-relaxed">
                  Your financial data is protected with 256-bit encryption and advanced security protocols. We never share your information.
                </p>
              </div>
              <div className="space-y-4">
                {['256-bit Encryption', '24/7 Monitoring', 'GDPR Compliant', 'Regular Audits'].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 animate-slide-blur-left" style={{ animationDelay: `${0.4 + idx * 0.1}s` }}>
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                    <span className="font-inter">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-poppins font-bold text-4xl sm:text-5xl text-gray-900 animate-slide-blur-left" style={{ animationDelay: '0.1s' }}>
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-blur" style={{ animationDelay: '0.3s' }}>
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Sign Up', description: 'Create your account in less than 2 minutes with Google or email.' },
              { step: '02', title: 'Connect Bank', description: 'Securely connect your bank account to auto-sync transactions.' },
              { step: '03', title: 'Manage & Grow', description: 'Track expenses, set budgets, and get AI-powered financial insights.' }
            ].map((item, idx) => (
              <div key={idx} className="relative animate-fade-blur" style={{ animationDelay: `${0.2 + idx * 0.15}s` }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-poppins font-bold text-3xl mb-6">
                    {item.step}
                  </div>
                  <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 font-inter">{item.description}</p>
                  {idx < 2 && <div className="hidden md:block absolute -right-6 top-10 text-3xl text-gray-300">→</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-poppins font-bold text-4xl sm:text-5xl text-gray-900 animate-slide-blur-right" style={{ animationDelay: '0.1s' }}>
              Loved by Users Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-blur" style={{ animationDelay: '0.3s' }}>
              Join thousands of happy users managing their finances smartly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Entrepreneur', text: 'FinanceTracker helped me save 30% more every month. The AI insights are incredibly accurate!' },
              { name: 'Michael Chen', role: 'Freelancer', text: 'Best financial app I\'ve used. The interface is so clean and intuitive. Highly recommend!' },
              { name: 'Emma Davis', role: 'Student', text: 'Finally understand where my money goes. The budgeting feature is a game-changer for me.' }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg animate-fade-blur" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 font-inter mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-poppins font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-poppins font-bold text-4xl sm:text-5xl text-gray-900 animate-slide-blur-left" style={{ animationDelay: '0.1s' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-blur" style={{ animationDelay: '0.3s' }}>
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Free', 
                price: '$0', 
                features: ['Basic expense tracking', 'Manual entry', 'Dashboard', 'Export reports', 'Email support'],
                popular: false 
              },
              { 
                name: 'Pro', 
                price: '$9.99', 
                features: ['Auto sync transactions', 'Smart budgets', 'AI insights', 'Advanced analytics', 'Priority support', 'Bank-level security'],
                popular: true 
              },
              { 
                name: 'Premium', 
                price: '$19.99', 
                features: ['Everything in Pro', 'Family sharing', 'Investment tracking', 'Crypto wallet', 'Tax calculations', 'Phone support'],
                popular: false 
              }
            ].map((plan, idx) => (
              <div key={idx} className={`relative rounded-2xl p-8 animate-fade-blur ${plan.popular ? 'ring-2 ring-blue-600 bg-white shadow-xl scale-105' : 'bg-gray-50 border border-gray-100'}`} style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    POPULAR
                  </div>
                )}
                <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <button className={`w-full py-2.5 rounded-lg font-semibold mb-6 transition ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
                  Get Started
                </button>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <motion.section 
        className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-poppins font-bold text-4xl sm:text-5xl text-gray-900">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Is my financial data secure?', a: 'Yes, we use 256-bit encryption, SSL/TLS protocols, and comply with GDPR. Your data is never shared with third parties without permission.' },
              { q: 'Can I export my data?', a: 'Yes! You can export all your data in CSV or PDF format anytime. There are no data lock-ins with FinanceTracker.' },
              { q: 'Do you support multiple currencies?', a: 'Absolutely! We support 150+ currencies and automatic conversion at real exchange rates.' },
              { q: 'Can I connect multiple bank accounts?', a: 'Yes, you can connect unlimited bank accounts and credit cards from your country.' },
              { q: 'What if I cancel my subscription?', a: 'You can cancel anytime with no questions asked. Your data remains accessible for 90 days.' },
              { q: 'Do you offer a mobile app?', a: 'Yes! FinanceTracker is fully responsive and works great on mobile. Native apps for iOS and Android are coming soon.' }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition overflow-hidden"
              >
                <div 
                  className="p-5 flex items-center justify-between font-poppins font-bold text-gray-900 cursor-pointer select-none"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                >
                  {item.q}
                  <motion.div
                    animate={{ rotate: openFaqIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {openFaqIndex === idx ? <Minus className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-gray-400" />}
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-5 pb-5 pt-0 text-gray-600 text-sm">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-poppins font-bold text-4xl sm:text-5xl text-gray-900 animate-slide-blur-right" style={{ animationDelay: '0.2s' }}>
              Ready to Take Control?
            </h2>
            <p className="text-xl text-gray-600 font-inter animate-fade-blur" style={{ animationDelay: '0.4s' }}>
              Join thousands of users already managing their money smarter with FinanceTracker.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-blur" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-xl hover:border-gray-400 transition font-semibold text-lg"
            >
              Already Have Account?
            </button>
          </div>
          <p className="text-sm text-gray-600 font-inter animate-blur-in" style={{ animationDelay: '0.8s' }}>
            No credit card required • Free for 7 days • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="animate-fade-blur" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="font-bold">FinanceTracker</span>
              </div>
              <p className="text-gray-400 text-sm">Take control of your finances</p>
            </div>
            <div className="animate-fade-blur" style={{ animationDelay: '0.2s' }}>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div className="animate-fade-blur" style={{ animationDelay: '0.3s' }}>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div className="animate-fade-blur" style={{ animationDelay: '0.4s' }}>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm text-center animate-blur-in" style={{ animationDelay: '0.5s' }}>
              &copy; 2026 FinanceTracker. All rights reserved. | Made with ❤️ for your financial freedom
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
