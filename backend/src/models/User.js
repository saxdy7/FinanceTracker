const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'advisor'],
    default: 'user'
  },
  bankAccounts: [{
    accountType: {
      type: String,
      enum: ['bank', 'upi', 'credit-card', 'debit-card'],
      default: 'bank'
    },
    bankName: String,
    accountNumber: String,        // last 4 digits for bank/card, full UPI ID for UPI
    accountHolder: String,
    ifscCode: String,             // for bank accounts
    upiId: String,                // for UPI (e.g., name@upi)
    cardNetwork: String,          // Visa, Mastercard, RuPay
    verified: {
      type: Boolean,
      default: true               // auto-verified; no admin approval needed
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  googleId: {
    type: String,
    sparse: true,   // allows null + unique to coexist
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  phone: String,
  profilePicture: String,
  preferences: {
    currency: {
      type: String,
      default: 'USD'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
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

// Hash Password Before Saving — ONLY when password field is actually changed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Don't re-hash if it already looks like a bcrypt hash
  if (this.password && this.password.startsWith('$2')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
