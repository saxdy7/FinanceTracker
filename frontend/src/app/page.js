'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, ArrowRight, PieChart, Target, Zap, Shield,
  CheckCircle2, BarChart3, Smartphone, Plus, Minus,
  IndianRupee, Brain, Bell, Lock, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

const features = [
  { icon: PieChart,     title: 'Smart Expense Tracking',   description: 'Automatically categorise every rupee spent with intelligent insights and real-time dashboards.', color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' },
  { icon: Target,       title: 'Flexible Budgets',         description: 'Create custom ₹ budgets per cat                                                                      egory and get instant alerts before you overspend.',               color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' },
  { icon: BarChart3,    title: 'Advanced Analytics',       description: 'Beautiful visualisations of your spending patterns across days, weeks and months.',                color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white' },
  { icon: Brain,        title: 'AI Financial Advisor',     description: 'Get personalised recommendations powered by your own spending data in Indian Rupees.',             color: 'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' },
  { icon: Bell,         title: 'Smart Notifications',      description: 'Get alerted for unusual spending, budget limits, and important financial milestones.',              color: 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white' },
  { icon: Smartphone,   title: 'Mobile First',             description: 'Fully responsive — manage your finances seamlessly on any phone, tablet or desktop.',              color: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white' },
];

const steps = [
  { step: '01', title: 'Create Account',      description: 'Sign up with just your email in under 60 seconds. No credit card required.' },
  { step: '02', title: 'Add Your Expenses',   description: 'Log expenses manually or in bulk. Categories auto-detect for faster entry.' },
  { step: '03', title: 'Track & Grow',        description: 'Monitor budgets, read AI insights, and watch your savings grow every month.' },
];

const testimonials = [
  { name: 'Arjun Sharma',    role: 'Software Engineer, Bengaluru',  text: 'FinanceTracker helped me cut my food delivery spend by 40%. The AI advisor is shockingly accurate!', avatar: 'AS' },
  { name: 'Priya Mehta',     role: 'Freelance Designer, Mumbai',    text: 'Finally a finance app built for India! ₹ everywhere, UPI support, and a beautiful interface.', avatar: 'PM' },
  { name: 'Rohan Verma',     role: 'MBA Student, Delhi',            text: 'The budget alerts changed my habits. I went from overspending to saving ₹8,000 a month!', avatar: 'RV' },
];

const faqs = [
  { q: 'Is my financial data secure?',             a: 'Yes. We use 256-bit AES encryption and SSL/TLS in transit. Your data is never shared with third parties.' },
  { q: 'Does it support Indian banks and UPI?',    a: 'Absolutely! You can link bank accounts, UPI IDs, and credit/debit cards from all major Indian banks.' },
  { q: 'Can I export my data?',                    a: 'Yes — export all transactions and reports as CSV or PDF anytime with one click.' },
  { q: 'How does the AI advisor work?',            a: 'It reads your real spending and budget data and gives personalised advice in ₹, in plain simple language.' },
  { q: 'Is it free?',                              a: 'Yes! FinanceTracker is completely free to use. Create an account and start tracking immediately.' },
  { q: 'Does it work on mobile?',                  a: 'FinanceTracker is fully mobile-responsive and works great on all Android and iOS browsers.' },
];

export default function HomePage() {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div whileHover={{ scale: 1.04 }} className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">FinanceTracker</span>
            </motion.div>
            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => router.push('/login')}
                className="hidden sm:inline text-gray-600 hover:text-gray-900 font-medium text-sm transition px-3 py-1.5">
                Sign In
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => router.push('/register')}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-md shadow-blue-200">
                Get Started Free
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-28 sm:pt-28 sm:pb-36 overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-25 -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-sm font-semibold text-blue-700">Made for India · ₹ First</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-bold text-5xl sm:text-6xl lg:text-7xl text-gray-900 leading-[1.08] tracking-tight"
              >
                Take Control of<br />
                <span className="text-blue-600">Your Money</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-gray-500 leading-relaxed max-w-lg"
              >
                Track expenses, set budgets, and get AI-powered insights — all in Indian Rupees, built for the way you actually spend.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 20px 30px -8px rgba(37,99,235,0.35)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push('/register')}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold text-base shadow-lg shadow-blue-200"
                >
                  Start Tracking Free
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push('/login')}
                  className="px-8 py-3.5 border-2 border-gray-200 text-gray-800 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition font-semibold text-base"
                >
                  Sign In
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
              >
                {[
                  { label: 'Active Users',     value: '10K+' },
                  { label: 'Expenses Tracked', value: '₹50Cr+' },
                  { label: 'Data Encrypted',   value: '256-bit' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="font-bold text-3xl text-blue-600">{stat.value}</div>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — floating UI mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="hidden lg:flex relative h-[440px] items-center justify-center"
            >
              {/* Main dashboard card */}
              <motion.div
                whileHover={{ y: -6 }}
                className="absolute top-0 left-4 right-4 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Spent This Month</p>
                    <p className="font-bold text-3xl text-gray-900 mt-0.5">₹24,850</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Food', val: '₹8,200', color: 'bg-blue-50 text-blue-700' },
                    { label: 'Transport', val: '₹3,400', color: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Shopping', val: '₹6,100', color: 'bg-violet-50 text-violet-700' },
                  ].map((c, i) => (
                    <div key={i} className={`${c.color} rounded-xl px-3 py-2.5 text-center`}>
                      <p className="text-xs font-medium opacity-70">{c.label}</p>
                      <p className="font-bold text-sm mt-0.5">{c.val}</p>
                    </div>
                  ))}
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-1.5 h-10">
                  {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i === 5 ? '#3B82F6' : '#DBEAFE' }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <span key={i} className={`text-[10px] flex-1 text-center ${i === 5 ? 'font-bold text-blue-600' : 'text-gray-400'}`}>{d}</span>
                  ))}
                </div>
              </motion.div>

              {/* AI insight pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ y: -4 }}
                className="absolute bottom-8 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 max-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">AI Insight</span>
                </div>
                <p className="text-[11px] text-gray-500">You spent 23% less on food this week 🎉</p>
              </motion.div>

              {/* Budget progress card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                whileHover={{ y: -4 }}
                className="absolute bottom-4 right-0 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 w-44"
              >
                <p className="text-xs font-semibold text-gray-700 mb-2">Budget Used</p>
                <div className="flex items-end gap-1.5 mb-1.5">
                  <span className="font-bold text-xl text-gray-900">68%</span>
                  <span className="text-xs text-emerald-600 font-medium mb-0.5">On track ✓</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '68%' }} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-16 space-y-3">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Features</span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900">Everything You Need</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Powerful tools designed for smarter personal finance management</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.07)}
                whileHover={{ y: -6, boxShadow: '0 20px 30px -8px rgba(0,0,0,0.10)' }}
                className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-blue-100 transition-all duration-300 cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5 transition-all duration-300`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY BANNER ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp(0)}
            className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-10 sm:p-14 text-white overflow-hidden relative"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-3xl sm:text-4xl mb-4 leading-tight">Bank-Level Security</h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Your financial data is protected with military-grade 256-bit encryption. We are fully GDPR compliant and never sell your information.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['256-bit Encryption', 'SSL / TLS', 'GDPR Compliant', '24/7 Monitoring'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3.5">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-300" />
                    <span className="text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-16 space-y-3">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">How It Works</span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900">Get Started in 3 Steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

            {steps.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.12)} className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl mb-6 shadow-lg shadow-blue-200">
                  {s.step}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 max-w-xs">{s.description}</p>
                {i < 2 && <ChevronRight className="hidden md:block absolute -right-4 top-8 text-blue-300 w-6 h-6" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-16 space-y-3">
            <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">Testimonials</span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900">Loved Across India</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Real users, real savings — from Mumbai to Bengaluru</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                whileHover={{ y: -5 }}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-7 hover:shadow-lg transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-16 space-y-3">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">FAQ</span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900">Got Questions?</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeUp(idx * 0.06)}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 transition"
              >
                <button
                  className="w-full p-5 flex items-center justify-between font-semibold text-gray-900 text-left gap-4 focus:outline-none"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                >
                  <span>{item.q}</span>
                  <motion.div animate={{ rotate: openFaqIndex === idx ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
                    {openFaqIndex === idx
                      ? <Minus className="w-5 h-5 text-blue-600" />
                      : <Plus className="w-5 h-5 text-gray-400" />}
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                    >
                      <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <motion.div
          {...fadeUp(0)}
          className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl px-8 sm:px-16 py-14 text-center text-white relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
          <div className="relative space-y-6">
            <h2 className="font-bold text-4xl sm:text-5xl leading-tight">Ready to Take Control?</h2>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto">
              Join thousands of Indians already tracking their money smarter with FinanceTracker. It's 100% free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 30px -8px rgba(0,0,0,0.25)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-base hover:bg-gray-50 transition shadow-lg"
              >
                Create Free Account →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
                className="px-8 py-4 border-2 border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition"
              >
                Already have an account?
              </motion.button>
            </div>
            <p className="text-blue-200 text-sm">No credit card · No hidden charges · Free forever</p>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── 
      <footer className="bg-gray-950 text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-base">FinanceTracker</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Take control of your finances.<br />Made with ❤️ for India.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wide">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {['Features', 'Security', 'Dashboard'].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wide">Company</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {['About', 'Blog', 'Contact'].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wide">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {['Privacy', 'Terms', 'Cookie Policy'].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2026 FinanceTracker. All rights reserved.</p>
            <p className="text-gray-600 text-sm">Built for India 🇮🇳</p>
          </div>
        </div>
      </footer>
      */}
    </div>
  );
}
