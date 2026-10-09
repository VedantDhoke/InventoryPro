import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/supplierApi';
import SupplierForm from '../components/suppliers/SupplierForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data } = await getSuppliers();
      setSuppliers(data);
    } catch {
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const openCreate = () => {
    setEditSupplier(null);
    setShowForm(true);
  };

  const openEdit = (supplier) => {
    setEditSupplier(supplier);
    setShowForm(true);
  };

  const handleFormSubmit = async (payload) => {
    setFormLoading(true);
    try {
      if (editSupplier) {
        const { data } = await updateSupplier(editSupplier._id, payload);
        setSuppliers((prev) => prev.map((s) => (s._id === data._id ? data : s)));
        toast.success('Supplier updated');
      } else {
        const { data } = await createSupplier(payload);
        setSuppliers((prev) => [data, ...prev]);
        toast.success('Supplier created');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save supplier');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteSupplier(deleteTarget._id);
      setSuppliers((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success('Supplier deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete supplier');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  if (loading && suppliers.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Suppliers</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Supplier</button>
      </div>

      {error && <div className="error-state"><p>{error}</p></div>}

      {suppliers.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No suppliers yet. Add your first supplier to get started.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td style={{ fontWeight: 500 }}>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td className="text-muted">{supplier.address || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(supplier)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(supplier)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Supplier Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <SupplierForm
                supplier={editSupplier}
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
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be done if products reference this supplier.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default SuppliersPage;
