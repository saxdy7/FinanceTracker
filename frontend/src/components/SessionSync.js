'use client';

/**
 * SessionSync — invisible component that mirrors the NextAuth session
 * (Google OAuth or credentials) into localStorage so that all pages
 * reading localStorage.getItem('token') / localStorage.getItem('user')
 * work correctly after Google sign-in.
 */
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function SessionSync() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user?.token) {
      const existingToken = localStorage.getItem('token');

      // Only write if token changed (avoids unnecessary re-renders)
      if (existingToken !== session.user.token) {
        localStorage.setItem('token', session.user.token);

        const nameParts = (session.user.name || '').split(' ');
        const user = {
          id: session.user.id || '',
          firstName: session.user.firstName || nameParts[0] || '',
          lastName: session.user.lastName || nameParts.slice(1).join(' ') || '',
          email: session.user.email || '',
          role: session.user.role || 'user',
          profilePicture: session.user.image || '',
        };
        localStorage.setItem('user', JSON.stringify(user));
      }

      // If we're on /login or /register after Google OAuth, redirect to dashboard.
      // This is outside the token check to handle race conditions where a protected
      // page might have bounced the user back to /login before SessionSync finished.
      if (pathname === '/login' || pathname === '/register') {
        router.replace('/dashboard');
      }
    }
  }, [session, status, pathname, router]);

  return null; // Renders nothing
}
