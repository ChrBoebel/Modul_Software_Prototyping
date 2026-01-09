import { useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, Check, AlertCircle, Info } from 'lucide-react';

/**
 * UndoToast - Toast mit Undo-Action
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

  const typeConfig = {
    success: {
      icon: Check,
      bgColor: 'bg-emerald-600',
      iconBg: 'bg-emerald-700',
      progressColor: 'bg-emerald-400'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-600',
      iconBg: 'bg-red-700',
      progressColor: 'bg-red-400'
    },
    info: {
      icon: Info,
      bgColor: 'bg-swk-blue',
      iconBg: 'bg-swk-blue/80',
      progressColor: 'bg-blue-400'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-500',
      iconBg: 'bg-amber-600',
      progressColor: 'bg-amber-300'
    }
  };

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  return (
    <div
      className={`
        fixed bottom-4 right-4
        flex items-stretch
        min-w-[320px] max-w-md
        ${config.bgColor}
        text-white
        rounded-lg
        shadow-lg
        overflow-hidden
        z-50
        animate-in slide-in-from-bottom-4 fade-in duration-300
      `}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Icon */}
      <div className={`flex items-center justify-center px-3 ${config.iconBg}`}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3">
        <p className="font-medium">{message}</p>
        {isPaused && (
          <p className="text-xs opacity-75 mt-0.5">
            Pausiert - Maus entfernen zum Fortsetzen
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-2">
        {onUndo && (
          <button
            type="button"
            onClick={handleUndo}
            className="
              flex items-center gap-1.5
              px-3 py-1.5
              text-sm font-medium
              bg-white/20
              hover:bg-white/30
              rounded
              transition-colors
            "
          >
            <RotateCcw size={14} />
            Rückgängig
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="
            p-1.5
            hover:bg-white/20
            rounded
            transition-colors
          "
          aria-label="Schließen"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div
          className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
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
