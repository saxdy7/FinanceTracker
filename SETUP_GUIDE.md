# Setup Guide - FinanceTracker

## Prerequisites
Make sure you have installed:
- **Node.js** (v18+): https://nodejs.org/
- **MongoDB** (v5+): https://www.mongodb.com/try/download/community
- **Git**: https://git-scm.com/
- **VS Code**: https://code.visualstudio.com/

## Step 1: MongoDB Atlas Connection

Your project is configured to use **MongoDB Atlas** (Cloud Database).

### Connection Details
- **Database**: financetracker (MongoDB Atlas)
- **Username**: FinanceTracker
- **Connection String**: mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@financetracker.1miowbu.mongodb.net/?appName=FinanceTracker

### ✅ No Local Installation Required
The MongoDB connection is already configured in your `.env` file. You don't need to install MongoDB locally - the cloud connection is ready to use!

## Step 2: Backend Setup

### Clone and Navigate
```bash
cd backend
```

### Install Dependencies
```bash
npm install
```

### Environment Configuration
All environment variables are already configured in the `.env` file for MongoDB Atlas connection. If needed, update values:

```bash
# The MongoDB connection is already set:
MONGODB_URI=mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@financetracker.1miowbu.mongodb.net/?appName=FinanceTracker

# Update other values as needed:
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
```

### Start Backend Server
```bash
npm run dev
```

You should see:
```
✓ MongoDB Connected: financetracker.1miowbu.mongodb.net
Server running on http://localhost:5000
```

## Step 3: Frontend Setup

### Navigate to Frontend
```bash
cd frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
# Copy the example file
cp .env.local.example .env.local

# Default values are already set for local development
```

### Start Frontend Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Step 4: Verify Setup

### Test Backend API
Open a terminal or Postman and test:
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Test Frontend
Open browser and go to: `http://localhost:3000`

You should see the landing page with Login and Register buttons.

## Common Issues & Solutions

### Issue: Backend Connection Error
**Solution:**
```bash
# Verify internet connection (MongoDB Atlas requires internet)
# Check MongoDB Atlas credentials in .env file are correct
# Ensure firewall allows connection to MongoDB Atlas

# Test connection:
npm run dev
```

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env to another port (e.g., 5001)
```

### Issue: Dependencies Installation Error
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: MONGODB_URI Connection Failed
**Solution:**
Ensure MongoDB Atlas connection string is correct in `.env`:
```
MONGODB_URI=mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@financetracker.1miowbu.mongodb.net/?appName=FinanceTracker
```
Check:
- Username and password are correct
- Internet connection is active
- Whitelist your IP in MongoDB Atlas Dashboard

## Testing the Application

### User Registration
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in the form with:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123

### User Login
1. Go to http://localhost:3000/login
2. Use the credentials from registration

### View Dashboard
After login, you'll be redirected to the dashboard.

## NPM Scripts Reference

### Backend
```bash
npm run start        # Start production server
npm run dev          # Start dev server with nodemon
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
```

## Database Management (MongoDB Atlas)

To view and manage your database:
1. Open MongoDB Atlas: https://cloud.mongodb.com/
2. Login with your account
3. Navigate to the `financetracker` cluster
4. Click "Collections" to see your data
5. Or use MongoDB Compass (GUI):
   - Download: https://www.mongodb.com/products/tools/compass
   - Connection string: `mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@financetracker.1miowbu.mongodb.net/`

## Next Steps

1. **Add Bank Account**: Create user account and add bank details
2. **Create Expenses**: Start logging your expenses
3. **Set Budgets**: Create budgets for different categories
4. **Admin Portal**: Access admin features for user verification
5. **API Integration**: Connect real bank APIs

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [JWT Authentication](https://jwt.io/)

## Need Help?

- Check the README.md in the project root
- Review the API endpoints in README.md
- Check error logs in the terminal
- Verify all prerequisites are installed

Happy coding! 🚀
