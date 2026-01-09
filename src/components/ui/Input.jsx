import { forwardRef } from 'react';

export const Input = forwardRef(({
  type = 'text',
  label,
  hint,
  error,
  icon: Icon,
  className = '',
  id,
  ...rest
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div className={`input-wrapper ${Icon ? 'has-icon' : ''}`}>
        {Icon && (
          <span className="input-icon">
            <Icon size={16} aria-hidden="true" />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`form-input ${hasError ? 'error' : ''}`}
          aria-invalid={hasError}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
      </div>
      {hint && !error && (
        <span id={`${inputId}-hint`} className="form-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
