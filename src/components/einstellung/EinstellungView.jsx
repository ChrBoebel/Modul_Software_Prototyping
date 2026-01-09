import { useState } from 'react';
import { Tabs } from '../ui';
import IntegrationTab from './tabs/IntegrationTab';
import SyncProtokollTab from './tabs/SyncProtokollTab';

const TABS = [
  { id: 'integration', label: 'Integration' },
  { id: 'sync-protokoll', label: 'Sync-Protokoll' }
];

const EinstellungView = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('integration');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'integration':
        return <IntegrationTab showToast={showToast} />;
      case 'sync-protokoll':
        return <SyncProtokollTab showToast={showToast} />;
      default:
        return <IntegrationTab showToast={showToast} />;
    }
  };

  return (
    <div className="view-container">
      <h1 className="sr-only">Einstellungen</h1>
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel="Einstellungen Bereiche"
      />
      {renderTabContent()}
    </div>
  );
};

export default EinstellungView;
