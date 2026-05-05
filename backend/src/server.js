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
app.use('/api/v1/contact', require('./routes/contactRoutes'));

// Health Check Route
app.get('/api/v1/health', async (req, res) => {
  try {
    const mongooseState = require('mongoose').connection.readyState;
    const mongoStatus = mongooseState === 1 ? 'connected' : 'disconnected';

    res.status(200).json({
      status: 'OK',
      message: 'Server is running',
      mongodb: mongoStatus,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server error',
      error: error.message
    });
  }
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('🔌 New socket connected:', socket.id);

  // Client sends its userId so we put it in a personal room
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`✅ Socket ${socket.id} joined room user:${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
  });

  // Legacy budget alert broadcast
  socket.on('budget-alert', (data) => {
    io.emit('budget-notification', data);
  });
});

// Make io accessible from routes via app.get('io')
app.set('io', io);

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
