import { Bell, Moon, Sun, Zap } from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, activeView, onViewChange, theme, onThemeToggle, alertCount = 0, onAlertsClick }) => {
  const handleNavClick = (viewId) => {
    onViewChange(viewId);
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo">
          <div className="logo-text">
            <div className="logo-icon">
              <Zap size={20} fill="#FD951F" stroke="#FD951F" />
            </div>
            <span>EnBW Dashboard</span>
          </div>
          <button className="logo-bell-btn" onClick={onAlertsClick} aria-label="Benachrichtigungen">
            <Bell size={16} />
            {alertCount > 0 && <span className="notification-badge">{alertCount}</span>}
          </button>
        </div>

        <nav className="nav">
          <div className="nav-section">
            <a
              className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              Dashboard
            </a>
            <a
              className={`nav-link ${activeView === 'monitoring' ? 'active' : ''}`}
              onClick={() => handleNavClick('monitoring')}
            >
              Live Monitoring
            </a>
            <a
              className={`nav-link ${activeView === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavClick('analytics')}
            >
              Analytics
            </a>
          </div>

          <div className="nav-section">
            <span className="nav-label">Management</span>
            <a
              className={`nav-link ${activeView === 'facilities' ? 'active' : ''}`}
              onClick={() => handleNavClick('facilities')}
            >
              Anlagen
            </a>
            <a
              className={`nav-link ${activeView === 'customers' ? 'active' : ''}`}
              onClick={() => handleNavClick('customers')}
            >
              Kunden
            </a>
            <a
              className={`nav-link ${activeView === 'finance' ? 'active' : ''}`}
              onClick={() => handleNavClick('finance')}
            >
              Finanzen
            </a>
            <a
              className={`nav-link ${activeView === 'alerts' ? 'active' : ''}`}
              onClick={() => handleNavClick('alerts')}
            >
              Alarme
            </a>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user">
            <div className="user-avatar">MM</div>
            <div className="user-info">
              <div className="user-name">Max Müller</div>
              <div className="user-role">Admin</div>
            </div>
          </div>
          <div className="sidebar-actions">
            <button className="sidebar-icon-btn" onClick={onAlertsClick} aria-label="Benachrichtigungen">
              <Bell size={18} />
              {alertCount > 0 && <span className="notification-badge">{alertCount}</span>}
            </button>
            <button className="sidebar-icon-btn" onClick={onThemeToggle} aria-label="Theme Toggle">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </aside>

      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
    </>
  );
};
