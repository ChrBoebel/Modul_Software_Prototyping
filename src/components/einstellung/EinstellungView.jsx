import { useState } from 'react';
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
      {/* Tab Navigation */}
      <div className="section-tabs" role="tablist" aria-label="Einstellungen Bereiche">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`section-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default EinstellungView;
