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

// Known company logos mapping - using reliable Wikipedia/direct URLs
const COMPANY_LOGOS = {
  // Tech companies
  'sap': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/200px-SAP_2011_logo.svg.png',
  'siemens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/200px-Siemens-logo.svg.png',
  'bosch': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-logo.svg/200px-Bosch-logo.svg.png',
  'mercedes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/200px-Mercedes-Logo.svg.png',
  'bmw': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png',
  'porsche': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Porsche_logo.svg/200px-Porsche_logo.svg.png',
  'audi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/200px-Audi-Logo_2016.svg.png',
  'volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/200px-Volkswagen_logo_2019.svg.png',
  'vw': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/200px-Volkswagen_logo_2019.svg.png',
  // Banks & Finance
  'sparkasse': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/200px-Sparkasse.svg.png',
  'allianz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Allianz_logo.svg/200px-Allianz_logo.svg.png',
  'commerzbank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Commerzbank_Logo_2009.svg/200px-Commerzbank_Logo_2009.svg.png',
  'deutsche bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Deutsche_Bank_logo_without_wordmark.svg/200px-Deutsche_Bank_logo_without_wordmark.svg.png',
  // Retail
  'rewe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Rewe_Markt_Logo.svg/200px-Rewe_Markt_Logo.svg.png',
  'lidl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lidl-Logo.svg/200px-Lidl-Logo.svg.png',
  'aldi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Aldi_S%C3%BCd_2017_logo.svg/200px-Aldi_S%C3%BCd_2017_logo.svg.png',
  'edeka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Edeka_logo.svg/200px-Edeka_logo.svg.png',
  'dm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Dm_Logo.svg/200px-Dm_Logo.svg.png',
  // Tech & Software
  'microsoft': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png',
  'google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png',
  'amazon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png',
  'apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/200px-Apple_logo_black.svg.png',
  'ibm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png',
  'oracle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png',
  'salesforce': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/200px-Salesforce.com_logo.svg.png',
  // Telecom
  'telekom': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Deutsche_Telekom_2022.svg/200px-Deutsche_Telekom_2022.svg.png',
  'vodafone': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vodafone_icon.svg/200px-Vodafone_icon.svg.png',
  // Energy
  'enbw': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/EnBW-Logo.svg/200px-EnBW-Logo.svg.png',
  'rwe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/RWE_Logo_2020.svg/200px-RWE_Logo_2020.svg.png',
  'eon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/E.ON_Logo.svg/200px-E.ON_Logo.svg.png',
  // Industry
  'basf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/BASF-Logo_bw.svg/200px-BASF-Logo_bw.svg.png',
  'bayer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Logo_Bayer.svg/200px-Logo_Bayer.svg.png',
  'thyssenkrupp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Thyssenkrupp_AG_Logo_2015.svg/200px-Thyssenkrupp_AG_Logo_2015.svg.png',
  // CRM/ERP Systems
  'dynamics': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png',
  'mailchimp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Mailchimp_Logo.svg/200px-Mailchimp_Logo.svg.png',
};

// Try to find a logo for a company name
const getCompanyLogo = (companyName) => {
  if (!companyName) return null;

  const nameLower = companyName.toLowerCase();

  // Check direct matches in known logos
  for (const [key, url] of Object.entries(COMPANY_LOGOS)) {
    if (nameLower.includes(key)) {
      return url;
    }
  }

  // No match found - will use initials fallback
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
          borderRadius: '50%',
          objectFit: 'cover',
          backgroundColor: '#f1f5f9',
          border: '2px solid #e2e8f0'
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
        borderRadius: '50%'
      }}
      aria-label={name}
      title={name}
    >
      {displayInitials}
    </div>
  );
};
