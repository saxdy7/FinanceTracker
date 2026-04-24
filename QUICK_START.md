# 🚀 FinanceTracker - QUICK REFERENCE CARD

## Start Using Your Project in 2 Minutes

### Prerequisites ✓
- [ ] Node.js installed (v18+)
- [ ] MongoDB running on `localhost:27017`
- [ ] VS Code or any code editor

### Commands to Run

```bash
# MongoDB Atlas is already configured - no startup needed!

# Terminal 1 - Backend Server
cd backend
npm install
npm run dev

# Terminal 2 - Frontend Server  
cd frontend
npm install
npm run dev
```

### Access Points
- 🏠 Homepage: http://localhost:3000
- 🔐 Login: http://localhost:3000/login
- 📝 Register: http://localhost:3000/register
- 🔧 API: http://localhost:5000/api/v1
- 💚 Health Check: http://localhost:5000/api/v1/health

---

## Default Test Credentials

After registration:
```
Email: john@example.com
Password: password123
```

---

## Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | User login |
| GET | `/auth/me` | Current user info |
| GET | `/expenses` | List expenses |
| POST | `/expenses` | Create expense |
| GET | `/budgets` | List budgets |
| POST | `/budgets` | Create budget |
| GET | `/users/:id` | User profile |
| GET | `/admin/stats` | Admin dashboard |

---

## Project Location: d:\int project\
Project Name: FinanceTracker
├── backend/          → Node.js + Express + MongoDB
├── frontend/         → Next.js + React + Tailwind
├── README.md         → Full documentation
├── SETUP_GUIDE.md    → Installation help
├── ROADMAP.md        → Implementation timeline
└── PROJECT_STATUS.md → Current status
```

---

## Environment Setup

### Backend (.env) - MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@financetracker.1miowbu.mongodb.net/?appName=FinanceTracker
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-key-here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## File Structure Overview

### Backend Structure
```
backend/src/
├── config/        → Database connection
├── models/        → MongoDB schemas (User, Expense, Budget)
├── routes/        → API endpoints
├── middleware/    → Authentication & validation
├── controllers/   → (Empty, for expansion)
├── services/      → (Empty, for expansion)
└── utils/         → Helpers
```

### Frontend Structure
```
frontend/src/
├── app/           → Pages (layout, login, register, dashboard)
├── components/    → Reusable UI components
├── store/         → Zustand state management
├── utils/         → API client
└── styles/        → Global CSS
```

---

## Available NPM Scripts

### Backend
```bash
npm run dev          # Start dev server (auto-reload)
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Check code quality
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
npm run test         # Run tests
```

---

## Features Ready to Use ✅

- ✅ User authentication (Register/Login)
- ✅ JWT token management
- ✅ Role-based access control
- ✅ Expense tracking with filters
- ✅ Budget management
- ✅ Real-time Socket.IO setup
- ✅ API error handling
- ✅ Security headers
- ✅ Input validation
- ✅ Database models

---

## Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is free
# Check if MongoDB is running
mongosh
```

### Frontend won't start?
```bash
# Check if port 3000 is free
# Clear Next.js cache
npm run dev
```

### API not responding?
```bash
# Test health endpoint
curl http://localhost:5000/api/v1/health
```

---

## Database Models Created

### User
- Authentication & profile info
- Bank accounts (with verification)
- Role-based permissions

### Expense
- Amount, category, date
- Payment method tracking
- Recurring expense support
- Tags and notes

### Budget
- Category-based limits
- Spending alerts
- Period support (daily/weekly/monthly/yearly)
- Progress tracking

---

## Tech Stack Quick Reference

| Layer | Technology |
|-------|------------|
| Backend Runtime | Node.js |
| API Framework | Express.js |
| Database | MongoDB + Mongoose |
| Frontend Framework | Next.js 14 |
| UI Library | React 18 |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Authentication | JWT + RBAC |
| Real-time | Socket.IO |
| HTTP Client | Axios |

---

## Next: What to Build

1. Connect forms to API ✓
2. Implement expense list page
3. Implement budget page  
4. Add Socket.IO notifications
5. Integrate OpenAI API
6. Deploy to production

---

## Important Notes

🔐 Security:
- Change JWT_SECRET before production
- Use HTTPS in production
- Keep API keys secure

⚡ Performance:
- MongoDB indexes already set
- Pagination implemented
- Error handling in place

🧪 Testing:
- Jest ready to use
- Postman collection (recommended)
- API endpoints documented

---

## Resources

- [API Documentation](./README.md#api-endpoints)
- [Setup Instructions](./SETUP_GUIDE.md)
- [Implementation Roadmap](./ROADMAP.md)
- [Project Status](./PROJECT_STATUS.md)

---

**Everything is ready! Start coding now!** 🎉

Created: April 21, 2026
