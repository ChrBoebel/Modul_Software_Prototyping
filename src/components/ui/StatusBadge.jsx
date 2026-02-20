import { useState, useRef, useEffect } from 'react';

/**
 * StatusBadge - Badge mit Status und optionalem Tooltip
 * Verwendet für: Lead-Status, Verfügbarkeit, Integration-Status
 */
export const StatusBadge = ({
  status,
  label,
  tooltip,
  icon: Icon,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const badgeRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    if (!tooltip) return;
    timeoutRef.current = setTimeout(() => {
      if (badgeRef.current) {
        const rect = badgeRef.current.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }
      setIsVisible(true);
    }, 80);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Variant styles
  const variantStyles = {
    success: {
      bg: 'var(--success-light)',
      color: 'var(--success)',
      indicator: 'var(--success)'
    },
    warning: {
      bg: 'var(--warning-light)',
      color: 'var(--warning)',
      indicator: 'var(--warning)'
    },
    danger: {
      bg: 'var(--danger-light)',
      color: 'var(--danger)',
      indicator: 'var(--danger)'
    },
    info: {
      bg: 'var(--info-light)',
      color: 'var(--info)',
      indicator: 'var(--info)'
    },
    neutral: {
      bg: 'var(--slate-100)',
      color: 'var(--slate-500)',
      indicator: 'var(--slate-400)'
    },
    default: {
      bg: 'var(--slate-100)',
      color: 'var(--slate-600)',
      indicator: 'var(--slate-400)'
    }
  };

  const sizeStyles = {
    sm: { className: 'status-badge-size-sm', iconSize: 10 },
    md: { className: 'status-badge-size-md', iconSize: 12 },
    lg: { className: 'status-badge-size-lg', iconSize: 14 }
  };

  const style = variantStyles[variant] || variantStyles.default;
  const sizeStyle = sizeStyles[size] || sizeStyles.md;
  const badgeVars = {
    '--status-badge-bg': style.bg,
    '--status-badge-color': style.color,
    '--status-badge-indicator': style.indicator
  };
  const tooltipVars = {
    '--status-tooltip-left': `${position.x}px`,
    '--status-tooltip-top': `${position.y}px`
  };

  return (
    <>
      <span
        ref={badgeRef}
        className={`status-badge-tooltip ${sizeStyle.className} ${tooltip ? 'is-help' : ''} ${className}`.trim()}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={badgeVars}
      >
        {Icon && <Icon size={sizeStyle.iconSize} />}
        {label}
      </span>

      {isVisible && tooltip && (
        <div
          className="status-tooltip"
          style={tooltipVars}
        >
          <div className="status-tooltip-content">
            <div className={`status-tooltip-header ${tooltip.description ? '' : 'compact'}`}>
              <span className="status-tooltip-indicator" />
              <span className="status-tooltip-title">
                {tooltip.title || label}
              </span>
            </div>
            {tooltip.description && (
              <p className="status-tooltip-description">
                {tooltip.description}
              </p>
            )}
          </div>
          <div className="status-tooltip-arrow" />
        </div>
      )}

    </>
  );
};
