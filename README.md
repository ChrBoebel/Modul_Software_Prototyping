# SWK Admin Dashboard

Ein React-basiertes Admin-Dashboard für die Stadtwerke Konstanz (SWK) zur Verwaltung von Lead-Marketing-Flows, Produktverfügbarkeit und Kundenleads.

## Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Entwicklung](#entwicklung)
- [Projektstruktur](#projektstruktur)
- [Architektur](#architektur)
- [UX-Philosophie](#ux-philosophie)
- [Hauptbereiche](#hauptbereiche)
- [Komponenten-Bibliothek](#komponenten-bibliothek)
- [Styling](#styling)
- [Datenmanagement](#datenmanagement)

## Voraussetzungen

- Node.js 18+
- npm oder yarn

## Installation

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Entwicklung

| Befehl | Beschreibung |
|--------|--------------|
| `npm run dev` | Startet den Vite-Entwicklungsserver mit Hot Reload |
| `npm run build` | Erstellt einen optimierten Production-Build |
| `npm run preview` | Vorschau des Production-Builds |

## Projektstruktur

```
src/
├── components/
│   ├── dashboard/            # Dashboard-Ansicht mit KPIs und Tabs
│   │   └── tabs/
│   │       └── start-tab/    # Sub-Komponenten des Start-Tabs
│   ├── einstellung/          # Einstellungen und Integrationen
│   ├── layout/               # MainLayout und Sidebar
│   ├── leadjourney/          # Lead-Journey und Closing-Übersicht
│   ├── leads/                # Lead-Verwaltung
│   │   └── lead-detail/      # Sub-Komponenten der Lead-Detailansicht
│   ├── marketing-flows/      # Lead-Marketing Flow-Editor
│   │   ├── structured-flow/  # Visueller Flow-Builder
│   │   ├── tabs/
│   │   │   └── flow-editor/  # Sub-Komponenten des Flow-Editors
│   │   └── preview/          # Flow-Vorschau
│   ├── map/                  # Kartenkomponenten (Konstanz)
│   ├── produkt-mapping/      # Produktverfügbarkeit und Geo-Mapping
│   └── ui/                   # Wiederverwendbare UI-Komponenten
│       ├── component-library/ # Showcase-Sections der Component Library
│       └── drawable-geo-map/  # Sub-Komponenten der zeichenbaren Karte
├── data/                     # Mock-Daten (JSON)
├── hooks/                    # Custom React Hooks
├── styles/                   # CSS-Dateien nach Bereich
│   └── views/                # View-spezifische Styles
├── theme/                    # Farb- und Design-Tokens
├── utils/                    # Shared Hilfsfunktionen
├── App.jsx                   # Haupt-App mit View-Routing
├── main.jsx                  # React-Einstiegspunkt
└── index.css                 # CSS-Imports und Tailwind
```

## Architektur

### Tech-Stack

| Technologie | Verwendung |
|-------------|------------|
| React 18 | UI-Framework |
| Vite | Build-Tool und Dev-Server |
| Tailwind CSS | Utility-First Styling |
| Recharts | Datenvisualisierung (Charts) |
| React-Leaflet | Kartenintegration |
| Lucide React | Icon-Bibliothek |

### Navigationskonzept

Die Anwendung verwendet **Client-Side View Switching** ohne React Router. Die `App.jsx` verwaltet den aktuellen View-State und reicht Navigation-Callbacks an Kind-Komponenten weiter.

```jsx
// Navigation zwischen Views
const handleNavigate = (viewId, params) => {
  setCurrentView(viewId);
  setNavParams(params);
};
```

Views kommunizieren über Callback-Props:
- `onNavigate` - Allgemeine Navigation
- `onNavigateToCampaign` - Zur Kampagnen-Bearbeitung
- `onNavigateToLead` - Zur Lead-Detailansicht
- `onNavigateToProduktMapping` - Zur Verfügbarkeitsprüfung

### State Management

- **Lokaler Component State** für UI-Zustand
- **Prop Drilling** für View-übergreifende Daten
- **localStorage** für persistente Daten (z.B. Flow-generierte Leads unter `swk:flow-leads`)

## UX-Philosophie

Das Dashboard folgt etablierten UX-Prinzipien und Design-Philosophien, um eine effiziente und fehlertolerante Benutzeroberfläche zu gewährleisten.

### Design-Grundsätze

#### Datenvisualisierung nach Edward Tufte

Die Anwendung orientiert sich an den Prinzipien von Edward Tufte zur effektiven Datenvisualisierung:

**Data-Ink Ratio**: Maximierung des Informationsgehalts bei minimalem visuellen Aufwand. Unnötige Dekorationen werden vermieden, jedes visuelle Element dient der Informationsvermittlung.

**Sparklines**: Kleine, wortgrosse Grafiken direkt im Kontext der Daten. Die KPI-Cards integrieren Sparklines zur Trendvisualisierung ohne separate Chart-Bereiche zu erfordern.

```jsx
// KPICard mit integrierter Sparkline
<KPICard
  value="265"
  label="Besucher"
  sparklineData={[180, 220, 195, 240, 265]}
  trend={{ direction: 'up', value: '+12%' }}
/>
```

**Small Multiples**: Wiederholung gleicher Visualisierungstypen ermoeglicht schnellen Vergleich. Die KPI-Bar zeigt mehrere Metriken im identischen Format nebeneinander.

#### Stephen Few - Information Dashboard Design

**Contextual Information**: Jeder Datenpunkt wird mit Kontext versehen. Trends zeigen nicht nur den aktuellen Wert, sondern auch die Entwicklung (Pfeil, Prozentangabe, Sparkline).

**Progressive Disclosure**: Informationen werden schrittweise offenbart. Uebersichten zeigen aggregierte Daten, Details sind per Klick erreichbar.

| Ebene | Beispiel | Interaktion |
|-------|----------|-------------|
| Uebersicht | KPI-Cards im Dashboard | Sofort sichtbar |
| Details | Lead-Liste mit Filterung | Tab-Navigation |
| Einzelansicht | Lead-Detailseite | Klick auf Zeile |

### Feedback-Systeme

#### Benachrichtigungen

Die Anwendung verwendet ein mehrstufiges Feedback-System:

**Toast-Nachrichten**: Kurze, nicht-blockierende Benachrichtigungen fuer erfolgreiche Aktionen.

```jsx
showToast('Lead erfolgreich erstellt');
```

**Undo-Toast**: Erweiterte Benachrichtigung mit Rueckgaengig-Option fuer destruktive Aktionen. Beinhaltet:
- Fortschrittsbalken mit Countdown (8 Sekunden Standard)
- Pause bei Hover (verhindert versehentliches Verschwinden)
- Explizite Undo-Aktion

```jsx
showUndoToast({
  message: 'Regel geloescht',
  onUndo: () => restoreRule(rule),
  duration: 8000
});
```

**Typ-basierte Visualisierung**:

| Typ | Farbe | Verwendung |
|-----|-------|------------|
| success | Grün (`#16a34a`) | Erfolgreiche Aktionen |
| error | SWK Rot (`#E2001A`) | Fehlermeldungen |
| info | Blau (`#3b82f6`) | Informationen |
| warning | Orange (`#d97706`) | Warnungen |

#### Visuelle Zustaende

Jedes interaktive Element kommuniziert seinen Zustand visuell:

- **Default**: Grundzustand ohne Interaktion
- **Hover**: Leichte Hervorhebung bei Mausueber
- **Focus**: Deutlicher Fokusring fuer Tastaturnavigation
- **Active**: Gedrueckter Zustand
- **Disabled**: Ausgegraut, nicht interaktiv

```css
/* Focus-State mit Brand-Farbe */
select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}
```

### Fehlertoleranz und Reversibilitaet

#### Undo-Patterns

Destruktive Aktionen sind reversibel gestaltet:

1. **Soft Delete**: Loeschungen werden nicht sofort ausgefuehrt
2. **Zeitfenster**: 8 Sekunden Zeit fuer Rueckgaengig-Aktion
3. **Explizite Bestaetigung**: Bei kritischen Aktionen zusaetzliche Bestaetigung

#### Formular-Validierung

- Inline-Validierung waehrend der Eingabe
- Klare Fehlermeldungen am Eingabefeld
- Erhaltung eingegebener Daten bei Fehlern

### Accessibility (Barrierefreiheit)

Die Anwendung folgt WCAG 2.1 Richtlinien:

#### Semantisches HTML

```jsx
// Korrekte ARIA-Attribute
<div
  role="dialog"
  aria-modal="true"
  aria-label={title}
>
```

#### Tastaturnavigation

Alle interaktiven Elemente sind per Tastatur erreichbar:

| Taste | Funktion |
|-------|----------|
| Tab | Zum naechsten Element |
| Shift+Tab | Zum vorherigen Element |
| Enter/Space | Element aktivieren |
| Escape | Modal/Overlay schliessen |

```jsx
// Keyboard-Support fuer klickbare Karten
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
>
```

#### Screen Reader Support

- `aria-live="polite"` fuer dynamische Inhalte (Toasts)
- `aria-hidden="true"` fuer dekorative Icons
- `sr-only` Klasse fuer Screen-Reader-only Texte

```jsx
<h1 className="sr-only">Marketing-Flows Editor</h1>
<Icon size={20} aria-hidden="true" />
```

#### Farbkontrast

Die Farbpalette gewaehrleistet ausreichenden Kontrast:

- Text auf Hintergrund: Mindestens 4.5:1
- Grosse Texte (h1, h2): Mindestens 3:1
- Interaktive Elemente: Deutlich erkennbar

### Responsive Design

#### Mobile-First Ansatz

Die Sidebar passt sich der Bildschirmgroesse an:

- **Desktop** (> 768px): Fixierte Sidebar, 280px Breite
- **Tablet**: Collapsible Sidebar, 72px minimiert
- **Mobile** (< 768px): Overlay-Sidebar mit Hamburger-Menu

```jsx
// Sidebar-Zustand wird persistiert
useEffect(() => {
  localStorage.setItem('sidebar-collapsed', collapsed);
  document.documentElement.style.setProperty(
    '--sidebar-current-width',
    collapsed ? '72px' : '280px'
  );
}, [collapsed]);
```

#### Flexible Layouts

- CSS Grid fuer Dashboard-Layouts
- Flexbox fuer Komponenten-Anordnung
- Relative Einheiten (rem, %) statt fixer Pixel

### Konsistenz

#### Komponenten-Varianten

Jede Komponente bietet konsistente Varianten:

```jsx
// Button-Varianten
<Button variant="primary">Hauptaktion</Button>
<Button variant="secondary">Sekundaer</Button>
<Button variant="danger">Loeschen</Button>
<Button variant="link">Link-Style</Button>
```

#### Einheitliche Interaktionsmuster

| Aktion | Pattern |
|--------|---------|
| Oeffnen | Klick auf Element |
| Schliessen | X-Button oder Escape |
| Bestaetigen | Primaerer Button rechts |
| Abbrechen | Sekundaerer Button links |
| Loeschen | Danger-Button mit Bestaetigung |

#### Spacing und Groessen

Konsistente Abstufungen basierend auf 4px-Grid:

| Token | Wert | Verwendung |
|-------|------|------------|
| `--radius-sm` | 4px | Kleine Elemente |
| `--radius-md` | 8px | Standard |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Modals |

### Informationsarchitektur

#### Visuelle Hierarchie

Die Typografie schafft klare Hierarchien:

| Ebene | Stil | Beispiel |
|-------|------|----------|
| H1 | 40px, Black (900) | Seitentitel |
| H2 | 24px, Bold (700) | Abschnittstitel |
| H3 | 18px, Bold (700) | Card-Header |
| Body | 16px, Light (300) | Fliesstext |
| Small | 14px, Regular | Metadaten |

#### Navigation

Klare Navigationshierarchie:

1. **Primaer**: Sidebar mit Hauptbereichen
2. **Sekundaer**: Tabs innerhalb von Views
3. **Tertiaer**: Inline-Links und Aktionen

#### Leere Zustaende

Jede Datenliste zeigt einen informativen leeren Zustand:

```jsx
<DataTable
  data={[]}
  emptyMessage="Keine Leads vorhanden"
/>
```

## Hauptbereiche

### Dashboard (`/components/dashboard/`)

Übersichtsseite mit KPIs und Metriken.

**Tabs:**
- Start - Hauptübersicht mit KPI-Cards
- Kampagnen - Kampagnen-Performance
- News-Feed - Aktivitäten und Updates
- Traffic - Besucherstatistiken

### Marketing-Flows (`/components/marketing-flows/`)

Visueller Editor für Lead-Marketing-Flows.

**Tabs:**
- Kampagnen - Übersicht aller Flow-Kampagnen
- Flow-Editor - Visueller Flow-Builder
- Globale Werte - Übergreifende Konfiguration

**Flow-Editor System (`structured-flow/`):**

| Datei | Funktion |
|-------|----------|
| `StructuredFlowCanvas.jsx` | Haupt-Canvas für Flow-Visualisierung |
| `FlowNode.jsx` | Rendering einzelner Nodes mit Konfiguration |
| `FlowConnector.jsx` | Verbindungslinien zwischen Nodes |
| `useFlowHistory.js` | State-Management mit Undo/Redo |
| `QuickAddMenu.jsx` | Kontextmenü zum Hinzufügen von Nodes |
| `exampleFlows.js` | Vordefinierte Flow-Templates |

### Leads (`/components/leads/`)

Verwaltung von Kundenleads.

- `LeadsView.jsx` - Container mit Filterung
- `LeadsList.jsx` - Tabellarische Übersicht
- `LeadDetail.jsx` - Detailansicht eines Leads

### Produkt-Mapping (`/components/produkt-mapping/`)

Verwaltung der Produktverfügbarkeit nach geografischen Regionen.

**Tabs:**
- Map-Overview - Kartenbasierte Übersicht
- Adress-Check - Verfügbarkeitsprüfung pro Adresse
- Adress-Mapping - Zuordnung von Adressen
- Produktkatalog - Produktübersicht
- Mapping-Regeln - Logik-Konfiguration

### Einstellung (`/components/einstellung/`)

Systemkonfiguration und Integrationen.

- Integration - Externe Systeme anbinden
- Sync-Protokoll - Synchronisations-Logs

## Komponenten-Bibliothek

Alle wiederverwendbaren UI-Komponenten befinden sich in `src/components/ui/` und werden über `index.js` exportiert.

### Import-Konvention

```jsx
// Barrel-Import verwenden
import { Button, Card, Tabs, Modal } from '../ui';
```

### Verfügbare Komponenten

**Basis-Elemente:**
- `Button` - Buttons mit Varianten (primary, secondary, danger)
- `Badge` - Status-Labels
- `Card`, `CardHeader`, `CardBody`, `CardFooter` - Karten-Layout

**Formulare:**
- `Input` - Textfelder
- `Select` - Dropdowns
- `TextArea` - Mehrzeilige Eingabe
- `Toggle` - Schalter
- `Checkbox` - Checkboxen
- `SearchBox` - Suchfeld mit Icon

**Daten-Anzeige:**
- `DataTable` - Tabellenkomponente
- `KPICard`, `KPIBar` - KPI-Visualisierung
- `Avatar` - Benutzer-Avatar
- `StatusIndicator` - Status-Anzeige
- `ScoreBadge`, `StatusBadge` - Bewertungs-Badges
- `Sparkline`, `SparkBar` - Mini-Charts

**Navigation und Feedback:**
- `Tabs`, `TabPanel` - Tab-Navigation
- `ToggleGroup` - Button-Gruppe
- `Toast` - Benachrichtigungen
- `Modal` - Dialoge
- `Panel` - Seitenpanel
- `Tooltip`, `TooltipButton` - Tooltips

**Filter und Auswahl:**
- `FilterChip`, `FilterChipGroup` - Filter-Chips
- `ProductGroupSelector` - Produktgruppen-Auswahl
- `CollapsibleSection`, `CollapsibleCard` - Aufklappbare Bereiche

**Karten:**
- `GeoMap` - Leaflet-Karte (nur Anzeige)
- `DrawableGeoMap` - Karte mit Zeichenfunktion

## Styling

### CSS-Architektur

Die Anwendung kombiniert Tailwind CSS mit benutzerdefinierten CSS-Dateien.

```css
/* src/index.css - Import-Reihenfolge */
@import "tailwindcss/base";
@import "./styles/tokens.css"; /* generiert aus src/theme/designTokens.js */
@import "./styles/base.css";

@import "tailwindcss/components";
@import "./styles/components.css";
@import "./styles/layout.css";
@import "./styles/views/content-types.css";
@import "./styles/views/analytics.css";
@import "./styles/views/leads.css";
@import "./styles/views/dashboard.css";
@import "./styles/views/flow.css";
@import "./styles/views/cards.css";
@import "./styles/views/journey.css";
@import "./styles/views/timeline.css";
@import "./styles/views/settings.css";
@import "./styles/views/library.css";
@import "./styles/views/mapping.css";

@import "tailwindcss/utilities";
@import "./styles/utilities.css";
@import "./styles/vendor.css";
```

### Farbschema

Alle Design-Entscheidungen (Farben, Typografie, Radius, Shadows, Layout, Motion, Produktpaletten) liegen zentral in:

- `src/theme/designTokens.js`

Darauf basieren:

- `tailwind.config.js` (Tailwind Theme)
- `src/styles/tokens.css` (generierte CSS-Variablen für alle Stylesheets)
- `src/theme/colors.js` und `src/theme/productColors.js` (kompatible JS-Wrapper)

Die CSS-Variablen werden automatisch vor `dev/build/preview` generiert. Manuell geht es mit:

```bash
npm run tokens:build
```

| Farbe | Hex | Verwendung |
|-------|-----|------------|
| SWK Rot | `#E2001A` | Primärfarbe, CTAs |
| SWK Blau | `#2358A1` | Akzentfarbe, Links |
| Success | `#16a34a` | Erfolgs-Anzeigen |
| Warning | `#d97706` | Warnungen |
| Danger | `#dc2626` | Fehler, destruktive Aktionen |
| Slate Scale | `#f8fafc` - `#0f172a` | Neutrale Grautöne |

**Verwendung in JavaScript (z.B. Recharts):**

```jsx
import { theme, chartColors } from '../theme/colors';

// Einzelne Farbe
const primaryColor = theme.colors.primary;

// Chart-Palette
const colors = chartColors.main;
```

### Schriftart

Die Anwendung verwendet die Schriftart **Outfit** mit folgenden Größen:
- `h1`: 40px, 900 weight
- `h2`: 24px, 700 weight
- `h3`: 18px, 700 weight

## Datenmanagement

### Mock-Daten

Alle Testdaten befinden sich in `src/data/` als JSON-Dateien:

| Datei | Inhalt |
|-------|--------|
| `leads.json` | Lead-Datensätze mit Flows und Status-Optionen |
| `closing.json` | Abschluss- und Vertriebsdaten |
| `productCatalog.json` | Produktkatalog |
| `availability.json` | Verfügbarkeitsdaten pro Adresse |
| `availabilityRules.json` | Regeln für Produktverfügbarkeit |
| `availabilityStatus.json` | Status-Definitionen |
| `addresses.json` | Adressdaten |
| `konstanzStreets.json` | Straßenverzeichnis Konstanz |
| `defaultIntegrations.json` | Standard-Integrationen (SAP, Dynamics, Mailchimp) |
| `users.json` | Benutzerdaten |
| `settings.json` | Anwendungseinstellungen |

### Persistenz

Flow-generierte Leads werden im localStorage gespeichert:

```jsx
// Schlüssel: swk:flow-leads
const STORAGE_KEY = 'swk:flow-leads';
```

Der Custom Hook `useLocalStorage` vereinfacht die Arbeit mit persistenten Daten:

```jsx
import { useLocalStorage } from '../hooks/useLocalStorage';

const [data, setData, { reset }] = useLocalStorage('key', defaultValue);
```

## Shared Utilities

Wiederverwendbare Hilfsfunktionen in `src/utils/`:

| Datei | Funktion |
|-------|----------|
| `leadUtils.js` | `transformLead()`, `getProduktName()`, `getQualityStatus()`, `formatTimestamp()` |
| `statusUtils.js` | `getCampaignStatusVariant()`, `getLeadQualityBadge()` |
| `addressParser.js` | `parseCustomerAddress()` - Parst Kunden-Adressen aus verschiedenen Formaten |

## Konventionen

- **Dateiendung**: `.jsx` für React-Komponenten
- **Sprache**: Deutsche Bezeichnungen für Domain-Konzepte (Lead, Kampagne, Einstellung)
- **Props**: Views erhalten `showToast` für Benachrichtigungen
- **Navigation**: Callback-Props für View-Wechsel
- **Styling**: Tailwind-Klassen bevorzugt, Custom CSS nur bei Bedarf
- **Komponenten-Aufteilung**: Dateien sollen unter ~400 Zeilen bleiben, große Komponenten werden in Sub-Komponenten in eigenen Unterordnern aufgeteilt
- **Shared Logic**: Duplizierter Code wird in `src/utils/` oder `src/data/` zentralisiert
