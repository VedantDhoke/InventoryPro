import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi';
import { getSuppliers } from '../api/supplierApi';
import ProductForm from '../components/products/ProductForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, getStockStatus } from '../utils/formatters';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (stockStatus) params.stockStatus = stockStatus;
      const { data } = await getProducts(params);
      setProducts(data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, category, stockStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getSuppliers()
      .then(({ data }) => setSuppliers(data))
      .catch(() => {});
  }, []);

  // Unique categories derived from current products (unfiltered not needed, just for filter helper)
  const categories = [...new Set(products.map((p) => p.category))].sort();

  const openCreate = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (payload) => {
    setFormLoading(true);
    try {
      if (editProduct) {
        const { data } = await updateProduct(editProduct._id, payload);
        setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
        toast.success('Product updated');
      } else {
        const { data } = await createProduct(payload);
        setProducts((prev) => [data, ...prev]);
        toast.success('Product created');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  if (loading && products.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      <div className="filters-bar">
        <input
          className="form-control search-input"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
        >
          <option value="">All Stock Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        {(search || category || stockStatus) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setCategory(''); setStockStatus(''); }}>
            Clear
          </button>
        )}
      </div>

      {error && <div className="error-state"><p>{error}</p></div>}

      {products.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No products found. Add your first product to get started.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Min Level</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getStockStatus(product.quantity, product.minStockLevel);
                return (
                  <tr key={product._id}>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td className="text-muted">{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.quantity}</td>
                    <td>{product.minStockLevel}</td>
                    <td>{product.supplier?.name || '—'}</td>
                    <td><span className={status.className}>{status.label}</span></td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteTarget(product)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <ProductForm
                product={editProduct}
                suppliers={suppliers}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also delete all related inventory transactions.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ProductsPage;
