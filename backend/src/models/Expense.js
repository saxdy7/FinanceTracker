const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide expense description'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
    min: 0
  },
  category: {
    type: String,
    enum: ['food', 'transport', 'entertainment', 'utilities', 'healthcare', 'shopping', 'education', 'other'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit-card', 'debit-card', 'bank-transfer', 'digital-wallet'],
    default: 'cash'
  },
  bankAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  bankAccountName: {
    type: String,
    default: null
  },
  tags: [String],
  notes: String,
  receipt: String,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    default: null,
    validate: {
      validator: function (v) {
        // Allow null/undefined OR one of the valid frequency strings
        if (v == null) return true;
        return ['daily', 'weekly', 'monthly', 'yearly'].includes(v);
      },
      message: props => `'${props.value}' is not a valid recurringFrequency`
    }
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

// Index for faster queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
