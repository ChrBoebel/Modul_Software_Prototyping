import { designTokens } from './designTokens';

// Backwards-compatible wrapper for existing imports.
export const theme = {
  colors: designTokens.colors,
};

export const chartColors = {
  main: designTokens.chartPalette,
};
