# FinanceTracker - Complete Navigation Map

## 🔗 All Page Links & Connections

### **Public Pages (No Authentication Required)**

#### Landing Page → `/`
**Links:**
- Sign In → `/login`
- Get Started → `/register`
- Features scroll
- Testimonials scroll

#### Login Page → `/login`
**Links:**
- Forgot Password → `/forgot-password`
- Sign Up → `/register`
- Google Sign In
- Left side brand links to landing

#### Register Page → `/register`
**Links:**
- Sign In → `/login`
- Already have account? → `/login`
- Google Sign Up

#### Forgot Password → `/forgot-password`
**Links:**
- Back to Login → `/login`
- Don't have account? → `/register`
- Next: Reset Password page shows token

#### Reset Password → `/reset-password`
**Links:**
- Remember password? → `/login`
- Don't have account? → `/register`

#### Verify Email → `/verify-email?email=user@example.com`
**Links:**
- Already verified? → `/login`
- Contact support → `/contact` (future)

---

### **Authenticated Pages (JWT Required)**

All authenticated pages have:
- **Sidebar Navigation** (left)
- **Top Bar** (right with Bell/Settings/Avatar)
- **Logout Button** (bottom of sidebar)

#### Dashboard → `/dashboard`
**Sidebar Menu Items:**
1. Dashboard (current) → `/dashboard`
2. Transactions → `/transactions`
3. Expenses → `/expenses`
4. Budgets → `/budgets`
5. Analytics → `/analytics`
6. Reports → `/reports`
7. Notifications → `/notifications`

**Top Bar Links:**
- Search bar
- Bell icon → `/notifications`
- Settings icon → `/settings`
- User avatar (profile info)

**Bottom Sidebar:**
- Settings → `/settings`
- Logout → `/login` (clears token)

#### Transactions → `/transactions`
**Same sidebar + top bar as Dashboard**
- Full CRUD operations for transactions
- Export to CSV
- Filter by category
- Search functionality

#### Expenses → `/expenses`
**Same sidebar + top bar as Dashboard**
- Pie chart visualization
- Category breakdown
- Add/Edit/Delete expenses
- Category statistics

#### Budgets → `/budgets`
**Same sidebar + top bar as Dashboard**
- Create budgets by category
- Track vs actual spending
- Budget alerts
- Budget history

#### Analytics → `/analytics`
**Same sidebar + top bar as Dashboard**
- Monthly spending chart
- Category distribution
- 30-day trend analysis
- Summary statistics

#### Reports → `/reports`
**Same sidebar + top bar as Dashboard**
- Monthly/Yearly/Custom reports
- Budget performance
- Category breakdown
- Export to CSV/PDF

#### Settings → `/settings`
**Same sidebar + top bar as Dashboard**
**Tabs:**
1. **Profile**
   - Update firstName/lastName
   - View email (read-only)
   - Update profile picture

2. **Security**
   - Change password
   - View login history
   - Two-factor authentication (future)

3. **Preferences**
   - Email notifications (on/off)
   - Push notifications (on/off)
   - Theme (light/dark/auto)
   - Currency (USD/EUR/GBP/INR/JPY)

#### Notifications → `/notifications`
**Same sidebar + top bar as Dashboard**
- Filter by type (All/Success/Warning/Error/Info)
- Search notifications
- Mark as read/unread
- Archive/Delete
- Real-time notification list

---

## 📊 Complete Link Structure

```
/ (Landing)
├── /login
│   ├── /forgot-password
│   │   └── /reset-password
│   └── /verify-email
├── /register
│   └── /login
│
└── /dashboard (Authenticated)
    ├── /transactions
    ├── /expenses
    ├── /budgets
    ├── /analytics
    ├── /reports
    ├── /settings
    └── /notifications
```

---

## 🔐 Authentication Flow

1. **New User**: `/` → `/register` → verify email → `/login` → `/dashboard`
2. **Existing User**: `/` → `/login` → `/dashboard`
3. **Forgot Password**: `/login` → `/forgot-password` → `/reset-password` → `/login`
4. **Logout**: Any page → (click Logout) → `/login` (token cleared)

---

## 🎯 API Endpoints Connected

### Auth
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/logout` - Logout

### Expenses
- `GET /api/v1/expenses` - List all expenses
- `POST /api/v1/expenses` - Create expense
- `PUT /api/v1/expenses/:id` - Update expense
- `DELETE /api/v1/expenses/:id` - Delete expense

### Budgets
- `GET /api/v1/budgets` - List all budgets
- `POST /api/v1/budgets` - Create budget
- `PUT /api/v1/budgets/:id` - Update budget
- `DELETE /api/v1/budgets/:id` - Delete budget

### Users
- `PUT /api/v1/users/profile` - Update profile
- `PUT /api/v1/users/password` - Change password
- `PUT /api/v1/users/preferences` - Update preferences

---

## ✅ Navigation Checklist

- [x] Landing page links to login/register
- [x] Login links to forgot-password and register
- [x] Register links back to login
- [x] Forgot password links to reset password
- [x] Reset password links back to login
- [x] Verify email links to login
- [x] All dashboard pages have full sidebar menu
- [x] All dashboard pages have top bar with Bell/Settings
- [x] Sidebar Settings links to /settings
- [x] Sidebar Logout clears token and goes to /login
- [x] Top Bar Bell icon links to /notifications
- [x] Top Bar Settings icon links to /settings
- [x] All pages check for authentication token
- [x] All pages have consistent styling

---

## 🚀 Quick Navigation Links Reference

**From Dashboard:**
- Transactions: Click menu or Bell icon
- Expenses: Click menu
- Budgets: Click menu
- Analytics: Click menu
- Reports: Click menu
- Notifications: Click Bell icon in top bar
- Settings: Click Settings icon in top bar or menu

**From Any Page:**
- Logout: Click Logout button
- Go Home: Click logo (links to /dashboard)
- Profile: Click avatar (planned)

---

## 📱 Mobile Navigation (Responsive)

- Sidebar becomes hamburger menu on mobile
- All links remain accessible
- Top bar adjusts for small screens
- Full touch-friendly interaction

---

Last Updated: April 21, 2026
