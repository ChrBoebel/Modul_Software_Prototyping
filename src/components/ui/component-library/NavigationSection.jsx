import { useState } from 'react';
import { Tabs } from '../Tabs';
import { ToggleGroup } from '../ToggleGroup';
import { ComponentSection, ComponentShowcase } from './shared';

const NavigationSection = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [toggleValue, setToggleValue] = useState('all');

  return (
    <ComponentSection
      title="Navigation"
      description="Tabs und Toggle-Gruppen für die Navigation."
    >
      <ComponentShowcase
        title="Tabs"
        code={`<Tabs
  tabs={[
    { id: 'tab1', label: 'Übersicht' },
    { id: 'tab2', label: 'Details' }
  ]}
  activeTab="tab1"
  onChange={(id) => setActiveTab(id)}
/>`}
      >
        <Tabs
          tabs={[
            { id: 'tab1', label: 'Übersicht' },
            { id: 'tab2', label: 'Details' },
            { id: 'tab3', label: 'Einstellungen' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="ToggleGroup"
        code={`<ToggleGroup
  options={[
    { value: 'all', label: 'Alle', count: 156 },
    { value: 'mine', label: 'Meine', count: 23 }
  ]}
  value="all"
  onChange={setValue}
/>`}
      >
        <ToggleGroup
          options={[
            { value: 'all', label: 'Alle Leads', count: 156 },
            { value: 'mine', label: 'Meine Leads', count: 23 }
          ]}
          value={toggleValue}
          onChange={setToggleValue}
        />
      </ComponentShowcase>
    </ComponentSection>
  );
};

export default NavigationSection;
