export const designTokens = {
  colors: {
    // Brand
    primary: '#E2001A',
    primaryDark: '#b90015',
    primaryLight: '#fff1f2',
    secondary: '#2358A1',
    secondaryDark: '#1a437d',
    secondaryLight: '#eff6ff',

    // Semantic
    success: '#2358A1',
    successLight: '#eff6ff',
    warning: '#64748b',
    warningDark: '#475569',
    warningLight: '#f1f5f9',
    warningAccent: '#f59e0b',
    danger: '#dc2626',
    dangerHover: '#b91c1c',
    dangerLight: '#fef2f2',
    info: '#3b82f6',
    infoLight: '#eff6ff',

    // Availability / Signals
    availabilityFtth: '#22c55e',
    availabilityKabel: '#3b82f6',
    availabilityDsl: '#f59e0b',
    availabilityNone: '#ef4444',
    availabilityAllow: '#059669',
    availabilityAllowLight: 'rgba(5, 150, 105, 0.1)',
    availabilityDenyLight: 'rgba(220, 38, 38, 0.1)',
    overlayWhite80: 'rgba(255, 255, 255, 0.8)',
    muted: '#666666',
    toastProgressSecondary: '#5b8fd4',
    toastProgressPrimary: '#f87171',

    // Neutrals
    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
    slate300: '#cbd5e1',
    slate400: '#94a3b8',
    slate500: '#64748b',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1e293b',
    slate900: '#0f172a',

    // Surface
    bgApp: '#F6F6F6',
    surface: '#FFFFFF',
    surfaceHover: '#f8fafc',
    sidebar: '#FFFFFF',

    // Text
    textPrimary: '#000000',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    textOnPrimary: '#ffffff',

    // Borders
    borderColor: '#e2e8f0',
    borderHover: '#cbd5e1',
    borderLight: '#f1f5f9',
    purple600: '#9333ea',

    white: '#FFFFFF',
    black: '#000000',
  },
  typography: {
    fontFamily: {
      sans: '\'Outfit\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif',
      display: '\'Outfit\', sans-serif',
      tailwindSans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
    fontSize: {
      h1: ['40px', { lineHeight: '1.2', fontWeight: '900', letterSpacing: '0.02em' }],
      h2: ['24px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.02em' }],
      h3: ['18px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.02em' }],
    },
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  layout: {
    sidebarWidth: '280px',
    headerHeight: '64px',
  },
  motion: {
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  chartPalette: ['#E2001A', '#2358A1', '#1e293b', '#64748b', '#cbd5e1'],
  productPalette: {
    FTTH: {
      name: 'Glasfaser',
      base: '#2358A1',
      shades: [
        '#1a437d',
        '#2358A1',
        '#3b6db5',
        '#6b93c7',
        '#a8c0dd',
      ],
    },
    KABEL: {
      name: 'Kabel',
      base: '#E2001A',
      shades: [
        '#b90015',
        '#E2001A',
        '#e63347',
        '#ed6675',
        '#f5a3ab',
      ],
    },
    DSL: {
      name: 'DSL',
      base: '#64748b',
      shades: ['#475569', '#64748b', '#94a3b8'],
    },
  },
};
