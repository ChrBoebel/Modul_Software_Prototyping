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

// Known company logos mapping (German companies & common brands)
const COMPANY_LOGOS = {
  // German utilities & energy
  'swk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/SWK_Stadtwerke_Krefeld_logo.svg/200px-SWK_Stadtwerke_Krefeld_logo.svg.png',
  'stadtwerke': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/SWK_Stadtwerke_Krefeld_logo.svg/200px-SWK_Stadtwerke_Krefeld_logo.svg.png',
  'enbw': 'https://logo.clearbit.com/enbw.com',
  'rwe': 'https://logo.clearbit.com/rwe.com',
  'eon': 'https://logo.clearbit.com/eon.de',
  'vattenfall': 'https://logo.clearbit.com/vattenfall.de',
  // Tech companies
  'sap': 'https://logo.clearbit.com/sap.com',
  'siemens': 'https://logo.clearbit.com/siemens.com',
  'bosch': 'https://logo.clearbit.com/bosch.com',
  'mercedes': 'https://logo.clearbit.com/mercedes-benz.com',
  'bmw': 'https://logo.clearbit.com/bmw.com',
  'porsche': 'https://logo.clearbit.com/porsche.com',
  'audi': 'https://logo.clearbit.com/audi.com',
  'volkswagen': 'https://logo.clearbit.com/volkswagen.de',
  'vw': 'https://logo.clearbit.com/volkswagen.de',
  // Banks & Finance
  'deutsche bank': 'https://logo.clearbit.com/deutsche-bank.de',
  'commerzbank': 'https://logo.clearbit.com/commerzbank.de',
  'sparkasse': 'https://logo.clearbit.com/sparkasse.de',
  'allianz': 'https://logo.clearbit.com/allianz.de',
  // Retail
  'lidl': 'https://logo.clearbit.com/lidl.de',
  'aldi': 'https://logo.clearbit.com/aldi.de',
  'rewe': 'https://logo.clearbit.com/rewe.de',
  'edeka': 'https://logo.clearbit.com/edeka.de',
  'dm': 'https://logo.clearbit.com/dm.de',
  // Consulting & Services
  'kpmg': 'https://logo.clearbit.com/kpmg.com',
  'pwc': 'https://logo.clearbit.com/pwc.com',
  'deloitte': 'https://logo.clearbit.com/deloitte.com',
  'mckinsey': 'https://logo.clearbit.com/mckinsey.com',
  // Tech & Software
  'microsoft': 'https://logo.clearbit.com/microsoft.com',
  'google': 'https://logo.clearbit.com/google.com',
  'amazon': 'https://logo.clearbit.com/amazon.com',
  'apple': 'https://logo.clearbit.com/apple.com',
  'ibm': 'https://logo.clearbit.com/ibm.com',
  'oracle': 'https://logo.clearbit.com/oracle.com',
  'salesforce': 'https://logo.clearbit.com/salesforce.com',
  // Telecom
  'telekom': 'https://logo.clearbit.com/telekom.de',
  'vodafone': 'https://logo.clearbit.com/vodafone.de',
  'o2': 'https://logo.clearbit.com/o2online.de',
  // Construction & Industry
  'hochtief': 'https://logo.clearbit.com/hochtief.de',
  'basf': 'https://logo.clearbit.com/basf.com',
  'bayer': 'https://logo.clearbit.com/bayer.com',
  'thyssen': 'https://logo.clearbit.com/thyssenkrupp.com',
  'thyssenkrupp': 'https://logo.clearbit.com/thyssenkrupp.com',
};

// Try to find a logo for a company name
const getCompanyLogo = (companyName) => {
  if (!companyName) return null;

  const nameLower = companyName.toLowerCase();

  // Check direct matches
  for (const [key, url] of Object.entries(COMPANY_LOGOS)) {
    if (nameLower.includes(key)) {
      return url;
    }
  }

  // Try to extract domain from company name
  const cleanName = nameLower
    .replace(/gmbh|ag|kg|ohg|gbr|e\.v\.|mbh|co\.|&|partner|und|\s+/gi, '')
    .trim();

  if (cleanName.length > 2) {
    // Try Clearbit with guessed domain
    return `https://logo.clearbit.com/${cleanName}.de`;
  }

  return null;
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
    // Try to get a real company logo first
    const logoUrl = getCompanyLogo(name);
    if (logoUrl) {
      return logoUrl;
    }
    // Fallback to ui-avatars with company colors
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
  const [imageError, setImageError] = useState(false);
  const displayInitials = initials || getInitials(name);
  const sizeValue = sizePx[size] || sizePx.md;

  // Use placeholder image if requested or if src is provided
  const imageSrc = src || (usePlaceholder ? getPlaceholderUrl(name, sizeValue, type) : null);

  // Handle image load error - fallback to initials
  const handleImageError = () => {
    setImageError(true);
  };

  if (imageSrc && !imageError) {
    return (
      <img
        src={imageSrc}
        alt={name || 'Avatar'}
        className={`avatar ${sizeClasses[size]} avatar-${variant} ${className}`.trim()}
        style={{
          width: sizeValue,
          height: sizeValue,
          borderRadius: type === 'company' ? '8px' : '50%',
          objectFit: 'contain',
          backgroundColor: type === 'company' ? '#f8fafc' : 'transparent',
          padding: type === 'company' ? '4px' : '0'
        }}
        onError={handleImageError}
      />
    );
  }

  return (
    <div
      className={`avatar ${sizeClasses[size]} avatar-${variant} ${className}`.trim()}
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: type === 'company' ? '8px' : '50%'
      }}
      aria-label={name}
      title={name}
    >
      {displayInitials}
    </div>
  );
};
