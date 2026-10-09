import { useEffect, useState } from 'react';

const EMPTY_FORM = { name: '', email: '', phone: '', address: '' };

const SupplierForm = ({ supplier, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(supplier ? { ...EMPTY_FORM, ...supplier } : EMPTY_FORM);
    setErrors({});
  }, [supplier]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
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
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name *</label>
        <input
          className={`form-control ${errors.name ? 'error' : ''}`}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Tech Suppliers Ltd"
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'error' : ''}`}
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="contact@supplier.com"
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            className={`form-control ${errors.phone ? 'error' : ''}`}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 555 000 0000"
          />
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          className="form-control"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="123 Main St, City, Country"
        />
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : supplier ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
