const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema({
  passcode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  recipientName: {
    type: String,
    required: true,
    trim: true
  },
  letterText: {
    type: String,
    required: true
  },
  mediaUrls: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gift', GiftSchema);
