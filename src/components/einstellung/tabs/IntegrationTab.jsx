import {
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  Cloud,
  Link2
} from 'lucide-react';

const IntegrationTab = ({ showToast }) => {
  // Mock integrations data
  const integrations = [
    {
      id: 'int-001',
      name: 'SAP CRM',
      type: 'CRM',
      description: 'Synchronisation von Kundendaten und Lead-Status',
      status: 'connected',
      lastSync: '2025-01-16 14:30',
      icon: Database
    },
    {
      id: 'int-002',
      name: 'Microsoft Dynamics',
      type: 'ERP',
      description: 'Auftragsverwaltung und Rechnungsstellung',
      status: 'connected',
      lastSync: '2025-01-16 12:15',
      icon: Cloud
    },
    {
      id: 'int-003',
      name: 'Mailchimp',
      type: 'Email',
      description: 'Newsletter-Marketing und Kampagnen-Sync',
      status: 'error',
      lastSync: '2025-01-15 08:00',
      error: 'API Key abgelaufen',
      icon: Link2
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return (
          <>
            <CheckCircle size={16} className="status-icon success" aria-hidden="true" />
            <span className="sr-only">Status: Verbunden</span>
          </>
        );
      case 'error':
        return (
          <>
            <XCircle size={16} className="status-icon danger" aria-hidden="true" />
            <span className="sr-only">Status: Fehler</span>
          </>
        );
      case 'warning':
        return (
          <>
            <AlertCircle size={16} className="status-icon warning" aria-hidden="true" />
            <span className="sr-only">Status: Warnung</span>
          </>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'connected': 'success',
      'error': 'danger',
      'warning': 'warning',
      'disconnected': 'neutral'
    };
    return statusMap[status] || 'neutral';
  };

  return (
    <div className="integration-tab">
      <h2 className="sr-only">Integrationen Verwaltung</h2>
      <div className="section">
        <div className="section-header">
          <h3>System-Integration</h3>
        </div>

        <div className="integration-cards-grid">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div key={integration.id} className="integration-card">
                <div className="integration-header">
                  <div className="integration-icon">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div className="integration-info">
                    <h4>{integration.name}</h4>
                    <span className="integration-type">{integration.type}</span>
                  </div>
                  {getStatusIcon(integration.status)}
                </div>

                <p className="integration-description">{integration.description}</p>

                <div className="integration-status">
                  <div className="status-row">
                    <span className="label">Status:</span>
                    <span className={`badge ${getStatusBadge(integration.status)}`}>
                      {integration.status === 'connected' ? 'Verbunden' :
                       integration.status === 'error' ? 'Fehler' : 'Getrennt'}
                    </span>
                  </div>
                  <div className="status-row">
                    <span className="label">Letzter Sync:</span>
                    <span className="value">{integration.lastSync}</span>
                  </div>
                  {integration.error && (
                    <div className="error-message" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      {integration.error}
                    </div>
                  )}
                </div>

                <div className="integration-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => showToast(`${integration.name} synchronisieren`)}
                    aria-label={`${integration.name} synchronisieren`}
                  >
                    <RefreshCw size={14} aria-hidden="true" />
                    Sync
                  </button>
                  <button
                    type="button"
                    className="btn btn-link btn-sm"
                    onClick={() => showToast(`${integration.name} konfigurieren`)}
                    aria-label={`${integration.name} konfigurieren`}
                  >
                    <Settings size={14} aria-hidden="true" />
                    Konfigurieren
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IntegrationTab;
