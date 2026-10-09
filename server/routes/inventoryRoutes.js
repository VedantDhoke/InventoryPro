const express = require('express');
const router = express.Router();
const { getTransactions, adjustInventory } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/transactions', protect, getTransactions);
router.post('/adjust', protect, adjustInventory);

module.exports = router;
