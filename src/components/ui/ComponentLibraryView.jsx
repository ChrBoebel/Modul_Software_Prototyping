import { useState } from 'react';
import { Tabs } from './Tabs';
import {
  ButtonsSection,
  BadgesSection,
  CardsSection,
  TablesSection,
  KPIsSection,
  FormsSection,
  NavigationSection,
  FilterSection,
  FeedbackSection,
  LayoutSection,
  MapsSection
} from './component-library';

const SECTIONS = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'cards', label: 'Cards' },
  { id: 'tables', label: 'Tables' },
  { id: 'kpis', label: 'KPI Cards' },
  { id: 'forms', label: 'Formulare' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'filter', label: 'Filter' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'layout', label: 'Layout' },
  { id: 'maps', label: 'Maps' }
];

const ComponentLibraryView = () => {
  const [activeSection, setActiveSection] = useState('buttons');

  const renderSection = () => {
    switch (activeSection) {
      case 'buttons':
        return <ButtonsSection />;
      case 'badges':
        return <BadgesSection />;
      case 'cards':
        return <CardsSection />;
      case 'tables':
        return <TablesSection />;
      case 'kpis':
        return <KPIsSection />;
      case 'forms':
        return <FormsSection />;
      case 'navigation':
        return <NavigationSection />;
      case 'filter':
        return <FilterSection />;
      case 'feedback':
        return <FeedbackSection />;
      case 'layout':
        return <LayoutSection />;
      case 'maps':
        return <MapsSection />;
      default:
        return <ButtonsSection />;
    }
  };

  return (
    <div className="component-library-view">
      <header className="library-header">
        <h1>Component Library</h1>
        <p className="library-subtitle">UI Komponenten für das Aalen Design System</p>
      </header>

      <Tabs
        tabs={SECTIONS}
        activeTab={activeSection}
        onChange={setActiveSection}
        ariaLabel="Komponenten-Kategorien"
      />

      <div className="library-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default ComponentLibraryView;
