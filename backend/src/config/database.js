const mongoose = require('mongoose');
const winston = require('winston');

// Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb+srv://FinanceTracker:sMAcoIPzNC1VKDDK@financetracker.1miowbu.mongodb.net/financetracker?appName=FinanceTracker',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    console.error(`✗ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
