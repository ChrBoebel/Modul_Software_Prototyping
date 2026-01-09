import { CheckCircle, XCircle, AlertCircle, Clock, MinusCircle } from 'lucide-react';

const statusConfig = {
  success: { color: 'success', icon: CheckCircle },
  warning: { color: 'warning', icon: AlertCircle },
  danger: { color: 'danger', icon: XCircle },
  info: { color: 'info', icon: Clock },
  neutral: { color: 'neutral', icon: MinusCircle }
};

const statusLabels = {
  success: 'Erfolgreich',
  warning: 'Warnung',
  danger: 'Fehler',
  info: 'Information',
  neutral: 'Neutral'
};

export const StatusIndicator = ({
  status = 'neutral',
  type = 'dot',
  icon: CustomIcon,
  showLabel = false,
  label,
  size = 'md',
  className = ''
}) => {
  const config = statusConfig[status] || statusConfig.neutral;
  const Icon = CustomIcon || config.icon;
  const displayLabel = label || statusLabels[status];
  const iconSize = size === 'sm' ? 14 : 16;

  if (type === 'icon') {
    return (
      <span className={`status-indicator status-icon-wrapper ${config.color} ${className}`.trim()}>
        <Icon size={iconSize} className={`status-icon ${config.color}`} aria-hidden="true" />
        {showLabel && <span className="status-label">{displayLabel}</span>}
      </span>
    );
  }

  return (
    <span className={`status-indicator ${className}`.trim()}>
      <span
        className={`status-dot ${config.color} ${size === 'sm' ? 'dot-sm' : ''}`}
        aria-hidden="true"
      />
      {showLabel && <span className="status-label">{displayLabel}</span>}
    </span>
  );
};
