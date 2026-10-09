/**
 * Format a number as USD currency.
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value ?? 0);
};

/**
 * Format a date string or Date object as a readable date/time.
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Derive stock status label and style class from a product.
 */
export const getStockStatus = (quantity, minStockLevel) => {
  if (quantity === 0) return { label: 'Out of Stock', className: 'badge badge--out' };
  if (quantity <= minStockLevel) return { label: 'Low Stock', className: 'badge badge--low' };
  return { label: 'In Stock', className: 'badge badge--in' };
};
