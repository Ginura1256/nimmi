const express = require('express');
const router = express.Router();
const { unlockGift } = require('../controllers/giftController');

// Define unlock route: POST /api/gift/unlock
router.post('/unlock', unlockGift);

module.exports = router;
