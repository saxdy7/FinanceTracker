'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Loader, Trash2, TrendingUp, IndianRupee, History } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const WELCOME_MESSAGE = {
  id: '__welcome__',
  text: "नमस्ते! 👋 I'm your AI financial advisor. I have access to your expense and budget data to give you personalised advice in ₹. Ask me anything about your finances!",
  sender: 'bot',
  timestamp: new Date()
};

const SUGGESTED = [
  'How can I reduce my spending this month?',
  'Which category am I overspending on?',
  'Give me budget tips for next month',
  'Am I on track with my financial goals?'
];

export default function ChatPage() {
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError]               = useState('');
  const [financialContext, setFinancialContext] = useState(null);
  const [contextLoaded, setContextLoaded]       = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load history + financial context on mount
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const token  = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    await Promise.all([
      loadHistory(token, apiUrl),
      loadFinancialContext(token, apiUrl)
    ]);
  };

  /* ── LOAD CHAT HISTORY FROM DB ── */
  const loadHistory = async (token, apiUrl) => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const dbMessages = res.data.messages || [];

      if (dbMessages.length === 0) {
        // No history yet → show welcome
        setMessages([WELCOME_MESSAGE]);
      } else {
        // Convert DB format to UI format and show welcome + history
        const uiMessages = dbMessages.map((m, i) => ({
          id: m._id || `db-${i}`,
          text: m.content,
          sender: m.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(m.timestamp || Date.now()),
          fromDB: true
        }));
        setMessages([WELCOME_MESSAGE, ...uiMessages]);
      }
    } catch (err) {
      console.error('Could not load chat history:', err.message);
      setMessages([WELCOME_MESSAGE]);
    } finally {
      setHistoryLoading(false);
    }
  };

  /* ── LOAD FINANCIAL CONTEXT ── */
  const loadFinancialContext = async (token, apiUrl) => {
    try {
      const [expRes, budgetRes] = await Promise.all([
        axios.get(`${apiUrl}/expenses?limit=200`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/budgets`,            { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const expenses = expRes.data.expenses || [];
      const budgets  = budgetRes.data.budgets || [];

      const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
      const categoryBreakdown = {};
      expenses.forEach(e => {
        categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
      });

      const now = new Date();
      const monthlyTotal = expenses
        .filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, e) => s + e.amount, 0);

      const budgetStatus = budgets.map(b => ({
        category: b.category,
        limit: b.limit,
        spent: categoryBreakdown[b.category] || 0,
        percent: Math.round(((categoryBreakdown[b.category] || 0) / b.limit) * 100)
      }));

      setFinancialContext({
        totalTransactions: expenses.length,
        totalSpentAllTime: Math.round(totalSpent),
        monthlySpent: Math.round(monthlyTotal),
        categoryBreakdown,
        budgetStatus,
        topCategory: Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
        currency: 'INR (₹)',
        recentTransactions: expenses.slice(0, 5).map(e => ({
          desc: e.description, amount: e.amount, category: e.category, date: e.date
        }))
      });
      setContextLoaded(true);
    } catch (err) {
      console.error('Could not load financial context:', err.message);
      setContextLoaded(true);
    }
  };

  /* ── SEND MESSAGE ── */
  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    const userMessage = { id: Date.now(), text: msg, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const token  = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(
        `${apiUrl}/chat`,
        { message: msg, financialContext: financialContext || {} },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.advice || response.data.message || 'I could not generate a response.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errMsg);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: 'Sorry, I had trouble responding. Please check if the backend server is running.', sender: 'bot', timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ── CLEAR CHAT (DB + UI) ── */
  const clearChat = async () => {
    if (!window.confirm('Clear all chat history? This cannot be undone.')) return;
    try {
      const token  = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to clear history from DB:', err.message);
    }
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
  };

  const nonWelcomeMessages = messages.filter(m => m.id !== '__welcome__');

  const pageActions = (
    <button
      onClick={clearChat}
      className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition text-xs sm:text-sm text-gray-500"
    >
      <Trash2 className="w-4 h-4" />
      <span className="hidden sm:inline">Clear History</span>
    </button>
  );

  return (
    <DashboardLayout pageTitle="AI Financial Advisor" actions={pageActions}>
      <div className="flex flex-col flex-1 h-[calc(100vh-73px)]">

        {/* Data context banner */}
        {contextLoaded && financialContext && (
          <div className="px-4 sm:px-6 py-2 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-wrap gap-3 items-center text-xs text-gray-600">
            <div className="flex items-center gap-1 font-semibold text-blue-700">
              <TrendingUp className="w-3.5 h-3.5" />
              AI has your live data:
            </div>
            <span className="flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3" />
              Monthly: <strong className="ml-0.5">₹{financialContext.monthlySpent?.toLocaleString('en-IN')}</strong>
            </span>
            <span>{financialContext.totalTransactions} transactions</span>
            <span>Top: <strong className="capitalize">{financialContext.topCategory}</strong></span>
            <span>{financialContext.budgetStatus?.length} budgets</span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">

          {/* History loading state */}
          {historyLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <div className="w-10 h-10 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin" />
              <p className="text-sm font-medium">Loading your chat history...</p>
            </div>
          ) : (
            <>
              {/* History badge */}
              {nonWelcomeMessages.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-500 font-medium shadow-sm">
                    <History className="w-3 h-3" />
                    {nonWelcomeMessages.length} message{nonWelcomeMessages.length !== 1 ? 's' : ''} from history
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1 shadow-md shadow-blue-200">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] sm:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
                      } ${msg.fromDB ? 'opacity-90' : ''}`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <span className={`text-xs mt-1.5 block ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                        {msg.timestamp instanceof Date
                          ? msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                          : new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                        }
                        {msg.fromDB && <span className="ml-1 text-gray-300">· saved</span>}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-md shadow-blue-200">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-100 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-1.5 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts — show only when no real messages yet */}
        {!historyLoading && nonWelcomeMessages.length === 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Suggested questions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl transition border border-blue-100 font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error bar */}
        {error && (
          <div className="px-4 sm:px-6 py-3 bg-red-50 border-t border-red-100 text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Ask about your finances in ₹..."
              disabled={loading || historyLoading}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50 bg-white"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim() || historyLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition font-medium text-sm shadow-md shadow-blue-100"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
