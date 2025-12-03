# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **EnBW Dashboard** built with React and Vite - a German utility provider (energy grid) monitoring and management system. The application provides real-time monitoring of energy distribution, grid status, facilities, customers, and financial data.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server typically runs on `http://localhost:5173` (Vite default).

## Architecture

### Core Application Structure

- **App.jsx**: Top-level component managing view routing, toast notifications, and theme state
- **main.jsx**: React application entry point
- **index.css**: Global styles with CSS custom properties for theming

### View-Based Routing

The app uses view-based routing (not React Router). The `App.jsx` component manages state for `currentView` and renders different view components:

- `DashboardView` - Main dashboard with KPIs, charts, and grid monitoring
- `LiveMonitoringView` - Real-time grid monitoring
- `AnalyticsView` - Historical analytics and insights
- `FacilitiesView` - Facilities/plant management
- `CustomersView` - Customer management
- `FinanceView` - Invoice and financial data
- `AlertsView` - Alert monitoring

Views are switched via the `handleViewChange` function which updates state and shows toast notifications.

### Component Organization

```
src/
├── components/
│   ├── dashboard/    # Data visualization components (charts, tables, KPIs)
│   ├── layout/       # MainLayout, Sidebar, Header
│   ├── ui/           # Reusable UI components (Button, Toast, SectionHeader)
│   └── views/        # Full page view components
├── data/            # JSON mock data files and mockData.js aggregator
└── hooks/           # Custom React hooks (useTheme, useToast)
```

### Data Flow

All data comes from **mock JSON files** in `src/data/`:
- `kpis.json` - Key performance indicators
- `facilities.json` - Facility/plant data
- `customers.json` - Customer records
- `invoices.json` - Financial/invoice data
- `alerts.json` - Alert notifications
- `energy.json` - Energy consumption and mix data
- `grid.json` - Grid load, voltage, frequency, forecasts
- `analytics.json` - Battery storage, peak demand, losses

The `mockData.js` file imports and aggregates all JSON files into a single export object consumed by view components.

### Theme System

- Theme state managed by `useTheme` hook (`src/hooks/useTheme.js`)
- Persists to localStorage
- Uses CSS custom properties in `index.css` with `[data-theme="light"]` and `[data-theme="dark"]` selectors
- Theme toggle in Sidebar component
- Default is dark mode

### Styling

- Pure CSS with custom properties (no CSS modules, no Tailwind)
- Global styles in `index.css`
- Dark mode default with custom EnBW brand colors:
  - Primary: `#000099` (EnBW blue)
  - Accent: `#FD951F` (EnBW orange)
- Responsive design with mobile-first breakpoints
- Uses Lucide React icons throughout

### Toast Notifications

- Managed by `useToast` hook
- Every view change and user interaction triggers a toast
- Toast component displays at bottom of screen with auto-dismiss

## Key Dependencies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Charting library for all data visualizations
- **Lucide React** - Icon library (replacing custom SVGs)

## Design Philosophy

- Clean, professional utility dashboard aesthetic
- Dark mode inspired by Anthropic's design system
- All interactions provide user feedback via toasts
- Mobile-responsive with hamburger menu and collapsible sidebar
- Consistent spacing and visual hierarchy with section headers
