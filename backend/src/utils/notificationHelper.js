/**
 * Notification Helper
 * Call createNotification() from any route to auto-save a notification to MongoDB.
 * The io (Socket.IO) instance is passed in so we can also push real-time events.
 */
const Notification = require('../models/Notification');

/**
 * @param {object} params
 * @param {string}  params.userId   - MongoDB user _id
 * @param {string}  params.title    - Short title
 * @param {string}  params.message  - Detailed message
 * @param {string}  params.type     - 'success' | 'info' | 'warning' | 'error'
 * @param {string}  params.category - 'transaction' | 'budget' | 'account' | 'payment' | 'security' | 'expense' | 'report'
 * @param {object}  [params.data]   - Optional extra data (amount, etc.)
 * @param {object}  [io]            - Socket.IO server instance for real-time push
 */
const createNotification = async ({ userId, title, message, type = 'info', category = 'account', data = {} }, io = null) => {
  try {
    const notification = await Notification.create({ userId, title, message, type, category, data });

    // Push real-time event to the user's own socket room if io is available
    if (io) {
      io.to(`user:${userId}`).emit('notification', {
        _id: notification._id,
        title,
        message,
        type,
        category,
        data,
        read: false,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (err) {
    // Never let notification failure crash the main request
    console.error('⚠️ Failed to create notification:', err.message);
    return null;
  }
};

module.exports = { createNotification };
