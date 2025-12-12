import { useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import LeadsList from './LeadsList';
import LeadDetail from './LeadDetail';
import ClosingOverview from '../leadjourney/closing/ClosingOverview';

const TABS = [
  { id: 'liste', label: 'Lead-Liste', icon: Users },
  { id: 'pipeline', label: 'Pipeline / Closing', icon: TrendingUp }
];

const LeadsView = ({ showToast }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('liste');

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
  };

  const handleCloseLead = () => {
    setSelectedLead(null);
  };

  return (
    <div className="view-container leads-view">
      <h1 className="sr-only">Leads Verwaltung</h1>
      {/* Tab Navigation */}
      <div className="section-tabs" role="tablist" aria-label="Leads Bereiche">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`section-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'liste' && (
        <div className={`leads-container ${selectedLead ? 'with-detail' : ''}`}>
          {/* Leads List */}
          <div className="leads-list-panel">
            <LeadsList
              showToast={showToast}
              onSelectLead={handleSelectLead}
              selectedLeadId={selectedLead?.id}
            />
          </div>

          {/* Lead Detail Panel */}
          {selectedLead && (
            <div className="lead-detail-panel">
              <LeadDetail
                lead={selectedLead}
                showToast={showToast}
                onClose={handleCloseLead}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'pipeline' && (
        <ClosingOverview showToast={showToast} />
      )}
    </div>
  );
};

export default LeadsView;
