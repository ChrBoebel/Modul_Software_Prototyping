import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { designTokens } from '../src/theme/designTokens.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../src/styles/tokens.css');

const { colors, typography, radius, shadows, layout, motion } = designTokens;

const cssVariables = {
  '--slate-50': colors.slate50,
  '--slate-100': colors.slate100,
  '--slate-200': colors.slate200,
  '--slate-300': colors.slate300,
  '--slate-400': colors.slate400,
  '--slate-500': colors.slate500,
  '--slate-600': colors.slate600,
  '--slate-700': colors.slate700,
  '--slate-800': colors.slate800,
  '--slate-900': colors.slate900,

  '--swk-red': colors.primary,
  '--swk-red-dark': colors.primaryDark,
  '--swk-red-light': colors.primaryLight,
  '--swk-blue': colors.secondary,
  '--swk-blue-dark': colors.secondaryDark,
  '--swk-blue-light': colors.secondaryLight,

  '--primary': colors.primary,
  '--primary-color': colors.primary,
  '--primary-hover': colors.primaryDark,
  '--primary-light': colors.primaryLight,
  '--accent': colors.secondary,
  '--accent-hover': colors.secondaryDark,
  '--secondary': colors.secondary,
  '--success': colors.success,
  '--success-light': colors.successLight,
  '--warning': colors.warning,
  '--warning-dark': colors.warningDark,
  '--warning-light': colors.warningLight,
  '--warning-accent': colors.warningAccent,
  '--danger': colors.danger,
  '--danger-hover': colors.dangerHover,
  '--danger-light': colors.dangerLight,
  '--info': colors.info,
  '--info-light': colors.infoLight,
  '--availability-ftth': colors.availabilityFtth,
  '--availability-kabel': colors.availabilityKabel,
  '--availability-dsl': colors.availabilityDsl,
  '--availability-none': colors.availabilityNone,
  '--availability-allow': colors.availabilityAllow,
  '--availability-allow-light': colors.availabilityAllowLight,
  '--availability-deny-light': colors.availabilityDenyLight,
  '--overlay-white-80': colors.overlayWhite80,
  '--muted': colors.muted,
  '--toast-progress-secondary': colors.toastProgressSecondary,
  '--toast-progress-primary': colors.toastProgressPrimary,

  '--bg-app': colors.bgApp,
  '--bg-surface': colors.surface,
  '--bg-surface-hover': colors.surfaceHover,
  '--bg-sidebar': colors.sidebar,
  '--bg-secondary': colors.surface,

  '--text-primary': colors.textPrimary,
  '--text-secondary': colors.textSecondary,
  '--text-tertiary': colors.textTertiary,
  '--text-on-primary': colors.textOnPrimary,

  '--border-color': colors.borderColor,
  '--border-hover': colors.borderHover,
  '--border-light': colors.borderLight,
  '--purple-600': colors.purple600,

  '--font-sans': typography.fontFamily.sans,
  '--font-display': typography.fontFamily.display,

  '--shadow-sm': shadows.sm,
  '--shadow': shadows.DEFAULT,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg,
  '--shadow-xl': shadows.xl,

  '--sidebar-width': layout.sidebarWidth,
  '--sidebar-current-width': layout.sidebarWidth,
  '--header-height': layout.headerHeight,
  '--radius-sm': radius.sm,
  '--radius-md': radius.md,
  '--radius-lg': radius.lg,
  '--radius-xl': radius.xl,
  '--radius-full': radius.full,

  '--transition': motion.transition,
};

const cssLines = [
  '/* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. */',
  '/* Source: src/theme/designTokens.js */',
  '@layer base {',
  '  :root {',
  ...Object.entries(cssVariables).map(([key, value]) => `    ${key}: ${value};`),
  '  }',
  '}',
  '',
];

await fs.writeFile(outputPath, cssLines.join('\n'), 'utf8');
console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
