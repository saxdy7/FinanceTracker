'use client';

import Link from 'next/link';
import { Bell, Settings, Search, TrendingUp } from 'lucide-react';

export default function TopBar({ title, user }) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="px-8 py-4 flex items-center justify-between">
        <h1 className="font-poppins font-bold text-2xl text-gray-900">{title}</h1>
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
          {user && (
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-md transition" 
              title={`${user.firstName} ${user.lastName}`}
            >
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
