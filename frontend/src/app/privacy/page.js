'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-gray-600"
          >
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                FinanceTracker ("we", "our", or "us") operates the financetracker.app website. This page informs you of our
                policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices
                you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information Collection and Use</h2>
              <p>
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Personal Data: Email address, first name, last name, phone number, financial data</li>
                <li>Usage Data: Pages visited, time spent on pages, IP address, browser type</li>
                <li>Payment Data: Through secure payment gateways (we do not store payment card details)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Security of Data</h2>
              <p>
                The security of your data is important to us but remember that no method of transmission over the Internet or
                method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your
                Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mamidalasandeep5@gmail.com" className="text-blue-600 hover:underline">mamidalasandeep5@gmail.com</a>
              </p>
            </section>

            <p className="text-sm text-gray-500 pt-8 border-t">
              Last updated: April 2026
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
