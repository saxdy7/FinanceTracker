// Chat Routes with Groq AI Integration
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const groqService = require('../services/groqService');
const Chat = require('../models/Chat');

// ── POST /api/v1/chat ──────────────────────────────────────────────────────
// Send a message, get AI reply, append BOTH to the single user chat document
router.post('/', verifyToken, async (req, res) => {
  try {
    const { message, financialContext } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build context
    const userContext = { userId, timestamp: new Date(), financialContext: financialContext || {} };

    // Get AI advice
    const response = await groqService.getFinancialAdvice(message, userContext);
    const aiReply = response.advice || 'Unable to generate advice.';

    // Append both messages to the single user document (upsert)
    try {
      await Chat.findOneAndUpdate(
        { userId },
        {
          $push: {
            messages: {
              $each: [
                { role: 'user',      content: message,  timestamp: new Date() },
                { role: 'assistant', content: aiReply,  timestamp: new Date() }
              ]
            }
          }
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.error('Chat DB save error:', dbErr.message);
    }

    res.json({
      success: response.success,
      message,
      advice: aiReply,
      model: response.model,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/v1/chat/history ───────────────────────────────────────────────
// Return all messages for this user (newest messages at the end, i.e. chronological)
router.get('/history', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user.id });
    if (!chat) {
      return res.json({ success: true, messages: [] });
    }
    res.json({ success: true, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/v1/chat/history ────────────────────────────────────────────
// Clear all chat history for this user
router.delete('/history', verifyToken, async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { messages: [] } }
    );
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/v1/chat/insights ─────────────────────────────────────────────
router.post('/insights', verifyToken, async (req, res) => {
  try {
    const { expenses, budgets } = req.body;
    if (!expenses || !budgets) {
      return res.status(400).json({ error: 'Expenses and budgets data required' });
    }
    const insights = await groqService.generateSpendingInsights(expenses, budgets);
    res.json({ success: insights.success, insights: insights.insights, timestamp: new Date() });
  } catch (error) {
    console.error('Insights Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
