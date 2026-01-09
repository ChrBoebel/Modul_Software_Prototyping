import {
  RefreshCw,
  Settings,
  AlertCircle,
  Database,
  Cloud,
  Link2
} from 'lucide-react';
import { Button, Badge, StatusIndicator } from '../../ui';

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

  const getStatusIndicatorStatus = (status) => {
    const statusMap = {
      'connected': 'success',
      'error': 'danger',
      'warning': 'warning',
      'disconnected': 'neutral'
    };
    return statusMap[status] || 'neutral';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'connected': 'Verbunden',
      'error': 'Fehler',
      'warning': 'Warnung',
      'disconnected': 'Getrennt'
    };
    return labelMap[status] || 'Unbekannt';
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
                  <StatusIndicator
                    status={getStatusIndicatorStatus(integration.status)}
                    type="icon"
                  />
                </div>

                <p className="integration-description">{integration.description}</p>

                <div className="integration-status">
                  <div className="status-row">
                    <span className="label">Status:</span>
                    <Badge variant={getStatusIndicatorStatus(integration.status)}>
                      {getStatusLabel(integration.status)}
                    </Badge>
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
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={RefreshCw}
                    onClick={() => showToast(`${integration.name} synchronisieren`)}
                    ariaLabel={`${integration.name} synchronisieren`}
                  >
                    Sync
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    icon={Settings}
                    onClick={() => showToast(`${integration.name} konfigurieren`)}
                    ariaLabel={`${integration.name} konfigurieren`}
                  >
                    Konfigurieren
                  </Button>
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
