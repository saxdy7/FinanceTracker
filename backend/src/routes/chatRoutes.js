// Chat Routes with Groq AI Integration
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const groqService = require('../services/groqService');

// POST /api/v1/chat - Send message to Groq AI
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user context for personalized advice
    const userContext = {
      userId: userId,
      timestamp: new Date()
    };

    // Get financial advice from Groq
    const response = await groqService.getFinancialAdvice(message, userContext);

    res.json({
      success: response.success,
      message: message,
      advice: response.advice,
      model: response.model,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/chat/insights - Generate spending insights
router.post('/insights', authMiddleware, async (req, res) => {
  try {
    const { expenses, budgets } = req.body;

    if (!expenses || !budgets) {
      return res.status(400).json({ error: 'Expenses and budgets data required' });
    }

    const insights = await groqService.generateSpendingInsights(expenses, budgets);

    res.json({
      success: insights.success,
      insights: insights.insights,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Insights Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/chat/models - Get available AI models
router.get('/models', authMiddleware, (req, res) => {
  res.json({
    success: true,
    models: [
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        description: 'Fast, accurate financial advice',
        active: true
      },
      {
        id: 'llama2-70b-4096',
        name: 'Llama 2 70B',
        description: 'Advanced reasoning model',
        active: false
      }
    ]
  });
});

module.exports = router;
