# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SWK Admin Dashboard - A React-based admin dashboard for Stadtwerke Konstanz (SWK), a German utility company. The dashboard manages lead marketing flows, product availability mapping, and customer leads.

**Language**: German (UI labels, component names, comments)

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- **React 18** with Vite (no TypeScript)
- **Tailwind CSS** for styling with custom theme
- **Recharts** for data visualization
- **React-Leaflet** for maps (Konstanz region)
- **ReactFlow** for flow diagrams
- **Lucide React** for icons

### Application Structure

The app uses client-side view switching (no router). `App.jsx` manages view state and passes navigation callbacks to child components.

**Main Views** (in `src/components/`):
- `dashboard/` - KPI overview with tabs (Start, Kampagnen, News-Feed, Traffic)
- `marketing-flows/` - Lead Marketing flow editor with visual flow builder
- `leads/` - Lead management with list/detail views
- `produkt-mapping/` - Product availability mapping with geo-visualization
- `einstellung/` - Settings, integrations, sync logs

### Component Organization

**UI Component Library** (`src/components/ui/`):
- Exports from `index.js` - use barrel imports: `import { Button, Card, Tabs } from '../ui'`
- Base components: Button, Badge, Card, Input, Select, Toggle, Modal
- Data display: DataTable, KPICard, Avatar, Sparkline, StatusBadge
- Maps: GeoMap, DrawableGeoMap (Leaflet-based)

**Layout** (`src/components/layout/`):
- `MainLayout.jsx` - App shell with sidebar
- `Sidebar.jsx` - Navigation with collapsible state (persisted to localStorage)

### Styling System

**CSS Architecture** (`src/index.css`):
- Tailwind base/components/utilities layers
- View-specific CSS in `src/styles/views/`
- Custom properties in `src/styles/base.css`

**Theme** (`tailwind.config.js` and `src/theme/colors.js`):
- Brand colors: `swk-red` (#E2001A), `swk-blue` (#2358A1)
- Use `theme.colors` from `src/theme/colors.js` for JS (e.g., Recharts)
- Slate scale for neutrals

### Data Layer

**Mock Data** (`src/data/`):
- JSON files: `leads.json`, `closing.json`, `productCatalog.json`, `availability*.json`
- `mockData.js` aggregates JSON imports
- Flow-generated leads stored in localStorage (`swk:flow-leads`)

### Flow Editor System (`src/components/marketing-flows/structured-flow/`)

Custom visual flow builder (not ReactFlow-based):
- `StructuredFlowCanvas.jsx` - Main canvas component
- `FlowNode.jsx` - Node rendering with `nodeConfig` for node types
- `useFlowState.js` - Flow state management
- `useFlowHistory.js` - Undo/redo functionality
- `exampleFlows.js` - Pre-built flow templates

### Hooks

- `useLocalStorage.js` - Persistent state with JSON serialization
- `useToast.js` - Toast notification state

## Conventions

- Components use `.jsx` extension
- German naming for domain concepts (Lead, Kampagne, Einstellung)
- View components receive `showToast` prop for notifications
- Navigation between views uses callback props (`onNavigate`, `onNavigateToCampaign`, etc.)
