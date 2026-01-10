import { useCallback } from 'react';
import {
  RefreshCw,
  Settings,
  AlertCircle,
  Database,
  Cloud,
  Link2
} from 'lucide-react';
import { Button, Badge, StatusIndicator } from '../../ui';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

// Default integrations data
const defaultIntegrations = [
  {
    id: 'int-001',
    name: 'SAP CRM',
    type: 'CRM',
    description: 'Synchronisation von Kundendaten und Lead-Status',
    status: 'connected',
    lastSync: '2025-01-16 14:30',
    iconType: 'database'
  },
  {
    id: 'int-002',
    name: 'Microsoft Dynamics',
    type: 'ERP',
    description: 'Auftragsverwaltung und Rechnungsstellung',
    status: 'connected',
    lastSync: '2025-01-16 12:15',
    iconType: 'cloud'
  },
  {
    id: 'int-003',
    name: 'Mailchimp',
    type: 'Email',
    description: 'Newsletter-Marketing und Kampagnen-Sync',
    status: 'error',
    lastSync: '2025-01-15 08:00',
    error: 'API Key abgelaufen',
    iconType: 'link'
  }
];

const iconMap = {
  database: Database,
  cloud: Cloud,
  link: Link2
};

const IntegrationTab = ({ showToast }) => {
  // Use localStorage for integrations so Dashboard can read it
  const [integrations, setIntegrations] = useLocalStorage('swk:integrations', defaultIntegrations);

  // Handle sync - update lastSync timestamp
  const handleSync = useCallback((integrationId) => {
    const now = new Date().toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');

    setIntegrations(prev => prev.map(int =>
      int.id === integrationId
        ? { ...int, lastSync: now, status: 'connected', error: undefined }
        : int
    ));

    const integration = integrations.find(i => i.id === integrationId);
    showToast(`${integration?.name || 'Integration'} synchronisiert`);
  }, [integrations, setIntegrations, showToast]);

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
            const Icon = iconMap[integration.iconType] || Database;
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
                    onClick={() => handleSync(integration.id)}
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
