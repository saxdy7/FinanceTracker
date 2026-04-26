// Groq AI Service for Financial Advice Chat
const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.model = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
  }

  async getFinancialAdvice(userMessage, userContext = {}) {
    try {
      const systemPrompt = `You are an expert financial advisor for a personal finance tracking application.
      Provide concise, actionable financial advice based on user spending patterns and questions.
      Keep responses to 2-3 sentences max. Be friendly, encouraging, and practical.
      Focus on saving tips, budget optimization, and spending habits.
      Current user context: ${JSON.stringify(userContext)}`;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        advice: response.data.choices[0].message.content,
        model: this.model
      };
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);
      return {
        success: false,
        advice: 'Sorry, I couldn\'t generate advice right now. Please try again later.',
        error: error.message
      };
    }
  }

  async generateSpendingInsights(expenses, budgets) {
    try {
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const budgetStatus = budgets.map(b => ({
        category: b.category,
        limit: b.limit,
        spent: expenses
          .filter(e => e.category === b.category)
          .reduce((sum, e) => sum + e.amount, 0)
      }));

      const prompt = `Based on this spending data, provide 2-3 specific money-saving recommendations:
      Total Spent: $${totalSpent}
      Budget Status: ${JSON.stringify(budgetStatus)}
      Keep it motivating and actionable.`;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        insights: response.data.choices[0].message.content
      };
    } catch (error) {
      console.error('Groq Insights Error:', error.message);
      return {
        success: false,
        insights: 'Unable to generate insights at this time.'
      };
    }
  }
}

module.exports = new GroqService();
