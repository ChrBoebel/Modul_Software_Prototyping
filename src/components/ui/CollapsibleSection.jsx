import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * CollapsibleSection - Aufklappbare Sektion für Panels und Detail-Ansichten
 *
 * @param {string} title - Überschrift der Sektion
 * @param {boolean} defaultOpen - Initial geöffnet (default: true)
 * @param {ReactNode} children - Inhalt der Sektion
 * @param {ReactNode} badge - Optionales Badge neben dem Titel (z.B. Anzahl)
 * @param {string} className - Zusätzliche CSS-Klassen
 */
export const CollapsibleSection = ({
  title,
  defaultOpen = true,
  children,
  badge,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className={`border-b border-slate-200 last:border-b-0 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full
          flex items-center justify-between
          py-3 px-1
          text-left
          hover:bg-slate-50
          focus:outline-none
          focus:ring-2
          focus:ring-inset
          focus:ring-primary/50
          transition-colors
          rounded
        "
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <ChevronIcon
            size={18}
            className="text-slate-400 transition-transform"
            aria-hidden="true"
          />
          <span className="font-medium text-slate-700">{title}</span>
          {badge && (
            <span className="
              px-2 py-0.5
              text-xs font-medium
              bg-slate-100
              text-slate-600
              rounded-full
            ">
              {badge}
            </span>
          )}
        </div>
      </button>

      <div
        className={`
          overflow-hidden
          transition-all
          duration-200
          ease-in-out
          ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
        aria-hidden={!isOpen}
      >
        <div className="pb-4 px-1">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * CollapsibleCard - Aufklappbare Card-Variante mit Header
 */
export const CollapsibleCard = ({
  title,
  defaultOpen = true,
  children,
  badge,
  headerActions,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      <div
        className="
          flex items-center justify-between
          px-4 py-3
          bg-slate-50
          border-b border-slate-200
        "
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex items-center gap-2
            text-left
            hover:text-primary
            focus:outline-none
            focus:text-primary
            transition-colors
          "
          aria-expanded={isOpen}
        >
          <ChevronIcon
            size={18}
            className="text-slate-400"
            aria-hidden="true"
          />
          <span className="font-semibold text-slate-800">{title}</span>
          {badge && (
            <span className="
              px-2 py-0.5
              text-xs font-medium
              bg-primary/10
              text-primary
              rounded-full
            ">
              {badge}
            </span>
          )}
        </button>

        {headerActions && (
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        )}
      </div>

      <div
        className={`
          overflow-hidden
          transition-all
          duration-200
          ease-in-out
          ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
        aria-hidden={!isOpen}
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
