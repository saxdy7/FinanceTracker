const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// One chat session per user — messages are appended over time
const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true   // ← one document per user
  },
  messages: [messageSchema]
}, { timestamps: true });

chatSchema.index({ userId: 1 });

module.exports = mongoose.model('Chat', chatSchema);
