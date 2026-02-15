/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slate scale (Cool Grays)
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Brand Colors
        swk: {
          red: '#E2001A',
          'red-dark': '#b90015',
          'red-light': '#fff1f2',
          blue: '#2358A1',
          'blue-dark': '#1a437d',
          'blue-light': '#eff6ff',
        },
        // Semantic Colors
        primary: {
          DEFAULT: '#E2001A',
          hover: '#b90015',
          light: '#fff1f2',
        },
        accent: {
          DEFAULT: '#2358A1',
          hover: '#1a437d',
        },
        success: {
          DEFAULT: '#16a34a',
          light: '#f0fdf4',
        },
        warning: {
          DEFAULT: '#d97706',
          light: '#fffbeb',
        },
        danger: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          light: '#fef2f2',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#eff6ff',
        },
        // Surface & Backgrounds
        surface: '#ffffff',
        'bg-app': '#F6F6F6',
      },
      fontFamily: {
        outfit: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'h1': ['40px', { lineHeight: '1.2', fontWeight: '900', letterSpacing: '0.02em' }],
        'h2': ['24px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.02em' }],
        'h3': ['18px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      spacing: {
        'sidebar': '280px',
        'header': '64px',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
