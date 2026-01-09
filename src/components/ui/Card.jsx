export const Card = ({
  children,
  header,
  headerTitle,
  headerActions,
  fullWidth = false,
  hoverable = true,
  className = '',
  ...rest
}) => {
  const classes = [
    'card',
    fullWidth && 'full-width',
    !hoverable && 'no-hover',
    className
  ].filter(Boolean).join(' ');

  const renderHeader = () => {
    if (header) return header;
    if (!headerTitle && !headerActions) return null;

    return (
      <div className="card-header">
        {headerTitle && <h3>{headerTitle}</h3>}
        {headerActions && <div className="card-actions">{headerActions}</div>}
      </div>
    );
  };

  return (
    <div className={classes} {...rest}>
      {renderHeader()}
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`.trim()}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`.trim()}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`.trim()}>
    {children}
  </div>
);
