import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const MainLayout = ({ children, activeView, onViewChange, theme, onThemeToggle, alertCount, onAlertsClick }) => {
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
    <>
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Menu">
          <Menu size={20} />
        </button>
      </div>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activeView={activeView}
        onViewChange={handleViewChange}
        theme={theme}
        onThemeToggle={onThemeToggle}
        alertCount={alertCount}
        onAlertsClick={onAlertsClick}
      />
      <main className="main">
        <div className="content">
          {children}
        </div>
      </main>
    </>
  );
};
