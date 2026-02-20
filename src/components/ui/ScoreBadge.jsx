import { useState, useRef, useEffect } from 'react';

/**
 * ScoreBadge - Badge mit Score-Wert und Tooltip für Breakdown
 */
export const ScoreBadge = ({
  score,
  breakdown = [],
  size = 'md',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const badgeRef = useRef(null);
  const timeoutRef = useRef(null);

  const getVariant = (score) => {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Hoch';
    if (score >= 50) return 'Mittel';
    return 'Niedrig';
  };

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (badgeRef.current) {
        const rect = badgeRef.current.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }
      setIsVisible(true);
    }, 80); // Fast appearance
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

  const sizeClasses = {
    sm: 'min-w-[28px] py-0.5 px-1.5 text-[10px]',
    md: 'min-w-[36px] py-1 px-2 text-xs',
    lg: 'min-w-[44px] py-1.5 px-3 text-sm'
  };

  const variant = getVariant(score);
  const tooltipVars = {
    '--score-tooltip-left': `${position.x}px`,
    '--score-tooltip-top': `${position.y}px`
  };

  return (
    <>
      <span
        ref={badgeRef}
        className={`score-badge ${variant} ${sizeClasses[size]} ${breakdown.length > 0 ? 'score-badge-interactive' : ''} ${className}`.trim()}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {score}
      </span>

      {isVisible && (
        <div
          className="score-tooltip"
          style={tooltipVars}
        >
          <div className="score-tooltip-content">
            <div className="score-tooltip-header">
              <span className={`score-tooltip-indicator ${variant}`} />
              <span className="score-tooltip-label">{getLabel(score)}</span>
              <span className="score-tooltip-value">{score} Punkte</span>
            </div>

            {breakdown.length > 0 && (
              <div className="score-tooltip-breakdown">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="score-tooltip-row">
                    <span className="score-tooltip-item-label">{item.label}</span>
                    <span className={`score-tooltip-item-points ${item.points >= 0 ? 'positive' : 'negative'}`}>
                      {item.points > 0 ? '+' : ''}{item.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="score-tooltip-arrow" />
        </div>
      )}
    </>
  );
};
