const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');

// @route   GET /api/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const products = await Product.find();

    const totalProducts = products.length;

    const totalInventoryValue = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    const lowStockProducts = products.filter(
      (p) => p.quantity > 0 && p.quantity <= p.minStockLevel
    );

    const outOfStockProducts = products.filter((p) => p.quantity === 0);

    const recentTransactions = await InventoryTransaction.find()
      .populate('product', 'name sku')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalProducts,
      totalInventoryValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
