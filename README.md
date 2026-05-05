# 💰 FinanceTracker

A full-stack personal finance management web application built for India — track expenses, set budgets, and get AI-powered financial insights in ₹.

🔗 **Live Demo:** https://finance-tracker-xi-three-76.vercel.app

---

## 📸 Screenshots

| Landing Page | Main Dashboard | AI Advisor |
|---|---|---|
| <img src="https://finance-tracker-xi-three-76.vercel.app" width="250" alt="Landing Page"/> | <img src="https://finance-tracker-xi-three-76.vercel.app/dashboard" width="250" alt="Dashboard"/> | <img src="https://finance-tracker-xi-three-76.vercel.app/chat" width="250" alt="AI Chat"/> |

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

## 🏗️ How It Works (Architecture)
1. **Frontend:** User interacts with the Next.js UI (React 18 + Tailwind).
2. **Auth:** NextAuth handles Google login, syncing securely with the backend JWT system via `SessionSync`.
3. **Database:** Express.js securely reads/writes to MongoDB Atlas using Mongoose ODM.
4. **AI:** Spending data is formatted into a prompt and sent to the **Groq API (Llama 3.1)** to generate personalized financial advice.
5. **Real-time:** Socket.IO instantly pushes budget limit warnings and transaction alerts directly to the user's screen without page reloads.

---

## 🧠 Challenges Overcome
- **OAuth Syncing:** Solved race conditions between NextAuth's internal session and our custom Express backend JWT token system.
- **Real-Time Delivery:** Implemented user-specific Socket.IO rooms (`user:{userId}`) so that budget alerts are only broadcasted to the correct user.
- **Cross-Origin Security:** Properly managed CORS headers and preflight checks between Vercel (Frontend) and Render (Backend).

---

## 🔌 Core API Routes
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/auth/google` | OAuth Account Synchronization |
| `GET` | `/api/v1/expenses` | Fetch paginated & filtered expenses |
| `POST` | `/api/v1/budgets` | Create budget & trigger Socket.IO alert |
| `POST` | `/api/v1/chat` | Send transaction history to Groq AI LLM |

---

## 🚀 Future Roadmap
- [ ] Implement Plaid API for automatic bank statement syncing
- [ ] Add recurring expenses (subscriptions) detection
- [ ] Add dark/light mode toggle for the dashboard side

---

## 👨‍💻 Author

**Sandeep Mamidala** — mamidalasandeep5@gmail.com
