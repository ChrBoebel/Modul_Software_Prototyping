import { forwardRef, useEffect, useRef } from 'react';

export const Checkbox = forwardRef(({
  checked = false,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  className = '',
  id,
  ...rest
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const internalRef = useRef(null);
  const checkboxRef = ref || internalRef;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, checkboxRef]);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label
      htmlFor={checkboxId}
      className={`checkbox-wrapper ${disabled ? 'disabled' : ''} ${className}`.trim()}
    >
      <input
        ref={checkboxRef}
        type="checkbox"
        id={checkboxId}
        className="checkbox-input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...rest}
      />
      <span className="checkbox-box" aria-hidden="true" />
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
