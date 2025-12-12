import { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Navigation Items
const NAV_ITEMS = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    description: 'Übersicht & KPIs'
  },
  {
    id: 'lm-flows',
    icon: GitBranch,
    label: 'LM-Flows',
    description: 'Flow-Editor & Cards'
  },
  {
    id: 'leads',
    icon: Users,
    label: 'Leads',
    description: 'Lead-Verwaltung'
  },
  {
    id: 'einstellung',
    icon: Settings,
    label: 'Einstellung',
    description: 'Integration & Sync'
  }
];

export const Sidebar = ({ isOpen, onClose, activeView, onViewChange }) => {
  const [tenantOpen, setTenantOpen] = useState(false);

  const handleNavClick = (viewId) => {
    onViewChange(viewId);
  };

  const isNavActive = (navId) => activeView === navId;

  return (
    <>
      <aside
        id="app-sidebar"
        className={`sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Hauptnavigation"
      >
        {/* Tenant Switcher */}
        <div className="tenant-switcher">
          <button
            type="button"
            className="tenant-button"
            onClick={() => setTenantOpen(!tenantOpen)}
            aria-expanded={tenantOpen}
            aria-haspopup="listbox"
          >
            <img src="/stadtwerke-logo.svg" alt="Stadtwerke Konstanz" style={{ height: '24px', width: 'auto' }} />
            <span className="tenant-name">Stadtwerke Konstanz</span>
            <ChevronDown size={16} className={`tenant-chevron ${tenantOpen ? 'open' : ''}`} />
          </button>
          {tenantOpen && (
            <div className="tenant-dropdown" role="listbox">
              <div className="tenant-option active" role="option" aria-selected="true">Stadtwerke Konstanz (Hauptmandant)</div>
              <div className="tenant-option" role="option">Bädergesellschaft</div>
              <div className="tenant-option" role="option">Bodensee-Schiffsbetriebe</div>
            </div>
          )}
        </div>

        <nav className="nav-container">
          {/* Main Navigation */}
          <div className="nav-section">
            <div className="nav-section-items">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    className={`nav-item-new ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={20} />
                    <div className="nav-item-content">
                      <span className="nav-item-label">{item.label}</span>
                      <span className="nav-item-desc">{item.description}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="nav-chevron" />}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">MM</div>
            <div className="user-info">
              <div className="user-name">Max Mustermann</div>
              <div className="user-role">Vertrieb</div>
            </div>
          </div>
        </div>
      </aside>

      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={onClose} aria-hidden="true"></div>
    </>
  );
};
