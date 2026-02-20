import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export const Panel = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = '400px',
  showBackdrop = true,
  showCloseButton = true,
  ariaLabel,
  className = ''
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (showBackdrop) {
      onClose();
    }
  };
  const panelStyle = width ? { width } : undefined;

  return (
    <>
      {showBackdrop && (
        <div
          className="panel-backdrop"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      <aside
        className={`panel panel-${position} ${className}`.trim()}
        style={panelStyle}
        role="complementary"
        aria-label={ariaLabel || title}
      >
        {(title || showCloseButton) && (
          <div className="panel-header">
            {title && <h2 className="panel-title">{title}</h2>}
            {showCloseButton && (
              <button
                type="button"
                className="panel-close"
                onClick={onClose}
                aria-label="Panel schließen"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div className="panel-body">
          {children}
        </div>
      </aside>
    </>
  );
};
