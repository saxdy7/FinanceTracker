# 🗺️ FinanceTracker - Quick Navigation Reference

## 🎯 Starting Points

### For New Users
```
localhost:3000 (Landing)
    ↓ Click "Get Started"
/register (Create Account)
    ↓ Submit form
/verify-email (Email Verification)
    ↓ Enter verification code
/login (Sign In)
    ↓ Enter credentials
/dashboard (Main App)
```

### For Existing Users
```
localhost:3000 (Landing)
    ↓ Click "Sign In"
/login (Sign In)
    ↓ Enter credentials
/dashboard (Main App)
```

### Forgot Password
```
/login
    ↓ Click "Forgot password?"
/forgot-password (Enter Email)
    ↓ Submit email
/reset-password (Enter Token & New Password)
    ↓ Submit
/login (Login with new password)
```

---

## 📍 Main Dashboard Hub

All authenticated pages accessible from **sidebar menu**:

```
┌─────────────────────────────────────┐
│         SIDEBAR (Left)              │
├─────────────────────────────────────┤
│  FinanceTracker                     │
│  ┌────────────────────────────────┐ │
│  │ 📊 Dashboard       [ACTIVE]    │ │
│  │ 📄 Transactions                │ │
│  │ 💰 Expenses                    │ │
│  │ 💳 Budgets                     │ │
│  │ 📈 Analytics                   │ │
│  │ 📋 Reports                     │ │
│  │ 🔔 Notifications               │ │
│  └────────────────────────────────┘ │
│  ─────────────────────────────────  │
│  ⚙️  Settings                       │
│  🚪 Logout                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         TOP BAR (Right)             │
├─────────────────────────────────────┤
│  🔍 Search  | 🔔 | ⚙️ | 👤 Avatar  │
└─────────────────────────────────────┘
```

---

## 🔗 One-Click Navigation From Dashboard

| Click | Goes To | Purpose |
|-------|---------|---------|
| 📊 Dashboard | `/dashboard` | View financial overview |
| 📄 Transactions | `/transactions` | Manage all transactions |
| 💰 Expenses | `/expenses` | View expense analytics |
| 💳 Budgets | `/budgets` | Track budgets |
| 📈 Analytics | `/analytics` | View trends & patterns |
| 📋 Reports | `/reports` | Generate financial reports |
| 🔔 Notifications | `/notifications` | View all notifications |
| ⚙️ Settings | `/settings` | Update preferences |
| 🚪 Logout | `/login` | Sign out (clears token) |

---

## 🔝 Top Bar Quick Actions

**From Any Authenticated Page:**

```
🔍 Search Bar
   └─→ Quick search across page

🔔 Bell Icon
   └─→ Go to /notifications
   └─→ See all notifications
   └─→ Filter & manage alerts

⚙️ Settings Icon
   └─→ Go to /settings
   └─→ Update profile
   └─→ Change password
   └─→ Set preferences

👤 Avatar
   └─→ Shows "JD" (John Doe)
   └─→ Click to see user name
```

---

## 📊 Each Page's Primary Links

### Dashboard `/dashboard`
**Primary CTA:** View all transactions
**Links to:** Transactions, Expenses, Budgets, Analytics, Reports

### Transactions `/transactions`
**Primary CTA:** Add transaction
**Links to:** Export CSV, Filter by category, Search

### Expenses `/expenses`
**Primary CTA:** Add expense
**Links to:** View charts, Delete expense, Category stats

### Budgets `/budgets`
**Primary CTA:** Create budget
**Links to:** Track spending, Delete budget, Edit limits

### Analytics `/analytics`
**Primary CTA:** Filter data
**Links to:** View trends, See categories, Monthly stats

### Reports `/reports`
**Primary CTA:** Generate report
**Links to:** Export CSV/PDF, Select date range, View details

### Settings `/settings`
**Primary CTA:** Update settings
**Tabs:**
1. Profile → Update name/photo
2. Security → Change password
3. Preferences → Theme/Currency/Notifications

### Notifications `/notifications`
**Primary CTA:** Manage notifications
**Links to:**
- Filter by type
- Mark as read
- Delete/Archive
- Search

---

## 🔐 Authentication Required Pages

✅ All require valid JWT token in localStorage

If token missing → Redirects to `/login`

```javascript
// Every protected page checks:
const token = localStorage.getItem('token');
if (!token) {
  router.push('/login');
}
```

---

## 🚀 Typical User Journey

### Daily Workflow
```
/dashboard (Check balance & recent transactions)
    ↓
/expenses (View spending)
    ↓
/budgets (Check budget status)
    ↓
/analytics (See trends)
    ↓
/notifications (Check alerts)
    ↓
/settings (If needed, update preferences)
    ↓
Click Logout (Done for the day)
```

### Monthly Workflow
```
/reports (Generate monthly report)
    ↓
/expenses (Analyze expenses)
    ↓
/budgets (Review budget performance)
    ↓
/settings (Adjust preferences if needed)
```

### First-Time Setup
```
/settings → Profile tab (Complete profile)
    ↓
/settings → Preferences tab (Set currency/theme)
    ↓
/settings → Security tab (Update password)
    ↓
/dashboard (Start using app)
```

---

## 🎯 Quick Links Reference

### Public Routes (No Login Needed)
- `/` - Landing page
- `/login` - Sign in
- `/register` - Sign up
- `/forgot-password` - Password reset
- `/reset-password` - Enter new password
- `/verify-email` - Email verification

### Protected Routes (Login Required)
- `/dashboard` - Main dashboard
- `/transactions` - Transaction list
- `/expenses` - Expense analytics
- `/budgets` - Budget tracking
- `/analytics` - Financial analytics
- `/reports` - Generate reports
- `/settings` - Settings & preferences
- `/notifications` - Notifications

---

## ✨ Pro Tips

**Fastest Navigation:**
1. Use sidebar menu for main pages
2. Use Bell icon for notifications
3. Use Settings icon for preferences
4. Use search bar for quick lookup

**Mobile Navigation:**
- Tap menu icon to open sidebar
- All links remain accessible
- Touch-friendly sizing

**Keyboard Shortcuts (Future):**
- `G` → Go to Dashboard
- `N` → Go to Notifications
- `S` → Go to Settings
- `L` → Logout

---

## 📞 Support Links

**Need Help?**
- Contact: (future implementation)
- FAQ: (future implementation)
- Settings → Help (future implementation)

---

## ✅ Navigation Checklist

- [x] All pages have complete sidebar
- [x] All pages have top bar with Bell & Settings
- [x] All pages have proper logo link
- [x] Logout clears localStorage
- [x] Notifications link works from all pages
- [x] Settings link works from all pages
- [x] Active page highlighted in sidebar
- [x] Authentication checks on all protected pages
- [x] Proper redirects to login if needed
- [x] Mobile responsive navigation

---

**Status: ✅ COMPLETE**
**All pages properly connected and tested**
**Ready for production** 🚀

---

Last Updated: April 21, 2026
