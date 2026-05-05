# 💰 FinanceTracker

A full-stack personal finance management web application built for India — track expenses, set budgets, and get AI-powered financial insights in ₹.

🔗 **Live Demo:** https://finance-tracker-xi-three-76.vercel.app

---

## 🌟 Key Features

- 🔐 Email/Password + Google OAuth 2.0 login
- 💸 Add, edit, delete expenses with categories
- 📊 Budget creation with spending progress tracking
- 📈 Analytics & charts for spending patterns
- 🤖 AI Financial Advisor powered by Groq (Llama 3.1)
- 🔔 Real-time notifications via Socket.IO
- 🏦 Link Bank Accounts, UPI IDs, and Cards
- 📤 Export transactions as CSV
- 📧 Email verification & forgot password flow
- 📱 Fully responsive — works on mobile & desktop

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router)
- NextAuth.js (Google OAuth + credentials)
- Framer Motion, Recharts, Lucide React
- Axios, Socket.IO Client, Tailwind CSS

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT, bcryptjs, Socket.IO
- Groq AI SDK, Nodemailer, Helmet

**Hosting**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📁 Project Structure

```
int-project/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.js               # Landing page
│       │   ├── login/                # Login page
│       │   ├── register/             # Register page
│       │   ├── dashboard/            # Main dashboard
│       │   ├── transactions/         # Transactions CRUD
│       │   ├── expenses/             # Expense tracker
│       │   ├── budgets/              # Budget manager
│       │   ├── analytics/            # Charts & analytics
│       │   ├── notifications/        # Notification center
│       │   ├── bank-accounts/        # Bank/UPI linking
│       │   ├── chat/                 # AI advisor
│       │   └── settings/             # Profile settings
│       ├── components/
│       │   ├── DashboardLayout.js    # Shared layout + sidebar
│       │   ├── ModernSidebar.js      # Navigation sidebar
│       │   └── SessionSync.js        # Auth session sync
│       └── utils/
│           └── api.js                # Shared Axios instance (JWT auto-inject)
│
├── backend/
│   └── src/
│       ├── server.js                 # Express + Socket.IO entry
│       ├── models/
│       │   ├── User.js               # User + bank accounts
│       │   ├── Expense.js            # Expense model
│       │   ├── Budget.js             # Budget model
│       │   └── Notification.js       # Notifications (auto-delete 30d)
│       ├── routes/
│       │   ├── authRoutes.js         # Register, Login, Google, Reset
│       │   ├── userRoutes.js         # Profile, Bank Accounts
│       │   ├── expenseRoutes.js      # Expense CRUD
│       │   ├── budgetRoutes.js       # Budget CRUD
│       │   ├── notificationRoutes.js # Notifications
│       │   ├── analyticsRoutes.js    # Spending analytics
│       │   └── chatRoutes.js         # AI advisor
│       ├── middleware/
│       │   └── authMiddleware.js     # JWT verification
│       └── utils/
│           └── notificationHelper.js # Auto-notification creator
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Console project (for OAuth)
- Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd "int project"
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Backend — create `backend/.env`
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/financetracker
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
GROQ_API_KEY=gsk_your-groq-key
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret
```

### 4. Configure Frontend — create `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### 5. Run the app
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:3000**

---

## 👨‍💻 Author

**Sandeep Mamidala** — mamidalasandeep5@gmail.com
