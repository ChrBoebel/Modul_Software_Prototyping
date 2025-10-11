import { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardView } from './components/views/DashboardView';
import { LiveMonitoringView } from './components/views/LiveMonitoringView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { FacilitiesView } from './components/views/FacilitiesView';
import { CustomersView } from './components/views/CustomersView';
import { FinanceView } from './components/views/FinanceView';
import { AlertsView } from './components/views/AlertsView';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { useTheme } from './hooks/useTheme';
import { mockData } from './data/mockData';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { toast, showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    showToast('Dashboard geladen');
  }, [showToast]);

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
    const viewNames = {
      dashboard: 'Dashboard',
      monitoring: 'Live Monitoring',
      analytics: 'Analytics',
      facilities: 'Anlagen',
      customers: 'Kunden',
      finance: 'Finanzen',
      alerts: 'Alarme'
    };
    showToast(viewNames[viewId]);
  };

  const handleAlertsClick = () => {
    setCurrentView('alerts');
    showToast('Alarme');
  };

  const handleKPIClick = (message) => {
    showToast(message);
  };

  const handleFacilityClick = (name) => {
    showToast(name);
  };

  const handleAddFacility = () => {
    showToast('Neue Anlage');
  };

  const handleAlertClick = (facility) => {
    showToast(facility);
  };

  const handleCustomerClick = (name) => {
    showToast(name);
  };

  const handleAddCustomer = () => {
    showToast('Neuer Kunde');
  };

  const handleInvoiceClick = (invoice) => {
    showToast(invoice);
  };

  const handleAddInvoice = () => {
    showToast('Neue Rechnung');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onKPIClick={handleKPIClick}
            onFacilityClick={handleFacilityClick}
            onAddFacility={handleAddFacility}
            onAlertClick={handleAlertClick}
          />
        );
      case 'monitoring':
        return <LiveMonitoringView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'facilities':
        return (
          <FacilitiesView
            onFacilityClick={handleFacilityClick}
            onAddFacility={handleAddFacility}
          />
        );
      case 'customers':
        return (
          <CustomersView
            onCustomerClick={handleCustomerClick}
            onAddCustomer={handleAddCustomer}
          />
        );
      case 'finance':
        return (
          <FinanceView
            onInvoiceClick={handleInvoiceClick}
            onAddInvoice={handleAddInvoice}
          />
        );
      case 'alerts':
        return <AlertsView onAlertClick={handleAlertClick} />;
      default:
        return (
          <DashboardView
            onKPIClick={handleKPIClick}
            onFacilityClick={handleFacilityClick}
            onAddFacility={handleAddFacility}
            onAlertClick={handleAlertClick}
          />
        );
    }
  };

  return (
    <>
      <MainLayout
        activeView={currentView}
        onViewChange={handleViewChange}
        theme={theme}
        onThemeToggle={toggleTheme}
        alertCount={mockData.alerts.length}
        onAlertsClick={handleAlertsClick}
      >
        {renderView()}
      </MainLayout>

      <Toast show={toast.show} message={toast.message} />
    </>
  );
}

export default App;
