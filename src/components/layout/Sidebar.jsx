import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  MapPin,
  Settings,
  ChevronDown,
  ChevronRight,
  Palette,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';

// Navigation Items
const NAV_ITEMS = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    description: 'Übersicht & KPIs'
  },
  {
    id: 'marketing-flows',
    icon: GitBranch,
    label: 'Marketing-Flows',
    description: 'Flow-Editor & Cards'
  },
  {
    id: 'leads',
    icon: Users,
    label: 'Leads',
    description: 'Lead-Verwaltung'
  },
  {
    id: 'produkt-mapping',
    icon: MapPin,
    label: 'Produkt-Mapping',
    description: 'Verfügbarkeit & Logik'
  },
  {
    id: 'einstellung',
    icon: Settings,
    label: 'Einstellung',
    description: 'Integration & Sync'
  },
  {
    id: 'component-library',
    icon: Palette,
    label: 'Component Library',
    description: 'UI Komponenten'
  }
];

export const Sidebar = ({ isOpen, onClose, activeView, onViewChange }) => {
  const [tenantOpen, setTenantOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed);
    // Update CSS variable for main content margin
    document.documentElement.style.setProperty(
      '--sidebar-current-width',
      collapsed ? '72px' : '280px'
    );
  }, [collapsed]);

  const handleNavClick = (viewId) => {
    onViewChange(viewId);
  };

  const isNavActive = (navId) => activeView === navId;

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setTenantOpen(false); // Close tenant dropdown when collapsing
    }
  };

  return (
    <>
      <aside
        id="app-sidebar"
        className={`sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}
        aria-label="Hauptnavigation"
      >
        {/* Tenant Switcher */}
        <div className="tenant-switcher">
          {collapsed ? (
            <div className="tenant-button-collapsed" title="Stadtwerke Konstanz">
              <img src="/stadtwerke-logo.svg" alt="Stadtwerke Konstanz" className="h-6 w-6 object-contain" />
            </div>
          ) : (
            <>
              <button
                type="button"
                className="tenant-button"
                onClick={() => setTenantOpen(!tenantOpen)}
                aria-expanded={tenantOpen}
                aria-haspopup="listbox"
              >
                <img src="/stadtwerke-logo.svg" alt="Stadtwerke Konstanz" className="h-6 w-auto" />
                <ChevronDown size={16} className={`tenant-chevron ${tenantOpen ? 'open' : ''}`} />
              </button>
              {tenantOpen && (
                <div className="tenant-dropdown" role="listbox">
                  <div className="tenant-option active" role="option" aria-selected="true">Stadtwerke Konstanz (Hauptmandant)</div>
                  <div className="tenant-option" role="option">Bädergesellschaft</div>
                  <div className="tenant-option" role="option">Bodensee-Schiffsbetriebe</div>
                </div>
              )}
            </>
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
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={20} />
                    {!collapsed && (
                      <>
                        <div className="nav-item-content">
                          <span className="nav-item-label">{item.label}</span>
                          <span className="nav-item-desc">{item.description}</span>
                        </div>
                        {isActive && <ChevronRight size={14} className="nav-chevron" />}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile" title={collapsed ? 'Max Mustermann - Vertrieb' : undefined}>
            <Avatar name="Max Mustermann" size={collapsed ? 'sm' : 'md'} usePlaceholder />
            {!collapsed && (
              <div className="user-info">
                <div className="user-name">Max Mustermann</div>
                <div className="user-role">Vertrieb</div>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={toggleCollapse}
            title={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
            aria-label={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            {!collapsed && <span>Einklappen</span>}
          </button>
        </div>
      </aside>

      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={onClose} aria-hidden="true"></div>
    </>
  );
};
