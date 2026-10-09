import { formatDate } from '../../utils/formatters';

const TransactionTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Prev Stock</th>
            <th>New Stock</th>
            <th>Note</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td>{tx.product?.name || '—'}</td>
              <td className="text-muted">{tx.product?.sku || '—'}</td>
              <td>
                <span className={`badge badge--type-${tx.type.toLowerCase()}`}>
                  {tx.type}
                </span>
              </td>
              <td>{tx.quantity}</td>
              <td className="text-muted">{tx.previousStock}</td>
              <td>{tx.newStock}</td>
              <td className="text-muted">{tx.note || '—'}</td>
              <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>
                {formatDate(tx.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
