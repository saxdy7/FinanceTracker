'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search, Filter, Trash2, CheckCircle, Info, AlertTriangle, Archive, X, AlertCircle, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, Settings, LogOut, TrendingUp, Zap, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import axios from 'axios';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Transactions', href: '/transactions' },
  { icon: MessageSquare, label: 'Expenses', href: '/expenses' },
  { icon: Wallet, label: 'Budgets', href: '/budgets' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Zap, label: 'Insights', href: '/insights' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
];

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Socket.IO connection
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

    // Load initial notifications
    fetchNotifications(token);

    // Connect to Socket.IO
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Socket.IO event listeners
    socketInstance.on('connect', () => {
      console.log('Connected to notification server');
      setSocketConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from notification server');
      setSocketConnected(false);
    });

    socketInstance.on('budget-notification', (data) => {
      addNotification({
        id: Date.now(),
        title: 'Budget Alert',
        message: data.message,
        type: 'warning',
        timestamp: 'just now',
        read: false,
        icon: AlertTriangle,
        category: 'budget'
      });
    });

    socketInstance.on('transaction-recorded', (data) => {
      addNotification({
        id: Date.now(),
        title: 'Transaction Recorded',
        message: data.message,
        type: 'success',
        timestamp: 'just now',
        read: false,
        icon: CheckCircle,
        category: 'transaction'
      });
    });

    socketInstance.on('expense-alert', (data) => {
      addNotification({
        id: Date.now(),
        title: 'Expense Alert',
        message: data.message,
        type: 'warning',
        timestamp: 'just now',
        read: false,
        icon: AlertTriangle,
        category: 'expense'
      });
    });

    socketInstance.on('report-ready', (data) => {
      addNotification({
        id: Date.now(),
        title: 'Report Generated',
        message: data.message,
        type: 'info',
        timestamp: 'just now',
        read: false,
        icon: Info,
        category: 'report'
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [router]);

  const fetchNotifications = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use default data if API fails
      setNotifications([
        {
          id: 1,
          title: 'Budget Alert',
          message: 'You have exceeded your shopping budget by $150',
          type: 'warning',
          timestamp: '2 hours ago',
          read: false,
          icon: AlertTriangle,
          category: 'budget'
        },
        {
          id: 2,
          title: 'Transaction Recorded',
          message: 'Your payment of $45.50 has been recorded successfully',
          type: 'success',
          timestamp: '4 hours ago',
          read: false,
          icon: CheckCircle,
          category: 'transaction'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.category === filterType);
    }

    if (!showRead) {
      filtered = filtered.filter(n => !n.read);
    }

    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, filterType, showRead, searchQuery]);

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.3 },
    },
  };

  if (!mounted || !user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 animate-spin mx-auto"></div>
          <p className="text-gray-600 font-inter">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-poppins font-bold text-2xl text-blue-600">FinanceTracker</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-inter font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-gray-100 space-y-2">
          <Link
            href="/settings"
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-inter font-medium text-sm">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-inter font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-poppins font-bold text-2xl text-gray-900">Notifications</h1>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                socketConnected
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {socketConnected ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs font-semibold">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs font-semibold">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Types</option>
                <option value="budget">Budget</option>
                <option value="transaction">Transaction</option>
                <option value="expense">Expense</option>
                <option value="report">Report</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Mark all as read
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    variants={itemVariants}
                    exit="exit"
                    className={`p-4 rounded-lg border border-gray-200 flex items-start justify-between cursor-pointer transition hover:shadow-md ${
                      notification.read ? 'bg-gray-50' : `${getTypeColor(notification.type)}`
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <notification.icon className={`w-6 h-6 mt-1 flex-shrink-0 ${
                        notification.type === 'warning' ? 'text-yellow-600' :
                        notification.type === 'success' ? 'text-green-600' :
                        notification.type === 'error' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="ml-4 p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold">No notifications yet</p>
                  <p className="text-gray-400 text-sm">You're all caught up!</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
