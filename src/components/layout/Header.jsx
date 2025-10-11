import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useState } from 'react';

export const Header = ({ onMenuClick, onSearch, theme, onThemeToggle, alertCount = 0, onAlertsClick }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length >= 2) {
      onSearch(`Suche: "${value}"`);
    }
  };

  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Menu">
        <Menu size={20} />
      </button>
      <h1>Dashboard</h1>
      <div className="header-actions">
        <input
          type="text"
          className="search"
          placeholder="Suchen..."
          value={searchValue}
          onChange={handleSearch}
        />
        <button className="icon-btn notification-btn" onClick={onAlertsClick} aria-label="Benachrichtigungen">
          <Bell size={18} />
          {alertCount > 0 && <span className="notification-badge">{alertCount}</span>}
        </button>
        <button className="icon-btn" onClick={onThemeToggle} aria-label="Theme Toggle">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
