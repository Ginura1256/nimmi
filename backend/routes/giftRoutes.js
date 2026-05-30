const express = require('express');
const router = express.Router();
const { unlockGift, addMemory, addWishlistItem, toggleWishlistItem, deleteWishlistItem } = require('../controllers/giftController');

// Define unlock route: POST /api/gift/unlock
router.post('/unlock', unlockGift);

// Define add memory route: POST /api/gift/:id/memories
router.post('/:id/memories', addMemory);

// Wishlist routes
router.post('/:id/wishlist', addWishlistItem);
router.patch('/:id/wishlist/:itemId', toggleWishlistItem);
router.delete('/:id/wishlist/:itemId', deleteWishlistItem);

module.exports = router;
