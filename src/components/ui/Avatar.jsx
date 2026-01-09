const sizeClasses = {
  sm: 'avatar-sm',
  md: 'avatar-md',
  lg: 'avatar-lg'
};

const sizePx = {
  sm: 28,
  md: 40,
  lg: 48
};

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar = ({
  name,
  initials,
  src,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const displayInitials = initials || getInitials(name);
  const sizeValue = sizePx[size] || sizePx.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`avatar ${sizeClasses[size]} avatar-${variant} ${className}`.trim()}
        style={{ width: sizeValue, height: sizeValue }}
      />
    );
  }

  return (
    <div
      className={`avatar ${sizeClasses[size]} avatar-${variant} ${className}`.trim()}
      style={{ width: sizeValue, height: sizeValue }}
      aria-label={name}
      title={name}
    >
      {displayInitials}
    </div>
  );
};
