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
    sm: { padding: '2px 8px', fontSize: '11px', iconSize: 10, gap: '4px' },
    md: { padding: '4px 10px', fontSize: '12px', iconSize: 12, gap: '6px' },
    lg: { padding: '6px 12px', fontSize: '13px', iconSize: 14, gap: '8px' }
  };

  const style = variantStyles[variant] || variantStyles.default;
  const sizeStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <>
      <span
        ref={badgeRef}
        className={`status-badge-tooltip ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: sizeStyle.gap,
          padding: sizeStyle.padding,
          fontSize: sizeStyle.fontSize,
          fontWeight: 500,
          borderRadius: '9999px',
          backgroundColor: style.bg,
          color: style.color,
          cursor: tooltip ? 'help' : 'default',
          whiteSpace: 'nowrap'
        }}
      >
        {Icon && <Icon size={sizeStyle.iconSize} />}
        {label}
      </span>

      {isVisible && tooltip && (
        <div
          className="status-tooltip"
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'tooltipIn 0.12s ease-out'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
              padding: '8px 12px',
              maxWidth: '220px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: tooltip.description ? '6px' : 0
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: style.indicator,
                flexShrink: 0
              }} />
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--slate-800)'
              }}>
                {tooltip.title || label}
              </span>
            </div>
            {tooltip.description && (
              <p style={{
                fontSize: '12px',
                color: 'var(--slate-500)',
                margin: 0,
                lineHeight: 1.4
              }}>
                {tooltip.description}
              </p>
            )}
          </div>
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: '-6px',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid white'
          }} />
        </div>
      )}

    </>
  );
};
