// Notification Routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// GET /api/v1/notifications - Get all notifications for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { unread = false } = req.query;

    let query = { userId };
    if (unread === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.json({
      success: true,
      notifications: notifications,
      unreadCount: unreadCount
    });
  } catch (error) {
    console.error('Notifications Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/notifications - Create notification
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, message, type, category, data } = req.body;
    const userId = req.user.id;

    const notification = new Notification({
      userId,
      title,
      message,
      type,
      category,
      data
    });

    await notification.save();

    res.status(201).json({
      success: true,
      notification: notification
    });
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/v1/notifications/:id - Mark as read
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      notification: notification
    });
  } catch (error) {
    console.error('Update Notification Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/v1/notifications/:id - Delete notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/v1/notifications - Mark all as read
router.patch('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark All Read Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/v1/notifications - Delete all notifications
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.deleteMany({ userId });

    res.json({
      success: true,
      message: 'All notifications deleted'
    });
  } catch (error) {
    console.error('Delete All Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/notifications/count - Get unread count
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.json({
      success: true,
      unreadCount: unreadCount
    });
  } catch (error) {
    console.error('Count Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
