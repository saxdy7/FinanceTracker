'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">Terms of Service</h1>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using FinanceTracker, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on
                FinanceTracker for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
                of title, and under this license you may not:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the site</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
              <p>
               <a href="mailto:mamidalasandeep5@gmail.com" className="text-blue-600 hover:underline">mamidalasandeep5@gmail.com</a>kes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or
                conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or
                other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
              <p>
                In no event shall FinanceTracker or its suppliers be liable for any damages (including, without limitation, damages
                for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials
                on FinanceTracker.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on FinanceTracker could include technical, typographical, or photographic errors. FinanceTracker
                does not warrant that any of the materials on its website are accurate, complete, or current. FinanceTracker may make
                changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at support@financetracker.app
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
