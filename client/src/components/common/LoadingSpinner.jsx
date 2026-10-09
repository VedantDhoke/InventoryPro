const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-state">
    <div className="spinner" />
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
