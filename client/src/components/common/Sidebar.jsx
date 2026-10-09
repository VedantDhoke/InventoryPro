import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/',          label: 'Dashboard', icon: '▦' },
  { to: '/products',  label: 'Products',  icon: '📦' },
  { to: '/suppliers', label: 'Suppliers', icon: '🏭' },
  { to: '/inventory', label: 'Inventory', icon: '🔄' },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Inventory<span>Pro</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ padding: '8px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>
          {user?.name}
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <span>↩</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
