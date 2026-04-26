'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Receipt, CreditCard, PieChart,
  BarChart3, FileBarChart, Lightbulb, Bell, MessageSquare,
  Settings, LogOut, TrendingUp, X, Landmark
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Receipt, label: 'Transactions', href: '/transactions' },
  { icon: CreditCard, label: 'Expenses', href: '/expenses' },
  { icon: PieChart, label: 'Budgets', href: '/budgets' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: FileBarChart, label: 'Reports', href: '/reports' },
  { icon: Lightbulb, label: 'Insights', href: '/insights' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: MessageSquare, label: 'AI Advisor', href: '/chat' },
  { icon: Landmark, label: 'Bank Accounts', href: '/bank-accounts' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function ModernSidebar({ pathname: propPathname, onLogout, onClose, showCloseButton }) {
  const routerPathname = usePathname();
  const pathname = propPathname || routerPathname;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col z-30 shadow-sm overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-[15px] leading-tight">FinanceTracker</p>
            <p className="text-[10px] text-gray-400 font-medium">Personal Finance</p>
          </div>
        </Link>
        {(showCloseButton || onClose) && (
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full"
                />
              )}
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-700'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5 flex-shrink-0">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-[18px] h-[18px] text-gray-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
