import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  name: '',
  sku: '',
  category: '',
  price: '',
  quantity: '',
  minStockLevel: '10',
  supplier: '',
};

const ProductForm = ({ product, suppliers, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(product);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        price: product.price ?? '',
        quantity: product.quantity ?? '',
        minStockLevel: product.minStockLevel ?? '10',
        supplier: product.supplier?._id || product.supplier || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [product]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (form.price === '' || form.price === null) errs.price = 'Price is required';
    else if (Number(form.price) < 0) errs.price = 'Price cannot be negative';
    if (!isEdit) {
      if (form.quantity === '' || form.quantity === null) errs.quantity = 'Quantity is required';
      else if (Number(form.quantity) < 0) errs.quantity = 'Quantity cannot be negative';
    }
    if (Number(form.minStockLevel) < 0) errs.minStockLevel = 'Min stock level cannot be negative';
    if (!form.supplier) errs.supplier = 'Supplier is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      minStockLevel: Number(form.minStockLevel),
      supplier: form.supplier,
    };

    // Only include quantity on creation
    if (!isEdit) {
      payload.quantity = Number(form.quantity);
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Product Name *</label>
          <input
            className={`form-control ${errors.name ? 'error' : ''}`}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Mouse"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label>SKU *</label>
          <input
            className={`form-control ${errors.sku ? 'error' : ''}`}
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="e.g. WM-001"
          />
          {errors.sku && <div className="form-error">{errors.sku}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category *</label>
          <input
            className={`form-control ${errors.category ? 'error' : ''}`}
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Electronics"
          />
          {errors.category && <div className="form-error">{errors.category}</div>}
        </div>

        <div className="form-group">
          <label>Supplier *</label>
          <select
            className={`form-control ${errors.supplier ? 'error' : ''}`}
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
          >
            <option value="">Select supplier...</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          {errors.supplier && <div className="form-error">{errors.supplier}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price ($) *</label>
          <input
            type="number"
            className={`form-control ${errors.price ? 'error' : ''}`}
            name="price"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          {errors.price && <div className="form-error">{errors.price}</div>}
        </div>

        {!isEdit && (
          <div className="form-group">
            <label>Initial Quantity</label>
            <input
              type="number"
              className={`form-control ${errors.quantity ? 'error' : ''}`}
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
            {errors.quantity && <div className="form-error">{errors.quantity}</div>}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Minimum Stock Level</label>
        <input
          type="number"
          className={`form-control ${errors.minStockLevel ? 'error' : ''}`}
          name="minStockLevel"
          value={form.minStockLevel}
          onChange={handleChange}
          min="0"
          placeholder="10"
        />
        {errors.minStockLevel && <div className="form-error">{errors.minStockLevel}</div>}
      </div>

      {isEdit && (
        <p className="text-muted" style={{ fontSize: '12px', marginBottom: '12px' }}>
          To change stock quantity, use the Inventory page.
        </p>
      )}

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
