import { useState, useCallback, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';

// New Views
import DashboardView from './components/dashboard/DashboardView';
import LMFlowsView from './components/lm-flows/LMFlowsView';
import LeadsView from './components/leads/LeadsView';
import EinstellungView from './components/einstellung/EinstellungView';
import ComponentLibraryView from './components/ui/ComponentLibraryView';
import ProduktMappingView from './components/produkt-mapping/ProduktMappingView';

// LocalStorage key for dynamically created leads
const STORAGE_KEY = 'swk:flow-leads';


const VIEW_NAMES = {
  dashboard: 'Dashboard',
  'lm-flows': 'LM-Flows',
  leads: 'Leads',
  'produkt-mapping': 'Produkt-Mapping',

  einstellung: 'Einstellung',
  'component-library': 'Component Library'
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [navParams, setNavParams] = useState({});
  const { toast, showToast } = useToast();

  // Flow-generated leads stored in localStorage
  const [flowLeads, setFlowLeads] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist flow leads to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowLeads));
  }, [flowLeads]);

  // Handle new lead created from flow
  const handleLeadCreated = useCallback((newLead) => {
    setFlowLeads(prev => [newLead, ...prev]);
    showToast(`Lead ${newLead.leadNumber} erstellt (Score: ${newLead.qualification?.score || 0})`);
  }, [showToast]);

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
    setNavParams({}); // Clear params when using sidebar navigation
    showToast(VIEW_NAMES[viewId] || viewId);
  };

  // Navigate to a view with optional parameters
  const handleNavigate = useCallback((viewId, params = {}) => {
    setCurrentView(viewId);
    setNavParams(params);
    // Don't show toast for programmatic navigation
  }, []);

  // Navigate directly to a specific lead (used after lead creation in flow)
  const handleNavigateToLead = useCallback((leadId) => {
    setCurrentView('leads');
    setNavParams({ leadId });
  }, []);

  // Navigate to campaign editor (used from lead detail)
  const handleNavigateToCampaign = useCallback((flowId) => {
    setCurrentView('lm-flows');
    setNavParams({ campaignId: flowId });
  }, []);

  // Navigate to Produkt-Mapping with address for availability check
  const handleNavigateToProduktMapping = useCallback((address) => {
    setCurrentView('produkt-mapping');
    setNavParams({ checkAddress: address });
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView showToast={showToast} onNavigate={handleNavigate} flowLeads={flowLeads} />;
      case 'lm-flows':
        return <LMFlowsView showToast={showToast} initialCampaignId={navParams.campaignId} onLeadCreated={handleLeadCreated} onNavigateToLead={handleNavigateToLead} />;
      case 'leads':
        return <LeadsView showToast={showToast} initialLeadId={navParams.leadId} initialSourceFilter={navParams.sourceFilter} flowLeads={flowLeads} onNavigateToCampaign={handleNavigateToCampaign} onNavigateToProduktMapping={handleNavigateToProduktMapping} />;
      case 'produkt-mapping':
        return <ProduktMappingView showToast={showToast} onLeadCreated={handleLeadCreated} onNavigateToLead={handleNavigateToLead} />;

      case 'einstellung':
        return <EinstellungView showToast={showToast} />;
      case 'component-library':
        return <ComponentLibraryView />;
      default:
        return <DashboardView showToast={showToast} onNavigate={handleNavigate} flowLeads={flowLeads} />;
    }
  };

  return (
    <>
      <MainLayout
        activeView={currentView}
        onViewChange={handleViewChange}
      >
        {renderView()}
      </MainLayout>

      <Toast show={toast.show} message={toast.message} />
    </>
  );
}

export default App;
