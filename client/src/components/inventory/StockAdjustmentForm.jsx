import { useEffect, useState } from 'react';
import { getStockStatus } from '../../utils/formatters';

const EMPTY_FORM = { productId: '', type: 'IN', quantity: '', note: '' };

const StockAdjustmentForm = ({ products, onSubmit, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (form.productId) {
      const product = products.find((p) => p._id === form.productId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [form.productId, products]);

  const validate = () => {
    const errs = {};
    if (!form.productId) errs.productId = 'Select a product';
    if (!form.quantity || Number(form.quantity) < 1)
      errs.quantity = 'Quantity must be at least 1';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const success = await onSubmit({
      productId: form.productId,
      type: form.type,
      quantity: Number(form.quantity),
      note: form.note.trim(),
    });

    if (success) {
      setForm(EMPTY_FORM);
      setSelectedProduct(null);
    }
  };

  const stockStatus = selectedProduct
    ? getStockStatus(selectedProduct.quantity, selectedProduct.minStockLevel)
    : null;

  return (
    <div className="card">
      <div className="card-title">Stock Adjustment</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product *</label>
          <select
            className={`form-control ${errors.productId ? 'error' : ''}`}
            name="productId"
            value={form.productId}
            onChange={handleChange}
          >
            <option value="">Select product...</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
          {errors.productId && <div className="form-error">{errors.productId}</div>}
        </div>

        {selectedProduct && (
          <div className="current-stock-info">
            <div className="stock-label">Current Stock</div>
            <div className="stock-value">{selectedProduct.quantity} units</div>
            <span className={stockStatus.className} style={{ marginTop: 4, display: 'inline-block' }}>
              {stockStatus.label}
            </span>
          </div>
        )}

        <div className="form-group">
          <label>Transaction Type *</label>
          <select
            className="form-control"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="IN">Stock IN (Add)</option>
            <option value="OUT">Stock OUT (Remove)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantity *</label>
          <input
            type="number"
            className={`form-control ${errors.quantity ? 'error' : ''}`}
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="1"
            placeholder="Enter quantity"
          />
          {errors.quantity && <div className="form-error">{errors.quantity}</div>}
        </div>

        <div className="form-group">
          <label>Note (optional)</label>
          <input
            className="form-control"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="e.g. Purchase order #123"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Processing...' : `Submit ${form.type === 'IN' ? 'Stock IN' : 'Stock OUT'}`}
        </button>
      </form>
    </div>
  );
};

export default StockAdjustmentForm;
