import { useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, Check, AlertCircle, Info } from 'lucide-react';
import { theme } from '../../theme/colors';

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
      bgColor: theme.colors.secondary,      // SWK Blue
      iconBg: theme.colors.secondaryDark,
      progressColor: '#5b8fd4'              // Lighter blue
    },
    error: {
      icon: AlertCircle,
      bgColor: theme.colors.primary,        // SWK Red
      iconBg: theme.colors.primaryDark,
      progressColor: '#f87171'              // Lighter red
    },
    info: {
      icon: Info,
      bgColor: theme.colors.slate700,       // Dark slate
      iconBg: theme.colors.slate800,
      progressColor: theme.colors.slate400
    },
    warning: {
      icon: AlertCircle,
      bgColor: theme.colors.slate600,       // Medium slate
      iconBg: theme.colors.slate700,
      progressColor: theme.colors.slate400
    }
  };

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'stretch',
        minWidth: '320px',
        maxWidth: '400px',
        backgroundColor: config.bgColor,
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        zIndex: 9999,
        animation: 'toastSlideIn 0.3s ease-out'
      }}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 12px',
        backgroundColor: config.iconBg
      }}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 16px' }}>
        <p style={{ fontWeight: 500, margin: 0, fontSize: '14px', color: 'white' }}>{message}</p>
        {isPaused && (
          <p style={{ fontSize: '11px', opacity: 0.85, marginTop: '4px', margin: 0, color: 'white' }}>
            Pausiert - Maus entfernen zum Fortsetzen
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
        {onUndo && (
          <button
            type="button"
            onClick={handleUndo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <RotateCcw size={14} />
            Rückgängig
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '6px',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          aria-label="Schließen"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div
          style={{
            height: '100%',
            backgroundColor: config.progressColor,
            transition: 'width 0.1s linear',
            width: `${progress}%`
          }}
        />
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
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
