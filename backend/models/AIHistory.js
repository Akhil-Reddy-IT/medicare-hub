const mongoose = require('mongoose');

const AIHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  symptoms: {
    type: String,
    trim: true
  },
  predictionResult: {
    type: mongoose.Schema.Types.Mixed // Flexible storage for JSON structure returned by Gemini
  },
  reportSummary: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIHistory', AIHistorySchema);
