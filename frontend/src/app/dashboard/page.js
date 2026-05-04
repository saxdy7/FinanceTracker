'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '@/components/DashboardLayout';
import {
  TrendingUp, DollarSign, CreditCard,
  ArrowUpRight, Wallet, Plus, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

// ── Timezone-safe date helper ────────────────────────────────────────────────
// Returns "YYYY-MM-DD" in local (IST) timezone for any Date object
const toLocalDateStr = (date) => {
  const d = new Date(date);
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

// Chart config for shadcn ChartContainer
const areaChartConfig = {
  amount: {
    label: 'Spending (₹)',
    color: '#3B82F6',
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">₹{payload[0].value?.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    setMounted(true);
    if (status === 'loading') return; // Wait for NextAuth to sync token before redirecting
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchDashboardData(token);
  }, [router, status]);

  const fetchDashboardData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const [expRes, budgetRes] = await Promise.all([
        axios.get(`${apiUrl}/expenses?limit=2000`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/budgets`,              { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const expenseList = expRes.data.expenses || [];
      setExpenses(expenseList.slice(0, 6));
      setBudgets(budgetRes.data.budgets || []);

      // Category pie
      const categoryMap = {};
      expenseList.forEach(exp => {
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
      });
      setSpendingData(
        Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value: Math.round(value) }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6)
      );

      const total = expenseList.reduce((sum, e) => sum + e.amount, 0);
      setTotalSpent(total);

      // ── 7-day area chart using LOCAL date comparison ──────────────────
      // "today" is the actual current date in the user's local timezone
      const todayStr = toLocalDateStr(new Date());

      const flow = [];
      for (let i = 6; i >= 0; i--) {
        // Build a reference date that is exactly i days before today
        const ref = new Date();
        ref.setDate(ref.getDate() - i);
        const refStr = toLocalDateStr(ref);

        const label = ref.toLocaleDateString('en-IN', { weekday: 'short' });

        // Compare expense dates using the SAME local date string approach
        const amt = expenseList
          .filter(e => toLocalDateStr(new Date(e.date)) === refStr)
          .reduce((s, e) => s + e.amount, 0);

        flow.push({
          day: label,
          fullDate: refStr,
          amount: Math.round(amt),
          isToday: refStr === todayStr,
        });
      }
      setAreaData(flow);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-1 min-h-screen bg-gray-50">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-gray-500 text-sm font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const budgetUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const stats = [
    {
      label: 'Total Spent',
      value: `₹${totalSpent.toLocaleString('en-IN')}`,
      sub: `${expenses.length} transactions`,
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Budget Used',
      value: `${budgetUsed}%`,
      sub: `of ₹${totalBudget.toLocaleString('en-IN')} budget`,
      icon: Wallet,
      color: budgetUsed > 90 ? 'text-red-600' : 'text-emerald-600',
      bg: budgetUsed > 90 ? 'bg-red-50' : 'bg-emerald-50',
    },
    {
      label: 'Avg. Expense',
      value: `₹${Math.round(avgExpense).toLocaleString('en-IN')}`,
      sub: 'Per transaction',
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  // The last item in areaData is always today
  const todayAmount = areaData[areaData.length - 1]?.amount || 0;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span className="text-blue-600">{user?.firstName}!</span> 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link
            href="/expenses"
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-semibold shadow-md shadow-blue-200 hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(0.05 + i * 0.08)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition" />
              </div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{s.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{s.value}</h3>
              <p className="text-gray-400 text-xs mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Shadcn-wrapped Area Chart — 7-day spending */}
          <motion.div {...fadeUp(0.25)} className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-bold text-gray-900">Spending This Week</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daily breakdown · today:{' '}
                  <span className="font-semibold text-blue-600">
                    ₹{todayAmount.toLocaleString('en-IN')}
                  </span>
                </p>
              </div>
              <Link href="/analytics" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Full Analytics <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Today marker */}
            <div className="flex gap-2 mb-3">
              {areaData.map((d) => (
                <div key={d.fullDate} className="flex-1 text-center">
                  <div className={`text-[10px] font-semibold rounded-full px-1 py-0.5 ${
                    d.isToday
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400'
                  }`}>
                    {d.day}
                  </div>
                </div>
              ))}
            </div>

            <ChartContainer config={areaChartConfig} className="h-[200px] w-full">
              <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <ChartTooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="amount"
                  stroke="#3B82F6" strokeWidth={2.5}
                  fill="url(#blueGrad)"
                  dot={(props) => {
                    const entry = areaData[props.index];
                    return (
                      <circle
                        key={props.index}
                        cx={props.cx} cy={props.cy} r={entry?.isToday ? 6 : 4}
                        fill={entry?.isToday ? '#3B82F6' : '#93C5FD'}
                        stroke="#fff" strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ChartContainer>
          </motion.div>

          {/* Pie Chart — by category */}
          <motion.div {...fadeUp(0.3)} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900">By Category</h3>
              <p className="text-xs text-gray-500 mt-0.5">Spending breakdown</p>
            </div>
            {spendingData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={spendingData} cx="50%" cy="50%"
                      innerRadius={40} outerRadius={65}
                      paddingAngle={3} dataKey="value"
                    >
                      {spendingData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {spendingData.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-gray-600 capitalize truncate max-w-[80px]">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">₹{item.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                <DollarSign className="w-8 h-8 mb-2 opacity-30" />
                No spending data yet
              </div>
            )}
          </motion.div>
        </div>

        {/* Budget Progress + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Budget Progress */}
          <motion.div {...fadeUp(0.35)} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Budget Progress</h3>
                <p className="text-xs text-gray-500 mt-0.5">Monthly limits</p>
              </div>
              <Link href="/budgets" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.slice(0, 4).map((budget, idx) => {
                  const spent = expenses.reduce((s, e) => e.category === budget.category ? s + e.amount : s, 0);
                  const pct = Math.min((spent / budget.limit) * 100, 100);
                  const over = spent > budget.limit;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700 capitalize">{budget.category}</span>
                        <span className={`font-semibold ${over ? 'text-red-600' : 'text-gray-900'}`}>
                          ₹{Math.round(spent).toLocaleString('en-IN')} / ₹{budget.limit.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                          className={`h-full rounded-full ${over ? 'bg-red-500' : pct > 80 ? 'bg-orange-400' : 'bg-blue-600'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 text-sm space-y-3">
                <Wallet className="w-8 h-8 opacity-30" />
                <p>No budgets set yet</p>
                <Link href="/budgets" className="text-blue-600 text-xs font-medium hover:underline">
                  Create your first budget →
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div {...fadeUp(0.4)} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                <p className="text-xs text-gray-500 mt-0.5">Latest activity</p>
              </div>
              <Link href="/transactions" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {expenses.length > 0 ? (
              <div className="space-y-2">
                {expenses.slice(0, 5).map((exp, idx) => (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + idx * 0.06 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">{exp.description}</p>
                        <p className="text-xs text-gray-400 capitalize">{exp.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">-₹{exp.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(exp.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 text-sm space-y-3">
                <CreditCard className="w-8 h-8 opacity-30" />
                <p>No transactions yet</p>
                <Link href="/expenses" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition">
                  Add First Expense
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div {...fadeUp(0.45)}>
          <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Add Expense',  href: '/expenses', icon: DollarSign,  color: 'bg-blue-600' },
              { label: 'Set Budget',   href: '/budgets',  icon: Wallet,      color: 'bg-emerald-600' },
              { label: 'View Reports', href: '/reports',  icon: TrendingUp,  color: 'bg-purple-600' },
              { label: 'AI Advisor',   href: '/chat',     icon: CreditCard,  color: 'bg-orange-500' },
            ].map((action, i) => (
              <Link key={i} href={action.href}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-blue-100 transition-all group active:scale-95"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
