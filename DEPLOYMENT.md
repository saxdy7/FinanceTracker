# FinanceTracker Production Deployment Guide

## Current Architecture
- **Frontend**: Deployed on Vercel (Next.js)
- **Backend**: Separate Node.js/Express server (needs deployment)
- **Database**: MongoDB Atlas (cloud)

## Problem: Why Google Sign-In Doesn't Work on Production

Your production domain (https://finance-tracker-xi-three-76.vercel.app) cannot access Google Sign-In or contact form because:
1. Backend is still running locally (localhost:5000)
2. Production frontend can't reach a local backend
3. Environment variables in Vercel need updating

---

## Step 1: Deploy Backend to Production

### Option A: Deploy to Render (Recommended - Free with limitations)

1. Go to https://render.com
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Fill deployment settings:
   - **Name**: `finance-tracker-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Region**: Any (pick closest to you)
6. Click **"Advanced"** and add Environment Variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRE=7d
   PORT=5000
   ```
7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. **Copy the URL** (looks like: `https://finance-tracker-backend.onrender.com`)

### Option B: Deploy to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. New project → Import from GitHub
4. Select your repository
5. Add environment variables
6. Deploy automatically
7. Copy the production URL

### Option C: Deploy to Heroku

1. Go to https://www.heroku.com
2. Create app
3. Connect GitHub repository
4. Enable automatic deployments
5. Add environment variables
6. Deploy
7. Copy the URL

---

## Step 2: Update Frontend Environment Variables in Vercel

Now that your backend is deployed, update your frontend environment variables:

1. Go to https://vercel.com/dashboard
2. Click on **"finance-tracker-xi-three-76"** project
3. Go to **Settings** → **Environment Variables**
4. Update/add these variables:

```
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_APP_NAME=FinanceTracker
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SOCKET_IO=true

# Google OAuth (replace with your actual credentials)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth (for production)
NEXTAUTH_URL=https://finance-tracker-xi-three-76.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

5. Click **"Save"**
6. Vercel will automatically redeploy your frontend

---

## Step 3: Verify Google OAuth Settings

1. Go to https://console.cloud.google.com
2. Select your "finance-tracker" project
3. Go to **APIs & Services** → **Credentials**
4. Click your OAuth 2.0 Client ID
5. Update **Authorized URIs**:

**Authorized JavaScript origins:**
- `http://localhost:3000` (for local development)
- `https://finance-tracker-xi-three-76.vercel.app` (production)

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google`
- `https://finance-tracker-xi-three-76.vercel.app/api/auth/callback/google`

6. Click **Save**

---

## Step 4: Test Production

1. Wait 5-10 minutes for both deployments to complete
2. Visit https://finance-tracker-xi-three-76.vercel.app
3. Click **"Sign in with Google"** button
4. Fill out **"Contact Us"** form and submit
5. Open browser console (F12) to check for errors
6. Check **Network** tab to verify API calls go to production backend

---

## Step 5: Monitor and Troubleshoot

### If Google Sign-In Still Doesn't Work:

1. **Check browser console** (F12 → Console) for errors
2. **Check network requests** (F12 → Network):
   - Should see requests to your backend URL
   - NOT to localhost:5000
3. **Verify backend is running**: Visit your backend URL in browser
   - Example: https://finance-tracker-backend.onrender.com/api/v1/health
   - Should return: `{"status":"OK"}`
4. **Check Render/Railway logs** for backend errors
5. **Verify environment variables** in Vercel are set correctly

### If Contact Form Doesn't Work:

1. Check that `NEXT_PUBLIC_API_URL` points to production backend
2. Check backend logs for email service errors
3. Verify MongoDB connection from backend
4. Check email configuration in backend environment

### Common Issues:

| Problem | Solution |
|---------|----------|
| "API unreachable" | Verify backend URL in Vercel env vars |
| "Invalid redirect URI" | Update Google OAuth redirect URIs |
| "NEXTAUTH_SECRET error" | Verify NEXTAUTH_SECRET is set in Vercel |
| "MongoDB connection timeout" | Whitelist Render/Railway IPs in MongoDB Atlas |

---

## Production Checklist

- [ ] Backend deployed to Render/Railway/Heroku
- [ ] Backend URL copied and ready
- [ ] Vercel environment variables updated with backend URL
- [ ] Google OAuth redirect URIs updated
- [ ] NEXTAUTH_SECRET is generated and set
- [ ] Vercel has auto-redeployed (wait 5-10 min)
- [ ] Backend health check works (`/api/v1/health`)
- [ ] Google Sign-In works on production domain
- [ ] Contact form submission works
- [ ] MongoDB Atlas allows IPs from backend service

---

## Quick Links

- **Render**: https://render.com
- **Railway**: https://railway.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
