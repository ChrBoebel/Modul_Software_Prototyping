import { useState, useRef, useEffect } from 'react';

/**
 * Tooltip - Einfache Tooltip-Komponente für Icons und Buttons
 *
 * @param {ReactNode} children - Das Element, das den Tooltip auslöst
 * @param {string} content - Tooltip-Text
 * @param {string} position - Position: top, bottom, left, right (default: top)
 * @param {number} delay - Verzögerung in ms bevor Tooltip erscheint (default: 200)
 * @param {string} className - Zusätzliche CSS-Klassen für den Wrapper
 */
export const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Adjust position if tooltip would go off-screen
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current.getBoundingClientRect();
      const trigger = triggerRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let newPosition = position;

      // Check if tooltip goes off-screen and adjust
      if (position === 'top' && trigger.top - tooltip.height < 10) {
        newPosition = 'bottom';
      } else if (position === 'bottom' && trigger.bottom + tooltip.height > viewport.height - 10) {
        newPosition = 'top';
      } else if (position === 'left' && trigger.left - tooltip.width < 10) {
        newPosition = 'right';
      } else if (position === 'right' && trigger.right + tooltip.width > viewport.width - 10) {
        newPosition = 'left';
      }

      if (newPosition !== actualPosition) {
        setActualPosition(newPosition);
      }
    }
  }, [isVisible, position, actualPosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent'
  };

  if (!content) {
    return children;
  }

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute z-50
            ${positionClasses[actualPosition]}
            pointer-events-none
          `}
        >
          <div className="
            px-2.5 py-1.5
            text-xs font-medium
            text-white
            bg-slate-800
            rounded-md
            shadow-lg
            whitespace-nowrap
            animate-in fade-in duration-150
          ">
            {content}
          </div>
          {/* Arrow */}
          <div
            className={`
              absolute
              border-4
              ${arrowClasses[actualPosition]}
            `}
          />
        </div>
      )}
    </div>
  );
};

/**
 * TooltipButton - Button mit integriertem Tooltip (für Icon-Buttons)
 */
export const TooltipButton = ({
  icon: Icon,
  tooltip,
  onClick,
  active = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
  ...rest
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  const variantClasses = {
    default: `
      text-slate-600
      hover:text-slate-800
      hover:bg-slate-100
      ${active ? 'bg-slate-200 text-slate-800' : ''}
    `,
    primary: `
      text-primary
      hover:bg-primary/10
      ${active ? 'bg-primary text-white hover:bg-primary' : ''}
    `,
    danger: `
      text-slate-600
      hover:text-red-600
      hover:bg-red-50
      ${active ? 'bg-red-100 text-red-600' : ''}
    `
  };

  return (
    <Tooltip content={tooltip}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          rounded-lg
          transition-colors
          focus:outline-none
          focus:ring-2
          focus:ring-primary/50
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${className}
        `}
        aria-label={tooltip}
        {...rest}
      >
        <Icon size={iconSizes[size]} aria-hidden="true" />
      </button>
    </Tooltip>
  );
};
