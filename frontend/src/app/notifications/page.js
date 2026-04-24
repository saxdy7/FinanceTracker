'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search, Filter, Trash2, CheckCircle, Info, AlertTriangle, Archive, X, AlertCircle, LayoutGrid, FileText, MessageSquare, Wallet, Activity, BarChart3, Settings, LogOut, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const notificationsData = [
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
  },
  {
    id: 3,
    title: 'Report Generated',
    message: 'Your monthly financial report is ready to download',
    type: 'info',
    timestamp: '1 day ago',
    read: true,
    icon: Info,
    category: 'report'
  },
  {
    id: 4,
    title: 'Security Alert',
    message: 'New login detected from Chrome on Windows 10',
    type: 'warning',
    timestamp: '2 days ago',
    read: true,
    icon: AlertCircle,
    category: 'security'
  },
  {
    id: 5,
    title: 'Payment Successful',
    message: 'Your bill payment of $125.00 has been completed',
    type: 'success',
    timestamp: '3 days ago',
    read: true,
    icon: CheckCircle,
    category: 'payment'
  },
  {
    id: 6,
    title: 'Expense Category Update',
    message: 'New expense added: Coffee - $5.50',
    type: 'info',
    timestamp: '4 days ago',
    read: true,
    icon: Info,
    category: 'expense'
  },
  {
    id: 7,
    title: 'Budget Target Reached',
    message: 'Congratulations! You are within your monthly budget',
    type: 'success',
    timestamp: '5 days ago',
    read: true,
    icon: CheckCircle,
    category: 'budget'
  },
  {
    id: 8,
    title: 'Email Verification',
    message: 'Please verify your email address to complete setup',
    type: 'warning',
    timestamp: '6 days ago',
    read: true,
    icon: AlertCircle,
    category: 'account'
  },
];

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Transactions', href: '/transactions' },
  { icon: MessageSquare, label: 'Expenses', href: '/expenses' },
  { icon: Wallet, label: 'Budgets', href: '/budgets' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
];

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [filteredNotifications, setFilteredNotifications] = useState(notificationsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showRead, setShowRead] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Animation variants
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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        delay: 0.1,
      },
    },
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
        delay: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
        delay: 0.3,
      },
    },
  };

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
  }, [router]);

  useEffect(() => {
    filterNotifications();
  }, [searchQuery, filterType, showRead]);

  const filterNotifications = () => {
    let filtered = notifications;

    // Filter by read status
    if (!showRead) {
      filtered = filtered.filter(n => !n.read);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    // Search by title or message
    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const toggleRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const archiveNotification = (id) => {
    deleteNotification(id);
  };

  const getTypeBadge = (type) => {
    const badges = {
      success: 'bg-green-100 text-green-800 border-green-300',
      error: 'bg-red-100 text-red-800 border-red-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      info: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return badges[type] || badges.info;
  };

  const getTypeIcon = (type) => {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    };
    return icons[type] || Info;
  };

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 animate-spin mx-auto"></div>
          <p className="text-gray-600 font-inter">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-poppins font-bold text-lg text-gray-900">FinanceTracker</span>
          </Link>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-inter font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="border-t border-gray-100 p-3 space-y-1">
          <Link
            href="/settings"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
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
      <main className="flex-1 ml-64 overflow-auto">
        {/* Top Bar */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm"
        >
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-poppins font-bold text-2xl text-gray-900">Notifications</h1>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent ml-2 outline-none text-sm font-inter w-full"
                />
              </div>
              <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-gray-600" />
              </Link>
              <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Settings className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-md transition" title={`${user.firstName} ${user.lastName}`}>
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Page Content */}
        <div className="p-8">
          {unreadCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-700">{unreadCount} unread notifications</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Filter Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="font-bold text-gray-900 text-base flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Type Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Notification Type</label>
                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer hover:border-gray-400"
                      >
                        <option value="all">All Types</option>
                        <option value="success">✓ Success</option>
                        <option value="warning">⚠ Warning</option>
                        <option value="error">✕ Error</option>
                        <option value="info">ℹ Info</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status</label>
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => setShowRead(true)}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          showRead
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        All Notifications
                      </motion.button>
                      <motion.button
                        onClick={() => setShowRead(false)}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          !showRead
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Unread Only
                      </motion.button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-200"></div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <motion.button
                      onClick={markAllAsRead}
                      className="w-full px-4 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.05, backgroundColor: '#dcfce7' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark all read</span>
                    </motion.button>
                    <motion.button
                      onClick={clearAll}
                      className="w-full px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.05, backgroundColor: '#fee2e2' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear all</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            className="lg:col-span-3"
          >
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-6"
            >
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <motion.input
                  type="text"
                  placeholder="Search notifications by title or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600 max-w-xs mx-auto">
                  {searchQuery ? 'No notifications match your search criteria' : 'You\'re all caught up! You have no pending notifications.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification, index) => {
                  const TypeIcon = notification.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      variants={itemVariants}
                      layout
                      className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-md overflow-hidden ${
                        notification.read
                          ? 'border-gray-200 opacity-90'
                          : 'border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-sm'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4 p-5">
                        {/* Icon Badge */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold ${getTypeBadge(notification.type).split(' ')[0]} ${getTypeBadge(notification.type).split(' ')[1]}`}>
                          <TypeIcon className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h3 className="font-bold text-gray-900 text-base line-clamp-1">{notification.title}</h3>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5"></div>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm mb-2.5 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${getTypeBadge(notification.type)}`}>
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">{notification.timestamp}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={() => toggleRead(notification.id)}
                            className={`p-2.5 rounded-lg transition ${
                              notification.read
                                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'
                            }`}
                            title={notification.read ? 'Mark as unread' : 'Mark as read'}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => archiveNotification(notification.id)}
                            className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Archive"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Archive className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Footer Info */}
            {notifications.length > 0 && (
              <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold text-gray-900">{filteredNotifications.length}</span> of <span className="font-bold text-gray-900">{notifications.length}</span> notifications
                </p>
              </div>
            )}
          </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
