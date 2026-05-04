import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import SessionSync from '@/components/SessionSync';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'FinanceTracker',
  description: 'Track your expenses and manage your budget',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {/* Syncs NextAuth session (Google OAuth) token → localStorage */}
          <SessionSync />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
