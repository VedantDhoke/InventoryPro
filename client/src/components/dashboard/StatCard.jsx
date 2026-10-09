const StatCard = ({ label, value, accent }) => (
  <div className={`stat-card accent-${accent}`}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

export default StatCard;
