import { forwardRef } from 'react';

export const Select = forwardRef(({
  options = [],
  label,
  hint,
  error,
  placeholder = 'Bitte auswählen...',
  className = '',
  id,
  ...rest
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`form-input form-select ${hasError ? 'error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <span id={`${selectId}-hint`} className="form-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${selectId}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
