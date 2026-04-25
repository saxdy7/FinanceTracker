# Vercel Deployment Guide for FinanceTracker

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Push your code to GitHub
3. **MongoDB Atlas** - Keep your connection string ready
4. **Secrets** - Prepare all environment variables

---

## Step 1: Prepare Environment Variables

### Required Secrets for Vercel:

```
MONGODB_URI=mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@financetracker.1miowbu.mongodb.net/?appName=FinanceTracker
JWT_SECRET=your-strong-secret-key-min-32-chars
SESSION_SECRET=your-strong-session-secret
FRONTEND_URL=https://your-project.vercel.app
OPENAI_API_KEY=sk-... (optional)
EMAIL_USER=your-email@gmail.com (optional)
EMAIL_PASSWORD=your-app-password (optional)
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. **Configure Project Settings:**
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: Leave default
   - Environment Variables: Add all secrets from Step 1

5. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel --prod

# When prompted:
# - Link to existing project? (yes/no)
# - Add secrets when asked
```

---

## Step 3: Post-Deployment Configuration

### Update Frontend Environment

After deployment, get your Vercel URL and update:

1. Go to Vercel Dashboard → Your Project → Settings
2. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api/v1
   ```

3. Redeploy frontend:
   ```
   vercel --prod
   ```

### Update Backend MongoDB IP Whitelist

1. Go to MongoDB Atlas → Network Access
2. Add Vercel IP addresses:
   - `0.0.0.0/0` (for development)
   - OR add specific Vercel IPs (more secure)

---

## Step 4: Verify Deployment

### Test Endpoints

```bash
# Test backend health
curl https://your-project.vercel.app/api/v1/health

# Expected response:
# {"status":"OK","message":"Server is running"}

# Test frontend
# Visit: https://your-project.vercel.app
```

### Check Logs

```bash
# View deployment logs
vercel logs --prod

# View function logs
vercel env ls
```

---

## Step 5: Troubleshooting

### Issue: "Cannot find module"

**Solution:** Ensure all dependencies are in `package.json`:
```bash
cd backend
npm list
npm install missing-package --save
```

### Issue: "CORS error"

**Solution:** Update `FRONTEND_URL` in Vercel environment variables to your Vercel URL.

### Issue: "MongoDB connection timeout"

**Solution:** 
1. Check IP whitelist in MongoDB Atlas
2. Verify `MONGODB_URI` is correct
3. Check MongoDB server status

### Issue: "API returns 404"

**Solution:** Check that routes use correct prefix `/api/v1`

---

## Deployment Checklist

- [ ] All environment variables added to Vercel
- [ ] MongoDB IP whitelist updated
- [ ] Frontend API URL points to correct backend
- [ ] Backend FRONTEND_URL points to Vercel domain
- [ ] Git repository is up to date
- [ ] No sensitive data in `.env` files (use Vercel secrets only)
- [ ] Tested backend `/api/v1/health` endpoint
- [ ] Tested frontend loads without CORS errors
- [ ] User registration works
- [ ] Login works and stores JWT
- [ ] Dashboard loads with data

---

## Production Optimization

### Enable Vercel Analytics
```bash
npm install @vercel/analytics @vercel/web-vitals
```

### Add to `frontend/src/app/layout.js`:
```javascript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Monitoring & Maintenance

1. **Monitor Performance** - Vercel Dashboard → Analytics
2. **View Logs** - Vercel Dashboard → Deployments → Logs
3. **Setup Error Tracking** - Consider integrating Sentry
4. **Daily Backups** - Setup MongoDB backup schedules

---

## Rollback to Previous Version

```bash
vercel rollback --prod
```

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Next.js Docs: https://nextjs.org/docs
