const variantClasses = {
  success: 'badge success',
  warning: 'badge warning',
  danger: 'badge danger',
  info: 'badge info',
  neutral: 'badge neutral'
};

const scoreClasses = {
  high: 'score-badge high',
  medium: 'score-badge medium',
  low: 'score-badge low',
  hot: 'score-badge hot',
  sql: 'score-badge sql',
  mql: 'score-badge mql',
  new: 'score-badge new'
};

const statusClasses = {
  active: 'status-badge active',
  vacation: 'status-badge vacation',
  offline: 'status-badge offline'
};

export const Badge = ({
  variant = 'neutral',
  type = 'badge',
  scoreVariant,
  statusVariant,
  children,
  className = ''
}) => {
  let classes = '';

  if (type === 'score' && scoreVariant) {
    classes = scoreClasses[scoreVariant] || scoreClasses.medium;
  } else if (type === 'status' && statusVariant) {
    classes = statusClasses[statusVariant] || statusClasses.offline;
  } else {
    classes = variantClasses[variant] || variantClasses.neutral;
  }

  return (
    <span className={`${classes} ${className}`.trim()}>
      {children}
    </span>
  );
};
