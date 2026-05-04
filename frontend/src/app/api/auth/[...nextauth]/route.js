import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

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
          const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const apiUrl = `${rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')}/api/v1`;
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
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const apiUrl = `${rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')}/api/v1`;
          const res = await fetch(`${apiUrl}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: profile.sub
            })
          });

          const data = await res.json();

          if (res.ok && data.user && data.token) {
            // Attach backend data to the user object (passed to jwt callback)
            user.id = data.user.id;
            user.email = data.user.email;
            user.token = data.token;
            user.firstName = data.user.firstName;
            user.lastName = data.user.lastName;
            user.role = data.user.role;
            user.name = `${data.user.firstName} ${data.user.lastName}`;
            return true;
          } else {
            console.error('Google signin backend error:', data);
            return false;
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // Persist extra fields when user first signs in
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose all fields to the client session
      session.user.id = token.id;
      session.user.token = token.token;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.role = token.role;
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
