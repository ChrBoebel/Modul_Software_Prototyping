import { useState } from 'react';
import { Tabs } from '../ui';
import FlowKampagnenTab from './tabs/FlowKampagnenTab';
import FlowEditorTab from './tabs/FlowEditorTab';
import GlobaleWerteTab from './tabs/GlobaleWerteTab';

const TABS = [
  { id: 'kampagnen', label: 'Kampagnen' },
  { id: 'flow-editor', label: 'Flow-Editor' },
  { id: 'globale-werte', label: 'Globale Werte' }
];

const LMFlowsView = ({ showToast, onLeadCreated }) => {
  const [activeTab, setActiveTab] = useState('kampagnen');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleEditFlow = (campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab('flow-editor');
  };

  const handleCloseEditor = () => {
    setSelectedCampaign(null);
    setActiveTab('kampagnen');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'kampagnen':
        return <FlowKampagnenTab showToast={showToast} onEditFlow={handleEditFlow} />;
      case 'flow-editor':
        return (
          <FlowEditorTab
            key={selectedCampaign?.id || 'default-flow'}
            showToast={showToast}
            campaign={selectedCampaign}
            onClose={handleCloseEditor}
            onLeadCreated={onLeadCreated}
          />
        );
      case 'globale-werte':
        return <GlobaleWerteTab showToast={showToast} />;
      default:
        return <FlowKampagnenTab showToast={showToast} onEditFlow={handleEditFlow} />;
    }
  };

  return (
    <div className="view-container">
      <h1 className="sr-only">LM-Flows Editor</h1>
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel="LM-Flows Bereiche"
      />
      {renderTabContent()}
    </div>
  );
};

export default LMFlowsView;
