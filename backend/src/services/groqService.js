// Groq AI Service for Financial Advice Chat
const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

class GroqService {
  constructor() {
    // Reading these dynamically during requests is safer if dotenv loads late
  }

  async getFinancialAdvice(userMessage, userContext = {}) {
    try {
      const fc = userContext.financialContext || {};

      const contextBlock = Object.keys(fc).length > 0
        ? `\nUser's LIVE Financial Data (Indian Rupees ₹):
- Monthly Spending: ₹${fc.monthlySpent || 0}
- Total Transactions: ${fc.totalTransactions || 0}
- All-time Total Spent: ₹${fc.totalSpentAllTime || 0}
- Top Spending Category: ${fc.topCategory || 'N/A'}
- Category Breakdown: ${JSON.stringify(fc.categoryBreakdown || {})}
- Budget Status: ${JSON.stringify(fc.budgetStatus || [])}
- Recent Transactions: ${JSON.stringify(fc.recentTransactions || [])}
Use this real data to give personalised, specific advice. Always use ₹ (Indian Rupees) for amounts.`
        : '';

      const systemPrompt = `You are an expert AI financial advisor for an Indian personal finance app.
Give concise, practical, and friendly financial advice in 2-4 sentences.
Always use ₹ (Indian Rupees) for currency amounts. Never use $ (dollars).
Reference the user's actual data when available.
Focus on saving tips, budget optimization, and Indian financial instruments (FDs, SIPs, RDs, UPI etc).${contextBlock}`;

      const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
      const apiKey = process.env.GROQ_API_KEY;
      
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: model,
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
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        advice: response.data.choices[0].message.content,
        model: model
      };
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('Groq API Error:', errorMsg);
      return {
        success: false,
        advice: `Sorry, I couldn't generate advice right now. Error: ${errorMsg}`,
        error: errorMsg
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

      const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
      const apiKey = process.env.GROQ_API_KEY;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: model,
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
            'Authorization': `Bearer ${apiKey}`,
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
