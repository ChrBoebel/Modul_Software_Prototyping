import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Sparkline } from './Sparkline';
import { theme } from '../../theme/colors';

const variantClasses = {
  primary: 'kpi-primary',
  secondary: 'kpi-secondary',
  success: 'kpi-success',
  warning: 'kpi-warning',
  danger: 'kpi-danger'
};

const variantColors = {
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
  success: theme.colors.success,
  warning: theme.colors.warning,
  danger: theme.colors.danger
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
};

export const KPICard = ({
  icon: Icon,
  value,
  label,
  variant = 'primary',
  trend,
  unit,
  tooltip,
  onClick,
  sparklineData,
  className = ''
}) => {
  const TrendIcon = trend?.direction ? trendIcons[trend.direction] : null;
  const sparklineColor = variantColors[variant] || theme.colors.slate400;

  const content = (
    <div
      className={`kpi-card ${onClick ? 'kpi-clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {Icon && (
        <div className={`kpi-icon ${variantClasses[variant]}`}>
          <Icon size={20} aria-hidden="true" />
        </div>
      )}
      <div className="kpi-content">
        <div className="kpi-value-wrapper">
          <span className="kpi-value">{value}</span>
          {unit && <span className="kpi-unit">{unit}</span>}
          {trend && TrendIcon && (
            <span className={`kpi-trend trend-${trend.direction}`}>
              <TrendIcon size={14} aria-hidden="true" />
              {trend.value && <span>{trend.value}</span>}
            </span>
          )}
        </div>
        <span className="kpi-label">{label}</span>
        {/* Sparkline for trend context - Tufte's data-ink principle */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="kpi-sparkline">
            <Sparkline
              data={sparklineData}
              width={56}
              height={16}
              color={sparklineColor}
              strokeWidth={1.5}
              showEndDot={true}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (tooltip) {
    return <Tooltip content={tooltip} position="bottom">{content}</Tooltip>;
  }

  return content;
};

export const KPIBar = ({ children, className = '' }) => (
  <div className={`kpi-bar ${className}`.trim()}>
    {children}
  </div>
);
