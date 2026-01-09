import { X } from 'lucide-react';

/**
 * FilterChip - Zeigt einen aktiven Filter als entfernbaren Chip
 *
 * @param {string} label - Text des Filters (z.B. "PLZ: 78462")
 * @param {function} onRemove - Callback beim Entfernen
 * @param {string} variant - Farbvariante: default, primary, success, warning
 * @param {string} className - Zusätzliche CSS-Klassen
 */
export const FilterChip = ({
  label,
  onRemove,
  variant = 'default',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    primary: 'bg-primary/10 text-primary hover:bg-primary/20',
    success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    warning: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1
        text-sm font-medium
        rounded-full
        transition-colors
        ${variantClasses[variant] || variantClasses.default}
        ${className}
      `.trim()}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="
            p-0.5
            rounded-full
            hover:bg-black/10
            focus:outline-none
            focus:ring-2
            focus:ring-offset-1
            focus:ring-slate-400
            transition-colors
          "
          aria-label={`Filter "${label}" entfernen`}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </span>
  );
};

/**
 * FilterChipGroup - Container für mehrere FilterChips mit Reset-Button
 */
export const FilterChipGroup = ({
  children,
  onClearAll,
  clearLabel = 'Alle zurücksetzen',
  className = ''
}) => {
  const hasFilters = Boolean(children && (Array.isArray(children) ? children.length > 0 : true));

  if (!hasFilters) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {children}
      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="
            text-sm
            text-slate-500
            hover:text-slate-700
            underline
            underline-offset-2
            transition-colors
          "
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
};
