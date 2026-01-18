import { useState, useRef, useEffect } from 'react';

/**
 * Tooltip - Tooltip-Komponente mit fixed positioning (wird nie abgeschnitten)
 *
 * @param {ReactNode} children - Das Element, das den Tooltip auslöst
 * @param {string} content - Tooltip-Text
 * @param {string} position - Position: top, bottom, left, right (default: top)
 * @param {number} delay - Verzögerung in ms bevor Tooltip erscheint (default: 80)
 * @param {string} className - Zusätzliche CSS-Klassen für den Wrapper
 */
export const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 80,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Default to requested position
    let finalPosition = position;
    let x = 0;
    let y = 0;

    // Calculate initial position
    switch (position) {
      case 'top':
        x = trigger.left + trigger.width / 2;
        y = trigger.top;
        break;
      case 'bottom':
        x = trigger.left + trigger.width / 2;
        y = trigger.bottom;
        break;
      case 'left':
        x = trigger.left;
        y = trigger.top + trigger.height / 2;
        break;
      case 'right':
        x = trigger.right;
        y = trigger.top + trigger.height / 2;
        break;
      default:
        x = trigger.left + trigger.width / 2;
        y = trigger.top;
    }

    // Check if tooltip would go off-screen and adjust
    // We estimate tooltip size (will be refined after render)
    const estimatedWidth = 200;
    const estimatedHeight = 40;

    if (position === 'top' && trigger.top < estimatedHeight + 10) {
      finalPosition = 'bottom';
      y = trigger.bottom;
    } else if (position === 'bottom' && trigger.bottom + estimatedHeight > viewport.height - 10) {
      finalPosition = 'top';
      y = trigger.top;
    } else if (position === 'left' && trigger.left < estimatedWidth + 10) {
      finalPosition = 'right';
      x = trigger.right;
    } else if (position === 'right' && trigger.right + estimatedWidth > viewport.width - 10) {
      finalPosition = 'left';
      x = trigger.left;
    }

    setCoords({ x, y });
    setActualPosition(finalPosition);
  };

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Recalculate position after tooltip renders (for accurate sizing)
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current.getBoundingClientRect();
      const trigger = triggerRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let finalPosition = actualPosition;
      let x = coords.x;
      let y = coords.y;

      // Refine position based on actual tooltip size
      if (actualPosition === 'top' && trigger.top - tooltip.height < 10) {
        finalPosition = 'bottom';
        y = trigger.bottom;
      } else if (actualPosition === 'bottom' && trigger.bottom + tooltip.height > viewport.height - 10) {
        finalPosition = 'top';
        y = trigger.top;
      }

      // Keep tooltip within horizontal bounds
      if (actualPosition === 'top' || actualPosition === 'bottom') {
        const halfWidth = tooltip.width / 2;
        if (x - halfWidth < 10) {
          x = halfWidth + 10;
        } else if (x + halfWidth > viewport.width - 10) {
          x = viewport.width - halfWidth - 10;
        }
      }

      if (finalPosition !== actualPosition || x !== coords.x || y !== coords.y) {
        setActualPosition(finalPosition);
        setCoords({ x, y });
      }
    }
  }, [isVisible, actualPosition, coords]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate transform and margin based on position
  const getPositionStyle = () => {
    switch (actualPosition) {
      case 'top':
        return {
          left: coords.x,
          top: coords.y,
          transform: 'translate(-50%, -100%)',
          marginTop: '-8px'
        };
      case 'bottom':
        return {
          left: coords.x,
          top: coords.y,
          transform: 'translate(-50%, 0)',
          marginTop: '8px'
        };
      case 'left':
        return {
          left: coords.x,
          top: coords.y,
          transform: 'translate(-100%, -50%)',
          marginLeft: '-8px'
        };
      case 'right':
        return {
          left: coords.x,
          top: coords.y,
          transform: 'translate(0, -50%)',
          marginLeft: '8px'
        };
      default:
        return {
          left: coords.x,
          top: coords.y,
          transform: 'translate(-50%, -100%)',
          marginTop: '-8px'
        };
    }
  };

  // Arrow position styles
  const getArrowStyle = () => {
    const base = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '6px'
    };

    switch (actualPosition) {
      case 'top':
        return {
          ...base,
          left: '50%',
          bottom: '-6px',
          transform: 'translateX(-50%)',
          borderColor: 'white transparent transparent transparent'
        };
      case 'bottom':
        return {
          ...base,
          left: '50%',
          top: '-6px',
          transform: 'translateX(-50%)',
          borderColor: 'transparent transparent white transparent'
        };
      case 'left':
        return {
          ...base,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderColor: 'transparent transparent transparent white'
        };
      case 'right':
        return {
          ...base,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderColor: 'transparent white transparent transparent'
        };
      default:
        return base;
    }
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
          style={{
            position: 'fixed',
            ...getPositionStyle(),
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'tooltipIn 0.12s ease-out'
          }}
        >
          <div style={{
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#334155',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
            whiteSpace: 'nowrap',
            maxWidth: '280px'
          }}>
            {content}
          </div>
          {/* Arrow */}
          <div style={getArrowStyle()} />
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
