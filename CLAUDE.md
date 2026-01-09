# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SWK Admin Dashboard - A React-based admin dashboard for Stadtwerke Konstanz (German utility company). The interface is in German.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- **React 18** with Vite
- **Tailwind CSS v3** for styling (migrated from custom CSS)
- **Recharts** for data visualization
- **ReactFlow** for flow diagram editing
- **Lucide React** for icons

### Application Structure

The app uses a single-page architecture with view-based routing managed by React state (no router library):

```
App.jsx                     # Root - manages currentView state
├── MainLayout              # Shell with sidebar + mobile header
│   └── Sidebar             # Navigation with tenant switcher
└── Views                   # Content area based on currentView
    ├── DashboardView       # KPIs, campaigns, traffic analytics
    ├── LMFlowsView         # Lead Management flow editor
    ├── LeadsView           # Lead list and detail management
    ├── ProduktMappingView  # Product availability/mapping rules
    ├── EinstellungView     # Settings and integrations
    └── ComponentLibraryView # Internal UI component showcase
```

### Key Patterns

**View Components** (`src/components/{view-name}/{ViewName}View.jsx`):
- Each view manages its own tab state via `useState`
- Views receive `showToast` prop for notifications
- Tab content rendered via switch statement in `renderTabContent()`

**UI Component Library** (`src/components/ui/`):
- Reusable components exported from `src/components/ui/index.js`
- Import pattern: `import { Button, Card, Tabs } from '../ui'`
- Components: Button, Badge, Card, Tabs, DataTable, KPICard, Modal, Panel, Input, Select, Toggle, etc.

**Flow Editor** (`src/components/lm-flows/structured-flow/`):
- Custom tree-based flow visualization (not using ReactFlow's default layout)
- `StructuredFlowCanvas` - Pannable/zoomable canvas with recursive node rendering
- `FlowNode` - Individual node component with actions
- `useFlowState` - State management hook for flow operations

### Theming

**Brand Colors** (SWK):
- Primary: `#E2001A` (SWK Red)
- Accent: `#2358A1` (SWK Blue)
- Defined in `tailwind.config.js` and `src/theme/colors.js`

**Color usage**:
- Use Tailwind classes: `bg-primary`, `text-swk-blue`, `bg-slate-100`
- For Recharts/JS: import from `src/theme/colors.js`

### Data Layer

Static JSON data in `src/data/`:
- `leads.json`, `productCatalog.json`, `availabilityRules.json`, etc.
- No backend - data is imported directly into components
