export const ToggleGroup = ({
  options,
  value,
  onChange,
  ariaLabel = 'Optionen',
  className = ''
}) => {
  return (
    <div
      className={`toggle-group ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className={`toggle-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
          >
            {option.label}
            {typeof option.count === 'number' && (
              <span className="toggle-count">{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
