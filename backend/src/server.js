// FinanceTracker - Backend Server
// Express.js server with MongoDB, JWT Authentication, and Socket.IO

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  // Local development — any port
  /^http:\/\/localhost(:\d+)?$/,
  // Vercel production + all preview deployments
  /^https:\/\/.*\.vercel\.app$/,
  // Render frontend (if any)
  /^https:\/\/.*\.onrender\.com$/,
];

// Also allow the explicit FRONTEND_URL from env
const FRONTEND_URL = process.env.FRONTEND_URL || '';

const corsOptions = {
  origin: function (origin, callback) {
    // Allow no-origin requests (Postman, mobile apps)
    if (!origin) return callback(null, true);
    // Check against explicit FRONTEND_URL
    if (origin === FRONTEND_URL) return callback(null, true);
    // Check against regex patterns
    if (allowedOrigins.some(pattern => pattern.test(origin))) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
};

const io = socketIo(server, { cors: corsOptions });

// Database Connection
const connectDB = require('./config/database');
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Configuration
const isProd = process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: isProd, httpOnly: true, sameSite: isProd ? 'none' : 'lax' }
}));

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/expenses', require('./routes/expenseRoutes'));
app.use('/api/v1/budgets', require('./routes/budgetRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/chat', require('./routes/chatRoutes'));
app.use('/api/v1/email', require('./routes/emailRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
app.use('/api/v1/export', require('./routes/exportRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));

// Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('budget-alert', (data) => {
    console.log('Budget alert:', data);
    io.emit('budget-notification', data);
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = { app, server, io };
