// Single Source of Truth für Farben in JS (z.B. für Recharts)
// Diese Werte müssen mit src/index.css synchron gehalten werden!

export const theme = {
  colors: {
    primary: '#E2001A',      // SWK Red (Main Brand)
    primaryDark: '#b90015',
    primaryLight: '#fff1f2',
    
    secondary: '#2358A1',    // SWK Blue (Accent)
    secondaryDark: '#1a437d',
    secondaryLight: '#eff6ff',
    
    // Semantic
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#3b82f6',
    
    // Neutrals (Slate Scale)
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
    
    white: '#FFFFFF',
    black: '#000000',
  }
};

// Helper für Recharts (Standard-Palette ohne Grün/Orange für Diagramme)
export const chartColors = {
  main: [
    theme.colors.primary,    // 1. Rot
    theme.colors.secondary,  // 2. Blau
    theme.colors.slate800,   // 3. Dunkelgrau/Navy
    theme.colors.slate500,   // 4. Mittelgrau
    theme.colors.slate300,   // 5. Hellgrau
  ]
};
