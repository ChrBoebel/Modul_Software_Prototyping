import { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { UserManagementView } from './components/views/UserManagementView';
import { SettingsView } from './components/views/SettingsView';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';

// Lead Machine Phase Dashboards
import AwarenessOverview from './components/leadjourney/awareness/AwarenessOverview';
import CaptureOverview from './components/leadjourney/capture/CaptureOverview';
import NurturingOverview from './components/leadjourney/nurturing/NurturingOverview';
import QualificationOverview from './components/leadjourney/qualification/QualificationOverview';
import ClosingOverview from './components/leadjourney/closing/ClosingOverview';
import RetentionOverview from './components/leadjourney/retention/RetentionOverview';

const VIEW_NAMES = {
  awareness: 'Awareness - Traffic & Kampagnen',
  capture: 'Capture - Lead-Erfassung',
  nurturing: 'Nurturing - E-Mail & Automation',
  qualification: 'Qualification - Scoring & Pipeline',
  closing: 'Closing - Vertrieb & CRM',
  retention: 'Retention - Kundenbindung',
  users: 'Benutzerverwaltung',
  settings: 'Einstellungen'
};

function App() {
  const [currentView, setCurrentView] = useState('awareness');
  const { toast, showToast } = useToast();

  useEffect(() => {
    showToast('Lead Machine geladen');
  }, []);

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
    showToast(VIEW_NAMES[viewId] || viewId);
  };

  const renderView = () => {
    switch (currentView) {
      // Lead Machine Phases
      case 'awareness':
        return <AwarenessOverview showToast={showToast} />;
      case 'capture':
        return <CaptureOverview showToast={showToast} />;
      case 'nurturing':
        return <NurturingOverview showToast={showToast} />;
      case 'qualification':
        return <QualificationOverview showToast={showToast} />;
      case 'closing':
        return <ClosingOverview showToast={showToast} />;
      case 'retention':
        return <RetentionOverview showToast={showToast} />;

      // Administration
      case 'users':
        return <UserManagementView showToast={showToast} />;
      case 'settings':
        return <SettingsView showToast={showToast} />;

      default:
        return <AwarenessOverview showToast={showToast} />;
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
