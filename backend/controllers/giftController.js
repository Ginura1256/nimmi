const Gift = require('../models/Gift');
const mongoose = require('mongoose');

// Fallback mock gift object to enable zero-config local testing if MongoDB is not running
const MOCK_GIFT = {
  passcode: '0411',
  recipientName: 'Nimnadhi Manamperi',
  letterText: "Distance isn't easy, but loving you makes it worth every smile. I miss the little things—your voice, your laughter, just being near you—but I hold onto us and everything we're building together. No matter how far apart we are, you're still my safe place, my favorite person, and the one I choose every day. Just a little longer, okay? I'm always yours. ❤️",
  mediaUrls: [
    '/assets/memory1.jpg',
    '/assets/memory2.jpg',
    '/assets/memory3.jpg',
    '/assets/memory4.jpg',
    '/assets/memory5.jpg',
    '/assets/memory6.jpg',
    '/assets/memory7.jpg',
    '/assets/memory8.jpg',
    '/assets/memory9.jpg'
  ]
};

/**
 * Verifies passcode and returns the associated gift document
 * POST /api/gift/unlock
 */
const unlockGift = async (req, res) => {
  try {
    const { passcode } = req.body;

    if (!passcode) {
      return res.status(400).json({ error: 'Passcode is required' });
    }

    // If MongoDB connection is not open, use memory-based fallback validation
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB is offline. Using in-memory fallback for local demonstration.');
      if (passcode === MOCK_GIFT.passcode) {
        return res.status(200).json(MOCK_GIFT);
      } else {
        return res.status(401).json({ error: 'Incorrect passcode' });
      }
    }

    // Search MongoDB for matching passcode
    const gift = await Gift.findOne({ passcode });

    if (!gift) {
      return res.status(401).json({ error: 'Incorrect passcode' });
    }

    return res.status(200).json(gift);
  } catch (error) {
    console.error('Error unlocking gift:', error);
    
    // In case of Mongo timeout or socket errors, check passcode and fallback
    if (req.body.passcode === MOCK_GIFT.passcode) {
      console.log('⚠️ MongoDB error encountered. Servicing request using in-memory fallback.');
      return res.status(200).json(MOCK_GIFT);
    }
    
    return res.status(500).json({ error: 'Server error, please try again later' });
  }
};

module.exports = {
  unlockGift
};
