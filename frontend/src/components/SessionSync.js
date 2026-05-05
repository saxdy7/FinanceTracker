'use client';

/**
 * SessionSync — mirrors the NextAuth session (Google OAuth or credentials)
 * into localStorage so every page reading localStorage('token') works after
 * Google sign-in. Also handles redirect to dashboard after Google OAuth.
 */
import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function SessionSync() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const synced = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated') {
      // ── Case 1: Backend sync succeeded — token present ────────────────────
      if (session?.user?.token) {
        const existingToken = localStorage.getItem('token');

        if (existingToken !== session.user.token) {
          // Write token + user to localStorage
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
          console.log('✅ SessionSync: token stored for', user.email);
        }

        // Redirect to dashboard from auth pages
        // NOTE: '/' is excluded because after logout signOut sends user to '/'
        // and we must NOT bounce them back to dashboard from there.
        const authPages = ['/login', '/register'];
        if (authPages.includes(pathname) && !synced.current) {
          synced.current = true;
          router.replace('/dashboard');
        }
      }

      // ── Case 2: Authenticated via NextAuth but backend failed (no token) ──
      // This happens when Render is sleeping or backend returned an error.
      // Sign the user out of NextAuth to avoid a broken session loop.
      if (session && !session?.user?.token && status === 'authenticated') {
        const alreadyHasLocalToken = !!localStorage.getItem('token');
        if (!alreadyHasLocalToken) {
          console.warn('⚠️ SessionSync: NextAuth session exists but no backend token. Backend may be sleeping.');
          // Don't force sign-out — user may have logged in via email already
          // Just log the warning so the developer can debug via Render logs.
        }
      }
    }

    // ── Case 3: Session expired / signed out — clear localStorage ──────────
    if (status === 'unauthenticated') {
      // Only clear if we had a session before (avoids clearing on first load)
      // Don't clear here — let the individual pages / logout handler do it.
    }
  }, [session, status, pathname, router]);

  return null;
}
