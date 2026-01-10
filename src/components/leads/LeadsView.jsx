import { useState, useEffect, useMemo } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { Tabs } from '../ui';
import LeadsList from './LeadsList';
import LeadDetail from './LeadDetail';
import ClosingOverview from '../leadjourney/closing/ClosingOverview';
import leadsData from '../../data/leads.json';
import { transformLead } from '../../utils/leadUtils';

const TABS = [
  { id: 'liste', label: 'Lead-Liste', icon: Users },
  { id: 'pipeline', label: 'Pipeline / Closing', icon: TrendingUp }
];

const LeadsView = ({ showToast, initialLeadId, flowLeads = [], onNavigateToCampaign }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('liste');

  // Transform all leads for lookup (merge JSON data with flow-generated leads)
  const allLeads = useMemo(() => {
    const jsonLeads = leadsData.leads.map(transformLead);
    const transformedFlowLeads = flowLeads.map(transformLead);
    return [...transformedFlowLeads, ...jsonLeads];
  }, [flowLeads]);

  // Auto-select lead when initialLeadId is provided
  useEffect(() => {
    if (initialLeadId) {
      const lead = allLeads.find(l => l.id === initialLeadId);
      if (lead) {
        setSelectedLead(lead);
        setActiveTab('liste'); // Ensure we're on the list tab
      }
    }
  }, [initialLeadId, allLeads]);

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
  };

  const handleCloseLead = () => {
    setSelectedLead(null);
  };

  return (
    <div className="view-container leads-view">
      <h1 className="sr-only">Leads Verwaltung</h1>
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel="Leads Bereiche"
      />

      {activeTab === 'liste' && (
        <div className={`leads-container ${selectedLead ? 'with-detail' : ''}`}>
          {/* Leads List */}
          <div className="leads-list-panel">
            <LeadsList
              showToast={showToast}
              onSelectLead={handleSelectLead}
              selectedLeadId={selectedLead?.id}
              flowLeads={flowLeads}
            />
          </div>

          {/* Lead Detail Panel */}
          {selectedLead && (
            <>
              <div
                className="lead-detail-backdrop"
                onClick={handleCloseLead}
                aria-hidden="true"
              />
              <div className="lead-detail-panel">
                <LeadDetail
                  lead={selectedLead}
                  showToast={showToast}
                  onClose={handleCloseLead}
                  onNavigateToCampaign={onNavigateToCampaign}
                />
              </div>
            </>
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
