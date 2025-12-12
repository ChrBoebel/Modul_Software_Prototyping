import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const MainLayout = ({ children, activeView, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleViewChange = (viewId) => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
    onViewChange(viewId);
  };

  return (
    <div className="main-layout">
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Navigation öffnen"
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="mobile-logo">
          <img src="/stadtwerke-logo.svg" alt="Stadtwerke Konstanz" />
        </div>
      </header>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activeView={activeView}
        onViewChange={handleViewChange}
      />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
