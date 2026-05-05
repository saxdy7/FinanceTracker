import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// Helper — builds the API base URL safely from env vars
const getApiUrl = () => {
  const defaultUrl = process.env.NODE_ENV === 'production'
    ? 'https://financetracker-oejz.onrender.com'
    : 'http://localhost:5000';
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || defaultUrl;
  return `${rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')}/api/v1`;
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const apiUrl = getApiUrl();
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await res.json();

          if (res.ok && data.user && data.token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: `${data.user.firstName} ${data.user.lastName}`,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              role: data.user.role,
              image: data.user.profilePicture || null,
              token: data.token
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // This block only runs on the very first sign-in
      if (account && user) {
        if (account.provider === 'google') {
          try {
            const apiUrl = getApiUrl();
            console.log('🔐 Google OAuth → syncing with backend:', apiUrl);

            const res = await fetch(`${apiUrl}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name || profile?.name || 'Google User',
                image: user.image || profile?.picture || '',
                googleId: account.providerAccountId
              })
            });

            const data = await res.json();
            console.log('🔐 Backend Google response status:', res.status, '| has token:', !!data.token);

            if (res.ok && data.user && data.token) {
              token.id = data.user.id;
              token.token = data.token;
              token.firstName = data.user.firstName;
              token.lastName = data.user.lastName;
              token.role = data.user.role;
              token.backendSynced = true;
              console.log('✅ Google user saved to MongoDB:', data.user.id);
            } else {
              console.error('❌ Google signin backend error:', data);
              // Store error info so session callback can detect failure
              token.backendError = data.message || 'Backend sync failed';
            }
          } catch (error) {
            console.error('❌ Google sign-in sync error:', error.message);
            token.backendError = error.message;
          }
        } else if (account.provider === 'credentials') {
          token.id = user.id;
          token.token = user.token;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.role = user.role;
          token.backendSynced = true;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Expose all fields to the client session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.token = token.token;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
