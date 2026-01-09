import { Search, X } from 'lucide-react';

export const SearchBox = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Suchen...',
  icon: Icon = Search,
  clearable = true,
  className = '',
  id
}) => {
  const searchId = id || `search-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`search-box ${className}`.trim()}>
      <Icon size={16} className="search-icon" aria-hidden="true" />
      <input
        id={searchId}
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {clearable && value && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Suche löschen"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
