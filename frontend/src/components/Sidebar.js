import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav className="space-y-2">
        <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">
          Dashboard
        </Link>
        <Link href="/expenses" className="block px-4 py-2 rounded hover:bg-gray-700">
          Expenses
        </Link>
        <Link href="/budgets" className="block px-4 py-2 rounded hover:bg-gray-700">
          Budgets
        </Link>
        <Link href="/analytics" className="block px-4 py-2 rounded hover:bg-gray-700">
          Analytics
        </Link>
        <Link href="/profile" className="block px-4 py-2 rounded hover:bg-gray-700">
          Profile
        </Link>
        <Link href="/logout" className="block px-4 py-2 rounded hover:bg-gray-700">
          Logout
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
