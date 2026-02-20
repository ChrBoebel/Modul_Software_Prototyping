import { designTokens } from './src/theme/designTokens.js';

const { colors, typography, radius, shadows, layout, motion } = designTokens;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: colors.slate50,
          100: colors.slate100,
          200: colors.slate200,
          300: colors.slate300,
          400: colors.slate400,
          500: colors.slate500,
          600: colors.slate600,
          700: colors.slate700,
          800: colors.slate800,
          900: colors.slate900,
        },
        swk: {
          red: colors.primary,
          'red-dark': colors.primaryDark,
          'red-light': colors.primaryLight,
          blue: colors.secondary,
          'blue-dark': colors.secondaryDark,
          'blue-light': colors.secondaryLight,
        },
        primary: {
          DEFAULT: colors.primary,
          hover: colors.primaryDark,
          light: colors.primaryLight,
        },
        secondary: {
          DEFAULT: colors.secondary,
          dark: colors.secondaryDark,
          light: colors.secondaryLight,
        },
        accent: {
          DEFAULT: colors.secondary,
          hover: colors.secondaryDark,
        },
        success: {
          DEFAULT: colors.success,
          light: colors.successLight,
        },
        warning: {
          DEFAULT: colors.warning,
          dark: colors.warningDark,
          light: colors.warningLight,
          accent: colors.warningAccent,
        },
        danger: {
          DEFAULT: colors.danger,
          hover: colors.dangerHover,
          light: colors.dangerLight,
        },
        info: {
          DEFAULT: colors.info,
          light: colors.infoLight,
        },
        availability: {
          ftth: colors.availabilityFtth,
          kabel: colors.availabilityKabel,
          dsl: colors.availabilityDsl,
          none: colors.availabilityNone,
        },
        muted: colors.muted,
        surface: colors.surface,
        'bg-app': colors.bgApp,
      },
      fontFamily: {
        outfit: typography.fontFamily.tailwindSans,
        sans: typography.fontFamily.tailwindSans,
      },
      fontSize: typography.fontSize,
      borderRadius: {
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
      },
      boxShadow: shadows,
      spacing: {
        sidebar: layout.sidebarWidth,
        header: layout.headerHeight,
      },
      transitionTimingFunction: {
        custom: motion.easing,
      },
    },
  },
  plugins: [],
}
