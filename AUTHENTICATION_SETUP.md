# FinanceTracker - Authentication & MongoDB Setup Guide

## Overview
Complete user registration and login system with MongoDB and JWT authentication.

## System Architecture

### Frontend Flow
```
User Registration Page
    ↓
Form Data (firstName, lastName, email, password)
    ↓
API Call: POST /api/v1/auth/register
    ↓
Backend Validation & MongoDB Save
    ↓
JWT Token Generated
    ↓
Token + User Data Stored in localStorage
    ↓
Redirect to Dashboard
```

### Frontend Login Flow
```
User Login Page
    ↓
Form Data (email, password)
    ↓
API Call: POST /api/v1/auth/login
    ↓
Backend Validation & Password Match
    ↓
JWT Token Generated
    ↓
Token + User Data Stored in localStorage
    ↓
Redirect to Dashboard
```

## MongoDB Collections

### Users Collection
```json
{
  "_id": ObjectId,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "hashed_password_bcrypt",
  "role": "user",
  "isVerified": false,
  "preferences": {
    "currency": "USD",
    "theme": "light",
    "notifications": true
  },
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

**Indexes:**
- `email` (unique)
- `createdAt` (for sorting)

## Backend Implementation

### Key Files
1. **src/models/User.js** - Mongoose User schema with bcrypt hashing
2. **src/routes/authRoutes.js** - Registration & Login endpoints
3. **src/middleware/authMiddleware.js** - JWT verification
4. **src/config/database.js** - MongoDB connection

### Registration Endpoint
- **URL:** `POST /api/v1/auth/register`
- **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

### Login Endpoint
- **URL:** `POST /api/v1/auth/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same format as registration

## Frontend Implementation

### Files Updated
1. **src/app/register/page.js** - Registration form with MongoDB connection
2. **src/app/login/page.js** - Login form with JWT storage
3. **src/app/dashboard/page.js** - Protected route with user data display
4. **src/utils/api.js** - Axios interceptor for token attachment
5. **src/utils/auth.js** - Auth utility functions

### Token Storage
```javascript
// After successful registration/login
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### API Interceptor
All requests automatically include the token:
```javascript
Authorization: Bearer <token>
```

## MongoDB Auto-Collection Creation

**Important:** Collections are automatically created on first document insert:
1. First user registration triggers `users` collection creation
2. Mongoose schema validation happens automatically
3. Indexes are created as defined in the schema

**No manual collection creation needed!**

## Testing the Flow

### Step 1: Start Backend
```bash
cd backend
npm run dev
# Should output: ✓ MongoDB Connected: <host>
```

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
# Should output: ▲ Next.js ready at http://localhost:3000
```

### Step 3: Register New User
1. Navigate to http://localhost:3000/register
2. Fill in: First Name, Last Name, Email, Password
3. Click "Sign Up"
4. Check MongoDB Atlas > Collections > users (new collection created)

### Step 4: Verify in MongoDB Atlas
1. Log in to MongoDB Atlas
2. Go to: FinanceTracker > Cluster > Browse Collections
3. Verify `users` collection exists
4. Expand users collection to see registered user document

### Step 5: Login
1. Navigate to http://localhost:3000/login
2. Enter email and password
3. Dashboard loads with user's name displayed (initials in avatar)

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Security Features

✅ **Password Hashing:** bcryptjs with salt rounds 10
✅ **JWT Authentication:** Tokens expire in 7 days
✅ **Input Validation:** express-validator on backend
✅ **CORS Protection:** Configured for frontend origin only
✅ **Email Uniqueness:** Enforced at database level
✅ **Role-Based Access:** user/admin/advisor roles supported

## Common Issues & Solutions

### Issue: "User already exists"
- Solution: Use different email or delete user from MongoDB

### Issue: "MongoDB Connected" not appearing
- Solution: Check MONGODB_URI in .env is correct
- Verify MongoDB Atlas IP whitelist includes your IP

### Issue: Token not persisting after refresh
- Solution: LocalStorage clears on page reload - this is expected
- In production, implement refresh token mechanism

### Issue: Cors error
- Solution: Ensure FRONTEND_URL in backend .env matches your frontend URL

## Next Steps

1. **Email Verification:** Implement email verification on registration
2. **Refresh Tokens:** Add refresh token mechanism for extended sessions
3. **OAuth Integration:** Add Google/Apple login
4. **Profile Update:** Endpoint to update user profile
5. **Password Reset:** Forgot password functionality
6. **Two-Factor Authentication:** SMS/Email 2FA

## Database Connection Details

- **Service:** MongoDB Atlas
- **Cluster:** FinanceTracker
- **Organization:** Your Account
- **Database:** FinanceTracker (auto-created)
- **URL:** mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@financetracker.1miowbu.mongodb.net/?appName=FinanceTracker

---

**Last Updated:** April 21, 2026
**Status:** ✅ Complete - Ready for Testing
