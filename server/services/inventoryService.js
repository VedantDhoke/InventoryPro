const mongoose = require('mongoose');
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');

/**
 * Adjust stock for a product atomically.
 * Uses a MongoDB session to ensure the product update and transaction creation
 * either both succeed or both fail.
 */
const adjustStock = async ({ productId, type, quantity, note, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findById(productId).session(session);

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (!['IN', 'OUT'].includes(type)) {
      const error = new Error('Transaction type must be IN or OUT');
      error.statusCode = 400;
      throw error;
    }

    if (!quantity || quantity < 1) {
      const error = new Error('Quantity must be at least 1');
      error.statusCode = 400;
      throw error;
    }

    const previousStock = product.quantity;
    let newStock;

    if (type === 'IN') {
      newStock = previousStock + quantity;
    } else {
      if (quantity > previousStock) {
        const error = new Error(
          `Insufficient stock. Only ${previousStock} unit(s) available.`
        );
        error.statusCode = 400;
        throw error;
      }
      newStock = previousStock - quantity;
    }

    // Update product quantity
    product.quantity = newStock;
    await product.save({ session });

    // Create transaction record
    const [transaction] = await InventoryTransaction.create(
      [
        {
          product: productId,
          type,
          quantity,
          previousStock,
          newStock,
          note: note || '',
          performedBy: userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    await transaction.populate('product', 'name sku');
    await transaction.populate('performedBy', 'name email');

    return { product, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = { adjustStock };
