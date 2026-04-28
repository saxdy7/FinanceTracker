'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: '10 Money-Saving Tips for Indians',
    excerpt: 'Discover practical tips to save more money and achieve your financial goals.',
    date: 'April 15, 2026',
    author: 'FinanceTracker Team',
    category: 'Savings',
    slug: 'money-saving-tips'
  },
  {
    id: 2,
    title: 'Understanding Budget Planning',
    excerpt: 'Learn how to create effective budgets and stick to them throughout the month.',
    date: 'April 10, 2026',
    author: 'FinanceTracker Team',
    category: 'Budgeting',
    slug: 'budget-planning'
  },
  {
    id: 3,
    title: 'Investment Guide for Beginners',
    excerpt: 'Start your investment journey with our comprehensive beginner\'s guide.',
    date: 'April 5, 2026',
    author: 'FinanceTracker Team',
    category: 'Investment',
    slug: 'investment-guide'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">FinanceTracker Blog</h1>
          <p className="text-blue-100 mt-2 text-lg">Financial tips, insights, and guides for smarter money management</p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>
                <button className="mt-4 text-blue-600 font-semibold hover:text-blue-700">Read More →</button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
