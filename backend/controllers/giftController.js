const Gift = require('../models/Gift');
const mongoose = require('mongoose');

// Fallback mock gift object to enable zero-config local testing if MongoDB is not running
const MOCK_GIFT = {
  _id: 'mock-gift-id',
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
  ],
  memories: [],
  wishlist: []
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

/**
 * Adds a new memory to the gift document
 * POST /api/gift/:id/memories
 */
const addMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, caption } = req.body;

    if (!url || !caption) {
      return res.status(400).json({ error: 'URL and caption are required' });
    }

    // If MongoDB connection is not open, use memory-based fallback
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB is offline. Adding memory to in-memory mock fallback.');
      const newMemory = { url, caption, _id: new mongoose.Types.ObjectId().toString() };
      MOCK_GIFT.memories.push(newMemory);
      return res.status(200).json(MOCK_GIFT);
    }

    const gift = await Gift.findById(id);
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    gift.memories.push({ url, caption });
    await gift.save();

    return res.status(200).json(gift);
  } catch (error) {
    console.error('Error adding memory:', error);
    return res.status(500).json({ error: 'Server error, please try again later' });
  }
};

/**
 * Adds a new item to the wishlist
 * POST /api/gift/:id/wishlist
 */
const addWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // In-memory fallback
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB is offline. Adding wishlist item to in-memory fallback.');
      const newItem = {
        _id: new mongoose.Types.ObjectId().toString(),
        title,
        imageUrl,
        isCompleted: false
      };
      MOCK_GIFT.wishlist.push(newItem);
      return res.status(200).json(MOCK_GIFT);
    }

    const gift = await Gift.findById(id);
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    gift.wishlist.push({ title, imageUrl });
    await gift.save();

    return res.status(200).json(gift);
  } catch (error) {
    console.error('Error adding wishlist item:', error);
    return res.status(500).json({ error: 'Server error, please try again later' });
  }
};

/**
 * Toggles a wishlist item's isCompleted status
 * PATCH /api/gift/:id/wishlist/:itemId
 */
const toggleWishlistItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { isCompleted } = req.body;

    if (isCompleted === undefined) {
      return res.status(400).json({ error: 'isCompleted is required' });
    }

    // In-memory fallback
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB is offline. Toggling wishlist item in in-memory fallback.');
      const item = MOCK_GIFT.wishlist.find(i => i._id === itemId);
      if (item) {
        item.isCompleted = isCompleted;
      }
      return res.status(200).json(MOCK_GIFT);
    }

    const gift = await Gift.findById(id);
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    const item = gift.wishlist.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    item.isCompleted = isCompleted;
    await gift.save();

    return res.status(200).json(gift);
  } catch (error) {
    console.error('Error toggling wishlist item:', error);
    return res.status(500).json({ error: 'Server error, please try again later' });
  }
};

/**
 * Deletes a wishlist item
 * DELETE /api/gift/:id/wishlist/:itemId
 */
const deleteWishlistItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    // In-memory fallback
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB is offline. Deleting wishlist item in in-memory fallback.');
      MOCK_GIFT.wishlist = MOCK_GIFT.wishlist.filter(i => i._id !== itemId);
      return res.status(200).json(MOCK_GIFT);
    }

    const gift = await Gift.findById(id);
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    const item = gift.wishlist.id(itemId);
    if (item) {
      item.deleteOne();
    } else {
      gift.wishlist.pull({ _id: itemId });
    }
    await gift.save();

    return res.status(200).json(gift);
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    return res.status(500).json({ error: 'Server error, please try again later' });
  }
};

module.exports = {
  unlockGift,
  addMemory,
  addWishlistItem,
  toggleWishlistItem,
  deleteWishlistItem
};
