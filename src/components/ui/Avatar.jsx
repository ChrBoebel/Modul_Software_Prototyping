import { useState } from 'react';

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

// Company logo files (stored in /public/logos/)
const COMPANY_LOGOS = {
  'rewe': '/logos/rewe.png',
  'mercedes': '/logos/mercedes.png',
  'siemens': '/logos/siemens.png',
  'sparkasse': '/logos/sparkasse.png',
  'sap': '/logos/sap.png',
  'microsoft': '/logos/microsoft.png',
  'mailchimp': '/logos/mailchimp.png',
  'bosch': '/logos/bosch.png',
  'bmw': '/logos/bmw.png',
  'porsche': '/logos/porsche.png',
  'audi': '/logos/audi.png',
  'volkswagen': '/logos/volkswagen.png',
  'vw': '/logos/volkswagen.png',
  'allianz': '/logos/allianz.png',
  'telekom': '/logos/telekom.png',
  'vodafone': '/logos/vodafone.png',
  'google': '/logos/google.png',
  'amazon': '/logos/amazon.png',
  'apple': '/logos/apple.png',
  'ibm': '/logos/ibm.png',
  'oracle': '/logos/oracle.png',
  'salesforce': '/logos/salesforce.png',
};

// Company brand colors for avatar backgrounds
const COMPANY_COLORS = {
  // Tech
  'sap': { bg: '0070F2', text: 'fff' },
  'siemens': { bg: '009999', text: 'fff' },
  'bosch': { bg: 'E20015', text: 'fff' },
  'mercedes': { bg: '000000', text: 'fff' },
  'bmw': { bg: '0066B1', text: 'fff' },
  'porsche': { bg: 'B12B28', text: 'fff' },
  'audi': { bg: 'BB0A30', text: 'fff' },
  'volkswagen': { bg: '001E50', text: 'fff' },
  'vw': { bg: '001E50', text: 'fff' },
  // Banks
  'sparkasse': { bg: 'FF0000', text: 'fff' },
  'allianz': { bg: '003781', text: 'fff' },
  'commerzbank': { bg: 'FFD700', text: '000' },
  'deutsche bank': { bg: '0018A8', text: 'fff' },
  // Retail
  'rewe': { bg: 'CC071E', text: 'fff' },
  'lidl': { bg: '0050AA', text: 'fff' },
  'aldi': { bg: '00529B', text: 'fff' },
  'edeka': { bg: 'FED500', text: '000' },
  'dm': { bg: '008C8C', text: 'fff' },
  // Tech & Software
  'microsoft': { bg: '00A4EF', text: 'fff' },
  'google': { bg: '4285F4', text: 'fff' },
  'amazon': { bg: 'FF9900', text: '000' },
  'apple': { bg: '000000', text: 'fff' },
  'ibm': { bg: '0530AD', text: 'fff' },
  'oracle': { bg: 'F80000', text: 'fff' },
  'salesforce': { bg: '00A1E0', text: 'fff' },
  // Telecom
  'telekom': { bg: 'E20074', text: 'fff' },
  'vodafone': { bg: 'E60000', text: 'fff' },
  // Energy
  'enbw': { bg: '003366', text: 'fff' },
  'rwe': { bg: '1E3C6E', text: 'fff' },
  'eon': { bg: 'EA1B0A', text: 'fff' },
  // Industry
  'basf': { bg: '21409A', text: 'fff' },
  'bayer': { bg: '10384F', text: 'fff' },
  'thyssenkrupp': { bg: '00629B', text: 'fff' },
  // CRM/ERP
  'dynamics': { bg: '00A4EF', text: 'fff' },
  'mailchimp': { bg: 'FFE01B', text: '000' },
};

// Get company logo path if available
const getCompanyLogo = (companyName) => {
  if (!companyName) return null;
  const nameLower = companyName.toLowerCase();

  for (const [key, logoPath] of Object.entries(COMPANY_LOGOS)) {
    if (nameLower.includes(key)) {
      return logoPath;
    }
  }
  return null;
};

// Get company brand colors or generate one based on company name
const getCompanyBrandColors = (companyName) => {
  if (!companyName) return null;

  const nameLower = companyName.toLowerCase();

  // Check for known company brand colors
  for (const [key, colors] of Object.entries(COMPANY_COLORS)) {
    if (nameLower.includes(key)) {
      return colors;
    }
  }

  // Generate a consistent color based on company name hash
  const hash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  // Convert HSL to hex (simplified - use dark corporate colors)
  const colors = [
    { bg: '1e3a5f', text: 'fff' }, // Dark blue
    { bg: '2d4a3e', text: 'fff' }, // Dark green
    { bg: '4a3728', text: 'fff' }, // Dark brown
    { bg: '3d2c4a', text: 'fff' }, // Dark purple
    { bg: '4a2c2c', text: 'fff' }, // Dark red
    { bg: '2c3e4a', text: 'fff' }, // Dark teal
  ];
  return colors[hash % colors.length];
};

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Generate placeholder avatar URL - real person photos or company avatars
const getPlaceholderUrl = (name, size, type = 'person') => {
  // Create a consistent hash from the name for the same person to always get the same image
  const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;

  if (type === 'company') {
    // First check if we have a local logo file for this company
    const logoPath = getCompanyLogo(name);
    if (logoPath) {
      return logoPath;
    }

    // Fallback to text-based avatar with brand colors
    const brandColors = getCompanyBrandColors(name);
    const bg = brandColors?.bg || '1e293b';
    const text = brandColors?.text || 'fff';

    // Get short company name (first word or abbreviation)
    const shortName = name
      ? name.split(/\s+/)[0].substring(0, 8) // First word, max 8 chars
      : 'Co';

    const encodedName = encodeURIComponent(shortName);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size * 3}&background=${bg}&color=${text}&bold=true&format=png&rounded=true`;
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
  const [imageError, setImageError] = useState(false);
  const displayInitials = initials || getInitials(name);
  const sizeValue = sizePx[size] || sizePx.md;
  const baseAvatarStyle = { width: sizeValue, height: sizeValue, borderRadius: '50%' };

  // Use placeholder image if requested or if src is provided
  const imageSrc = src || (usePlaceholder ? getPlaceholderUrl(name, sizeValue, type) : null);

  // Handle image load error - fallback to initials
  const handleImageError = () => {
    setImageError(true);
  };

  if (imageSrc && !imageError) {
    // For company logos, use contain to show full logo; for people use cover
    const isCompanyLogo = type === 'company' && getCompanyLogo(name);
    const imageStyle = {
      ...baseAvatarStyle,
      objectFit: isCompanyLogo ? 'contain' : 'cover',
      backgroundColor: isCompanyLogo ? 'var(--bg-surface)' : 'transparent',
      border: '2px solid var(--border-color)',
      padding: isCompanyLogo ? '2px' : '0'
    };

    return (
      <img
        src={imageSrc}
        alt={name || 'Avatar'}
        className={`avatar ${sizeClasses[size]} avatar-${variant} ${className}`.trim()}
        style={imageStyle}
        onError={handleImageError}
      />
    );
  }

  return (
    <div
      className={`avatar ${sizeClasses[size]} avatar-${variant} ${className}`.trim()}
      style={baseAvatarStyle}
      aria-label={name}
      title={name}
    >
      {displayInitials}
    </div>
  );
};
