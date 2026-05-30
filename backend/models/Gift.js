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
  },
  memories: {
    type: [{
      url: { type: String, required: true },
      caption: { type: String, required: true }
    }],
    default: []
  },
  wishlist: {
    type: [{
      title: { type: String, required: true },
      imageUrl: { type: String, required: true },
      isCompleted: { type: Boolean, default: false }
    }],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gift', GiftSchema);
