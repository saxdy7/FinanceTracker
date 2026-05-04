'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">Cookie Policy</h1>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small files that are stored on your computer, mobile phone, or other device when you visit a website.
                They are widely used to make websites work, or to work more efficiently, as well as to provide information to the owners
                of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our website</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Cookies</h2>
              <p>
                We use cookies for several purposes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>To recognize you and remember your preferences</li>
                <li>To understand how you use our website</li>
                <li>To improve the functionality of our service</li>
                <li>To provide personalized content and recommendations</li>
                <li>To maintain your login session</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Cookie Choices</h2>
              <p>
                You have the right to choose whether or not to accept cookies. However, please note that if you choose to refuse cookies,
                you may not be able to use all the features of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Cookies</h2>
              <p>
                Our website may contain links to third-party websites. These third parties may use their own cookies to collect information
                about you. We are not responsible for the cookie practices of third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at <a href="mailto:mamidalasandeep5@gmail.com" className="text-blue-600 hover:underline">mamidalasandeep5@gmail.com</a>
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
