'use client';

import { usePathname, useRouter } from 'next/navigation';
import ModernSidebar from './ModernSidebar';
import { Menu, Bell, X, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function DashboardLayout({ children, pageTitle, actions }) {
  const pathname = usePathname();
  const router = useRouter();
  // Desktop: start expanded; Mobile: start closed
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── DESKTOP SIDEBAR ─────────────────────────────────── */}
      <motion.div
        initial={false}
        animate={{ width: desktopExpanded ? 256 : 0, opacity: desktopExpanded ? 1 : 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="hidden lg:block flex-shrink-0 relative z-30 overflow-hidden"
      >
        <ModernSidebar
          pathname={pathname}
          onLogout={handleLogout}
          onClose={() => setDesktopExpanded(false)}
          showCloseButton
        />
      </motion.div>

      {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            {/* Slide-in panel */}
            <motion.div
              key="mobile-sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
            >
              <ModernSidebar
                pathname={pathname}
                onLogout={handleLogout}
                onClose={() => setMobileOpen(false)}
                showCloseButton
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm flex-shrink-0">
          <div className="px-3 sm:px-5 py-3 flex items-center justify-between gap-3">

            {/* Left: menu/toggle + title */}
            <div className="flex items-center gap-2 min-w-0">

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition flex-shrink-0"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop collapse/expand toggle */}
              <button
                onClick={() => setDesktopExpanded(prev => !prev)}
                className="hidden lg:flex p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition flex-shrink-0 items-center justify-center"
                aria-label={desktopExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <motion.div
                  animate={{ rotate: desktopExpanded ? 0 : 180 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.div>
              </button>

              {pageTitle && (
                <h1 className="font-bold text-base sm:text-lg text-gray-900 truncate">{pageTitle}</h1>
              )}
            </div>

            {/* Right: actions + bell + avatar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
              <Link
                href="/notifications"
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
              >
                <Bell className="w-5 h-5" />
              </Link>
              <div
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-md hover:shadow-blue-200 transition-shadow flex-shrink-0"
                title={user ? `${user.firstName} ${user.lastName}` : ''}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
