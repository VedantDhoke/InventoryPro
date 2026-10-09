import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getTransactions, adjustInventory } from '../api/inventoryApi';
import { getProducts } from '../api/productApi';
import StockAdjustmentForm from '../components/inventory/StockAdjustmentForm';
import TransactionTable from '../components/inventory/TransactionTable';
import LoadingSpinner from '../components/common/LoadingSpinner';

const InventoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, prodRes] = await Promise.all([
        getTransactions(),
        getProducts(),
      ]);
      setTransactions(txRes.data);
      setProducts(prodRes.data);
    } catch {
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdjust = async (payload) => {
    setSubmitLoading(true);
    try {
      const { data } = await adjustInventory(payload);
      // Prepend new transaction
      setTransactions((prev) => [data.transaction, ...prev]);
      // Update product quantity in local state
      setProducts((prev) =>
        prev.map((p) => (p._id === data.product._id ? { ...p, quantity: data.product.quantity } : p))
      );
      toast.success(
        `${payload.type === 'IN' ? 'Stock added' : 'Stock removed'} successfully`
      );
      return true; // signal form to reset
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to adjust inventory');
      return false;
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Inventory</h1>
      </div>

      {error && <div className="error-state"><p>{error}</p></div>}

      <div className="inventory-layout">
        <StockAdjustmentForm
          products={products}
          onSubmit={handleAdjust}
          loading={submitLoading}
        />

        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
            Transaction History
          </h2>
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
