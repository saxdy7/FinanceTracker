// Notification Model
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['warning', 'success', 'error', 'info'],
      default: 'info'
    },
    category: {
      type: String,
      enum: ['budget', 'transaction', 'expense', 'report', 'account', 'payment', 'security'],
      default: 'account'
    },
    read: {
      type: Boolean,
      default: false
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Auto-delete notifications older than 30 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('Notification', NotificationSchema);
