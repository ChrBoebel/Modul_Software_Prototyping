import { useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, Check, AlertCircle, Info } from 'lucide-react';

/**
 * UndoToast - Toast mit Undo-Action (SWK Brand Design)
 *
 * @param {string} message - Nachricht (z.B. "Regel gelöscht")
 * @param {function} onUndo - Callback für Undo-Aktion
 * @param {function} onClose - Callback wenn Toast geschlossen wird
 * @param {number} duration - Dauer in ms (default: 8000)
 * @param {string} type - success, error, info, warning
 */
export const UndoToast = ({
  message,
  onUndo,
  onClose,
  duration = 8000,
  type = 'success'
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const remainingTime = (progress / 100) * duration;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.max(0, ((remainingTime - elapsed) / duration) * 100);
      setProgress(newProgress);

      if (newProgress <= 0) {
        clearInterval(timer);
        onClose?.();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isPaused, duration, onClose, progress]);

  const handleUndo = () => {
    onUndo?.();
    onClose?.();
  };

  // SWK Brand Colors
  const typeConfig = {
    success: {
      icon: Check,
      bgColor: 'var(--secondary)',
      iconBg: 'var(--swk-blue-dark)',
      progressColor: 'var(--toast-progress-secondary)'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'var(--primary)',
      iconBg: 'var(--primary-hover)',
      progressColor: 'var(--toast-progress-primary)'
    },
    info: {
      icon: Info,
      bgColor: 'var(--slate-700)',
      iconBg: 'var(--slate-800)',
      progressColor: 'var(--slate-400)'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'var(--slate-600)',
      iconBg: 'var(--slate-700)',
      progressColor: 'var(--slate-400)'
    }
  };

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;
  const toastVars = {
    '--undo-toast-bg': config.bgColor,
    '--undo-toast-icon-bg': config.iconBg,
    '--undo-toast-progress': config.progressColor,
    '--undo-toast-width': `${progress}%`
  };

  return (
    <div
      className="undo-toast"
      style={toastVars}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Icon */}
      <div className="undo-toast-icon">
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="undo-toast-content">
        <p className="undo-toast-message">{message}</p>
        {isPaused && (
          <p className="undo-toast-hint">
            Pausiert - Maus entfernen zum Fortsetzen
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="undo-toast-actions">
        {onUndo && (
          <button
            type="button"
            onClick={handleUndo}
            className="undo-toast-btn undo-toast-btn-undo"
          >
            <RotateCcw size={14} />
            Rückgängig
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="undo-toast-btn undo-toast-btn-close"
          aria-label="Schließen"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="undo-toast-progress-track">
        <div className="undo-toast-progress-bar" />
      </div>
    </div>
  );
};

/**
 * useUndoToast - Hook für einfache Verwendung des UndoToasts
 *
 * @returns {Object} { showUndoToast, UndoToastComponent }
 *
 * Usage:
 * const { showUndoToast, UndoToastComponent } = useUndoToast();
 *
 * const handleDelete = (item) => {
 *   deleteItem(item.id);
 *   showUndoToast({
 *     message: `"${item.name}" gelöscht`,
 *     onUndo: () => restoreItem(item)
 *   });
 * };
 *
 * return (
 *   <>
 *     {content}
 *     <UndoToastComponent />
 *   </>
 * );
 */
export const useUndoToast = () => {
  const [toast, setToast] = useState(null);

  const showUndoToast = useCallback(({ message, onUndo, type = 'success', duration = 8000 }) => {
    setToast({ message, onUndo, type, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const UndoToastComponent = useCallback(() => {
    if (!toast) return null;

    return (
      <UndoToast
        message={toast.message}
        onUndo={toast.onUndo}
        onClose={hideToast}
        type={toast.type}
        duration={toast.duration}
      />
    );
  }, [toast, hideToast]);

  return { showUndoToast, hideToast, UndoToastComponent };
};
