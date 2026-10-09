const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// @route   GET /api/suppliers
const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/suppliers/:id
const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/suppliers
const createSupplier = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone) {
      const error = new Error('Name, email, and phone are required');
      error.statusCode = 400;
      throw error;
    }

    const supplier = await Supplier.create({ name, email, phone, address });
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/suppliers/:id
const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.statusCode = 404;
      throw error;
    }

    const { name, email, phone, address } = req.body;
    supplier.name = name ?? supplier.name;
    supplier.email = email ?? supplier.email;
    supplier.phone = phone ?? supplier.phone;
    supplier.address = address ?? supplier.address;

    const updated = await supplier.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/suppliers/:id
const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if any products reference this supplier
    const productCount = await Product.countDocuments({ supplier: req.params.id });
    if (productCount > 0) {
      const error = new Error(
        `Cannot delete supplier. ${productCount} product(s) still reference this supplier.`
      );
      error.statusCode = 409;
      throw error;
    }

    await supplier.deleteOne();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };
