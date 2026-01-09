export const Toggle = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  id
}) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label
      htmlFor={toggleId}
      className={`toggle-wrapper ${size === 'sm' ? 'toggle-sm' : ''} ${disabled ? 'disabled' : ''} ${className}`.trim()}
    >
      <input
        type="checkbox"
        id={toggleId}
        className="toggle-input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className="toggle" aria-hidden="true">
        <span className="toggle-slider" />
      </span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
};
