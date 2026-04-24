const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['food', 'transport', 'entertainment', 'utilities', 'healthcare', 'shopping', 'education', 'other'],
    required: true
  },
  limit: {
    type: Number,
    required: [true, 'Please provide a budget limit'],
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  alerts: {
    threshold: {
      type: Number,
      default: 80 // Alert at 80% of budget
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'exceeded'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Calculate percentage spent
budgetSchema.methods.getPercentageSpent = function () {
  return (this.spent / this.limit) * 100;
};

// Index for faster queries
budgetSchema.index({ userId: 1, period: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
