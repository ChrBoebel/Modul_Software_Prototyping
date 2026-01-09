import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const sizeClasses = {
  sm: 'modal-sm',
  md: 'modal-md',
  lg: 'modal-lg',
  xl: 'modal-xl',
  full: 'modal-full'
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  ariaLabel,
  className = ''
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
    >
      <div className={`modal ${sizeClasses[size]} ${className}`.trim()}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            <div className="modal-title-wrapper">
              {title && <h2 className="modal-title">{title}</h2>}
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label="Schließen"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
