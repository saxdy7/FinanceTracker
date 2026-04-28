'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Users, Zap, Database, Globe, Cpu, Sparkles, Cloud, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">About FinanceTracker</h1>
          <p className="text-blue-100 mt-2 text-lg">Empowering Indians to take control of their finances</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-2xl p-8 mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              FinanceTracker was built with a simple mission: to empower every Indian to take control of their personal finances.
              We believe that financial freedom shouldn't be complicated. Our platform combines smart expense tracking,
              AI-powered insights, and community support to help you make better money decisions.
            </p>
          </motion.div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Heart, title: 'User-First', description: 'Everything we build is designed with you in mind' },
              { icon: Zap, title: 'Innovation', description: 'Using AI and latest tech to solve real financial problems' },
              { icon: Users, title: 'Community', description: 'Building a community of financially conscious Indians' }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-600 text-lg">
              FinanceTracker is built by a passionate team of developers, designers, and financial experts
              dedicated to making personal finance simple and accessible for everyone in India.
            </p>
          </motion.div>

          {/* Tech Stack Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Technology Stack</h2>

            {/* Tech Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Frontend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Frontend</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>⚛️ React & Next.js</li>
                  <li>🎨 Tailwind CSS</li>
                  <li>✨ Framer Motion</li>
                  <li>📊 Recharts</li>
                  <li>🌊 Zustand</li>
                </ul>
              </motion.div>

              {/* Backend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Cpu className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Backend</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>🚀 Express.js</li>
                  <li>🔐 JWT Auth</li>
                  <li>🔒 Bcryptjs</li>
                  <li>🛡️ CORS & Helmet</li>
                  <li>🔌 Socket.IO</li>
                </ul>
              </motion.div>

              {/* Services & AI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-gray-900">Services & AI</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>🤖 Groq API</li>
                  <li>📧 Nodemailer</li>
                  <li>💾 json2csv</li>
                  <li>🔐 256-bit Encryption</li>
                  <li>📱 Responsive Design</li>
                </ul>
              </motion.div>

              {/* DevOps & Deployment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Cloud className="w-6 h-6 text-orange-600" />
                  <h3 className="font-bold text-gray-900">DevOps & Deployment</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>🌐 Vercel</li>
                  <li>☁️ MongoDB Atlas</li>
                  <li>📦 Node.js</li>
                  <li>🐳 Docker Ready</li>
                  <li>⚡ Optimized</li>
                </ul>
              </motion.div>
            </div>

            {/* Architecture Flow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gray-50 rounded-xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Application Architecture Flow</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                {/* User */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                  className="bg-blue-500 text-white rounded-lg px-6 py-4 font-semibold text-center min-w-fit"
                >
                  👤 User Interface
                </motion.div>

                {/* Arrow 1 */}
                <div className="hidden md:block text-2xl text-blue-600 font-bold">→</div>
                <div className="md:hidden text-2xl text-blue-600 font-bold">↓</div>

                {/* Frontend */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="bg-blue-100 border-2 border-blue-500 text-gray-900 rounded-lg px-6 py-4 font-semibold text-center min-w-fit"
                >
                  🎨 Frontend<br/><span className="text-sm font-normal">Next.js + React</span>
                </motion.div>

                {/* Arrow 2 */}
                <div className="hidden md:block text-2xl text-blue-600 font-bold">→</div>
                <div className="md:hidden text-2xl text-blue-600 font-bold">↓</div>

                {/* API Layer */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-purple-100 border-2 border-purple-500 text-gray-900 rounded-lg px-6 py-4 font-semibold text-center min-w-fit"
                >
                  ⚙️ API Layer<br/><span className="text-sm font-normal">Express + Groq</span>
                </motion.div>

                {/* Arrow 3 */}
                <div className="hidden md:block text-2xl text-blue-600 font-bold">→</div>
                <div className="md:hidden text-2xl text-blue-600 font-bold">↓</div>

                {/* Database */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3 }}
                  className="bg-green-500 text-white rounded-lg px-6 py-4 font-semibold text-center min-w-fit"
                >
                  💾 Database<br/><span className="text-sm font-normal">MongoDB Atlas</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
