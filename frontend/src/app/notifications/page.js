'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Trash2, CheckCircle, Info, AlertTriangle, XCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/utils/api';

const TYPE_ICON = {
  success:  CheckCircle,
  info:     Info,
  warning:  AlertTriangle,
  error:    XCircle,
};

const TYPE_STYLE = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  info:    'bg-blue-50   text-blue-700   border-blue-100',
  warning: 'bg-amber-50  text-amber-700  border-amber-100',
  error:   'bg-red-50    text-red-700    border-red-100',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [mounted, setMounted]           = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterType, setFilterType]     = useState('all');
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    fetchNotifications();
    connectSocket(token);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [router]);

  // ── Fetch from DB ─────────────────────────────────────────────────────────
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Socket.IO real-time connection ─────────────────────────────────────────
  const connectSocket = (token) => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://financetracker-oejz.onrender.com';
    const socketUrl = rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

    const sock = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 5,
    });

    sock.on('connect', () => {
      setSocketConnected(true);
      // Join the user's personal room so the backend can push targeted notifications
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) sock.emit('join', user.id);
    });

    sock.on('disconnect', () => setSocketConnected(false));

    // Listen for real-time notifications pushed from the backend routes
    sock.on('notification', (data) => {
      setNotifications(prev => [{ ...data, _id: data._id || Date.now().toString() }, ...prev]);
    });

    socketRef.current = sock;
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}`, { read: true });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications', { read: true });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* silent */ }
  };

  const deleteOne = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch { /* silent */ }
  };

  const clearAll = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
    } catch { /* silent */ }
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = notifications.filter(n => {
    const matchType = filterType === 'all' || n.type === filterType || n.category === filterType;
    const matchSearch = !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Render ────────────────────────────────────────────────────────────────
  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-1 min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-gray-500 text-sm">Loading notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusBadge = (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
        socketConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {socketConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {socketConnected ? 'Live' : 'Offline'}
      </div>
      <button
        onClick={fetchNotifications}
        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
        title="Refresh"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <DashboardLayout pageTitle="Notifications" actions={statusBadge}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-5">

        {/* Stats bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-800">
            {unreadCount > 0
              ? <span className="text-blue-600">{unreadCount} unread</span>
              : <span className="text-gray-400">All caught up ✅</span>}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500">{notifications.length} total</span>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
          >
            <option value="all">All</option>
            <option value="expense">Expenses</option>
            <option value="budget">Budgets</option>
            <option value="payment">Bank / Payment</option>
            <option value="success">Success</option>
            <option value="warning">Warnings</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition whitespace-nowrap"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition whitespace-nowrap"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Notification Cards */}
        <motion.div className="space-y-2" initial="hidden" animate="visible" variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
        }}>
          <AnimatePresence>
            {filtered.length > 0 ? filtered.map(n => {
              const Icon = TYPE_ICON[n.type] || Info;
              const style = TYPE_STYLE[n.type] || TYPE_STYLE.info;
              return (
                <motion.div
                  key={n._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60, height: 0 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                  onClick={() => !n.read && markAsRead(n._id)}
                  className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    n.read ? 'bg-white border-gray-100 opacity-70' : `${style} border`
                  } hover:shadow-md`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    n.read ? 'bg-gray-100' : ''
                  }`}>
                    <Icon className={`w-5 h-5 ${n.read ? 'text-gray-400' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : 'just now'}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteOne(n._id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            }) : (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 space-y-3"
              >
                <Bell className="w-12 h-12 text-gray-200 mx-auto" />
                <p className="text-gray-500 font-semibold">No notifications</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery || filterType !== 'all' ? 'Try clearing your filters' : 'Activity will appear here automatically'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
