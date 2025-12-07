import { useState } from 'react';
import { Menu, Zap } from 'lucide-react';
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
      <div className="mobile-header" style={{ display: 'none' }}> {/* Hidden for desktop focus, can be enabled via CSS if needed */}
        <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Menu">
          <Menu size={20} />
        </button>
        <div className="mobile-logo">
          <div className="logo-icon">
            <Zap size={20} fill="#e2001a" stroke="#e2001a" />
          </div>
        </div>
      </div>
      
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
