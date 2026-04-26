'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '@/components/DashboardLayout';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [moneyFlowData, setMoneyFlowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Fetch expenses
      const expensesRes = await axios.get(`${apiUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const expenseList = expensesRes.data.expenses || [];
      setExpenses(expenseList.slice(0, 5));

      // Calculate category breakdown
      const categoryMap = {};
      expenseList.forEach(exp => {
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
      });

      const spendingArray = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value: Math.round(value)
      }));

      setSpendingData(spendingArray);
      const total = expenseList.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalSpent(total);

      // Generate money flow data
      const flowData = generateMoneyFlowData(expenseList);
      setMoneyFlowData(flowData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setMoneyFlowData([]);
      setSpendingData([]);
      setExpenses([]);
    }
  };

  const generateMoneyFlowData = (expenseList) => {
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const dayExpenses = expenseList
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.toDateString() === date.toDateString();
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      data.push({
        date: dateStr,
        expenses: dayExpenses
      });
    }
    return data;
  };

  if (!mounted || !user || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-slate-400">Here's your financial overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Spent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6"
          >
            <p className="text-slate-400 text-sm">Total Spent</p>
            <h2 className="text-3xl font-bold text-white mt-2">${totalSpent.toFixed(2)}</h2>
            <p className="text-slate-500 text-xs mt-2">From {expenses.length} transactions</p>
          </motion.div>

          {/* Remaining Budget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6"
          >
            <p className="text-slate-400 text-sm">Remaining</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">${(50000 - totalSpent).toFixed(2)}</h2>
            <p className="text-slate-500 text-xs mt-2">Out of $50,000</p>
          </motion.div>

          {/* Average Expense */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6"
          >
            <p className="text-slate-400 text-sm">Average Expense</p>
            <h2 className="text-3xl font-bold text-blue-400 mt-2">${expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : '0.00'}</h2>
            <p className="text-slate-500 text-xs mt-2">Per transaction</p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Money Flow Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6"
          >
            <h3 className="text-white font-bold mb-4">7-Day Spending</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={moneyFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569' }} />
                <Line type="monotone" dataKey="expenses" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Spending by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6"
          >
            <h3 className="text-white font-bold mb-4">Spending by Category</h3>
            {spendingData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={spendingData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {spendingData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-white font-semibold">${item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-slate-400">No spending data yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6"
        >
          <h3 className="text-white font-bold mb-4">Recent Transactions</h3>
          {expenses.length > 0 ? (
            <div className="space-y-3">
              {expenses.map((exp) => (
                <div key={exp._id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition">
                  <div>
                    <p className="text-white font-medium">{exp.description}</p>
                    <p className="text-slate-400 text-sm">{new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 text-sm">{exp.category}</p>
                    <p className="text-white font-semibold">-${exp.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <p className="text-slate-400">No transactions yet</p>
              <a href="/expenses" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                Add First Expense
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
