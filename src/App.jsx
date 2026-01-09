import { useState } from 'react';
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
  const { toast, showToast } = useToast();

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
    showToast(VIEW_NAMES[viewId] || viewId);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView showToast={showToast} />;
      case 'lm-flows':
        return <LMFlowsView showToast={showToast} />;
      case 'leads':
        return <LeadsView showToast={showToast} />;
      case 'produkt-mapping':
        return <ProduktMappingView showToast={showToast} />;

      case 'einstellung':
        return <EinstellungView showToast={showToast} />;
      case 'component-library':
        return <ComponentLibraryView />;
      default:
        return <DashboardView showToast={showToast} />;
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
