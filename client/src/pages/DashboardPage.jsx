import { useEffect, useState } from 'react';
import { getDashboard } from '../api/dashboardApi';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data: res } = await getDashboard();
      setData(res);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-state"><p>{error}</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Products" value={data.totalProducts} accent="primary" />
        <StatCard label="Inventory Value" value={formatCurrency(data.totalInventoryValue)} accent="success" />
        <StatCard label="Low Stock" value={data.lowStockCount} accent="warning" />
        <StatCard label="Out of Stock" value={data.outOfStockCount} accent="danger" />
      </div>

      <div className="dashboard-grid">
        <RecentTransactions transactions={data.recentTransactions} />

        <div className="card">
          <div className="card-title">Low Stock Alerts</div>
          {data.lowStockProducts.length === 0 && data.outOfStockProducts.length === 0 ? (
            <div className="empty-state">
              <p>All products are well stocked 🎉</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.outOfStockProducts, ...data.lowStockProducts].map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.quantity}</td>
                      <td>
                        {p.quantity === 0 ? (
                          <span className="badge badge--out">Out of Stock</span>
                        ) : (
                          <span className="badge badge--low">Low Stock</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
