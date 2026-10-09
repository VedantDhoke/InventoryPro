const InventoryTransaction = require('../models/InventoryTransaction');
const { adjustStock } = require('../services/inventoryService');

// @route   GET /api/inventory/transactions
const getTransactions = async (req, res, next) => {
  try {
    const { productId, type } = req.query;
    const filter = {};

    if (productId) filter.product = productId;
    if (type) filter.type = type.toUpperCase();

    const transactions = await InventoryTransaction.find(filter)
      .populate('product', 'name sku')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/inventory/adjust
const adjustInventory = async (req, res, next) => {
  try {
    const { productId, type, quantity, note } = req.body;

    if (!productId || !type || !quantity) {
      const error = new Error('Product, type, and quantity are required');
      error.statusCode = 400;
      throw error;
    }

    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 1) {
      const error = new Error('Quantity must be a positive integer');
      error.statusCode = 400;
      throw error;
    }

    const result = await adjustStock({
      productId,
      type: type.toUpperCase(),
      quantity: parsedQty,
      note,
      userId: req.user._id,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTransactions, adjustInventory };
