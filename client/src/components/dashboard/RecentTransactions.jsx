import { formatDate } from '../../utils/formatters';

const RecentTransactions = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Recent Transactions</div>
        <div className="empty-state">
          <p>No transactions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Recent Transactions</div>
      <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Stock Change</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.product?.name || '—'}</td>
                <td>
                  <span className={`badge badge--type-${tx.type.toLowerCase()}`}>
                    {tx.type}
                  </span>
                </td>
                <td>{tx.quantity}</td>
                <td className="text-muted">
                  {tx.previousStock} → {tx.newStock}
                </td>
                <td className="text-muted">{formatDate(tx.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
