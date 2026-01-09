import { forwardRef } from 'react';

export const TextArea = forwardRef(({
  label,
  hint,
  error,
  rows = 3,
  className = '',
  id,
  ...rest
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`form-input form-textarea ${hasError ? 'error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        {...rest}
      />
      {hint && !error && (
        <span id={`${textareaId}-hint`} className="form-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${textareaId}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';
