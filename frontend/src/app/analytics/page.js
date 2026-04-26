'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchAnalyticsData(token);
  }, [router]);

  const fetchAnalyticsData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const expenseList = response.data.expenses || [];
      setExpenses(expenseList);

      // Monthly
      const monthMap = {};
      expenseList.forEach(exp => {
        const d = new Date(exp.date);
        const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
        monthMap[key] = (monthMap[key] || 0) + exp.amount;
      });
      setMonthlyData(
        Object.entries(monthMap)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([month, amount]) => ({ month, amount: Math.round(amount) }))
      );

      // Category
      const catMap = {};
      expenseList.forEach(exp => { catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount; });
      setCategoryData(
        Object.entries(catMap)
          .map(([name, value]) => ({ name, value: Math.round(value) }))
          .sort((a, b) => b.value - a.value)
      );

      // 30-day trend
      const trendMap = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        trendMap[d.toISOString().split('T')[0]] = 0;
      }
      expenseList.forEach(exp => {
        const key = new Date(exp.date).toISOString().split('T')[0];
        if (key in trendMap) trendMap[key] += exp.amount;
      });
      setTrendData(
        Object.entries(trendMap).map(([date, amount]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount: Math.round(amount)
        }))
      );

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-1 min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 animate-spin mx-auto" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const avgDaily       = expenses.length > 0 ? totalExpenses / 30 : 0;
  const avgTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const pageActions = (
    <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm">
      <Calendar className="w-4 h-4" />
      <span className="hidden sm:inline">Date Range</span>
    </button>
  );

  return (
    <DashboardLayout pageTitle="Analytics" actions={pageActions}>
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Total Spent',     value: `$${totalExpenses.toFixed(2)}`,  sub: 'All time',        color: 'text-green-600' },
            { label: 'Daily Average',   value: `$${avgDaily.toFixed(2)}`,       sub: 'Last 30 days',    color: 'text-blue-600' },
            { label: 'Avg Transaction', value: `$${avgTransaction.toFixed(2)}`, sub: 'Per expense',     color: 'text-orange-600' },
            { label: 'Transactions',    value: expenses.length,                  sub: 'Total records',   color: 'text-purple-600' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-xs sm:text-sm mb-2">{s.label}</p>
              <h2 className="font-poppins font-bold text-xl sm:text-3xl text-gray-900">{s.value}</h2>
              <p className={`text-xs sm:text-sm mt-2 ${s.color}`}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Monthly Spending</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 py-20">No data yet</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">By Category</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 py-20">No data yet</p>
            )}
          </motion.div>
        </div>

        {/* 30-Day Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 mb-4">Daily Spending (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} interval={4} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Table */}
        {categoryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900">Category Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">%</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((cat, idx) => (
                    <tr key={cat.name} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="capitalize">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">${cat.value.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                        {((cat.value / totalExpenses) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
