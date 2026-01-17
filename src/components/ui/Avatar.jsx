const sizeClasses = {
  xs: 'avatar-xs',
  sm: 'avatar-sm',
  md: 'avatar-md',
  lg: 'avatar-lg'
};

const sizePx = {
  xs: 24,
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

// Generate placeholder avatar URL - real person photos
const getPlaceholderUrl = (name, size, type = 'person') => {
  // Create a consistent hash from the name for the same person to always get the same image
  const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;

  if (type === 'company') {
    // For companies, use ui-avatars with company colors
    const encodedName = encodeURIComponent(name || 'Company');
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size * 2}&background=1e293b&color=fff&bold=true&format=svg`;
  }

  // For people, use pravatar.cc with consistent ID based on name
  return `https://i.pravatar.cc/${size * 2}?u=${hash}`;
};

export const Avatar = ({
  name,
  initials,
  src,
  size = 'md',
  variant = 'default',
  className = '',
  usePlaceholder = false,
  type = 'person' // 'person' or 'company'
}) => {
  const displayInitials = initials || getInitials(name);
  const sizeValue = sizePx[size] || sizePx.md;

  // Use placeholder image if requested or if src is provided
  const imageSrc = src || (usePlaceholder ? getPlaceholderUrl(name, sizeValue, type) : null);

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={name || 'Avatar'}
        className={`avatar ${sizeClasses[size]} avatar-${variant} ${className}`.trim()}
        style={{ width: sizeValue, height: sizeValue, borderRadius: '50%', objectFit: 'cover' }}
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
