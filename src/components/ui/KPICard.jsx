import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip } from './Tooltip';

const variantClasses = {
  primary: 'kpi-primary',
  secondary: 'kpi-secondary',
  success: 'kpi-success',
  warning: 'kpi-warning',
  danger: 'kpi-danger'
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
  className = ''
}) => {
  const TrendIcon = trend?.direction ? trendIcons[trend.direction] : null;

  const content = (
    <div className={`kpi-card ${className}`.trim()}>
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
