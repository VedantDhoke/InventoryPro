const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');

// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { search, category, stockStatus } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    const products = await Product.find(filter)
      .populate('supplier', 'name email phone')
      .sort({ createdAt: -1 });

    // Apply stock status filter after population (uses virtual)
    let result = products;
    if (stockStatus) {
      const map = {
        in_stock: 'in_stock',
        low: 'low_stock',
        low_stock: 'low_stock',
        out: 'out_of_stock',
        out_of_stock: 'out_of_stock',
      };
      const target = map[stockStatus.toLowerCase()];
      if (target) {
        result = products.filter((p) => p.stockStatus === target);
      }
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier', 'name email phone');
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, price, quantity, minStockLevel, supplier } = req.body;

    if (!name || !sku || !category || price === undefined || !supplier) {
      const error = new Error('Name, SKU, category, price, and supplier are required');
      error.statusCode = 400;
      throw error;
    }

    if (price < 0) {
      const error = new Error('Price cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    if (quantity !== undefined && quantity < 0) {
      const error = new Error('Quantity cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.create({
      name,
      sku,
      category,
      price,
      quantity: quantity ?? 0,
      minStockLevel: minStockLevel ?? 10,
      supplier,
    });

    const populated = await product.populate('supplier', 'name email phone');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const { name, sku, category, price, minStockLevel, supplier } = req.body;

    // quantity is intentionally excluded — use inventory adjust endpoint
    if (req.body.quantity !== undefined) {
      const error = new Error('Use the inventory adjustment endpoint to change stock quantity');
      error.statusCode = 400;
      throw error;
    }

    if (price !== undefined && price < 0) {
      const error = new Error('Price cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    if (minStockLevel !== undefined && minStockLevel < 0) {
      const error = new Error('Minimum stock level cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    product.name = name ?? product.name;
    product.sku = sku ?? product.sku;
    product.category = category ?? product.category;
    product.price = price ?? product.price;
    product.minStockLevel = minStockLevel ?? product.minStockLevel;
    product.supplier = supplier ?? product.supplier;

    const updated = await product.save();
    const populated = await updated.populate('supplier', 'name email phone');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete related transactions so we don't have orphaned records
    await InventoryTransaction.deleteMany({ product: req.params.id });
    await product.deleteOne();

    res.json({ message: 'Product and related transactions deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
