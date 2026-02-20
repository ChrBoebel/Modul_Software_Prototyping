import { useCallback, useMemo } from 'react';
import {
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button, Badge, StatusIndicator, Avatar } from '../../ui';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import defaultIntegrations from '../../../data/defaultIntegrations.json';


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

  const getHealthTone = (score) => {
    if (score >= 80) return 'bg-[var(--swk-blue-light)] text-[var(--secondary)]';
    if (score >= 50) return 'bg-[var(--slate-100)] text-[var(--slate-600)]';
    return 'bg-[var(--primary-light)] text-[var(--primary)]';
  };

  // Calculate health summary
  const healthSummary = useMemo(() => {
    const connected = integrations.filter(i => i.status === 'connected').length;
    const errors = integrations.filter(i => i.status === 'error').length;
    const total = integrations.length;

    // Find most recent sync
    const lastSync = integrations
      .filter(i => i.lastSync)
      .sort((a, b) => b.lastSync.localeCompare(a.lastSync))[0]?.lastSync || '-';

    const healthPercent = total > 0 ? Math.round((connected / total) * 100) : 0;

    return { connected, errors, total, lastSync, healthPercent };
  }, [integrations]);

  return (
    <div className="integration-tab">
      <h2 className="sr-only">Integrationen Verwaltung</h2>

      {/* Health Dashboard */}
      <div className="section mb-6">
        <div className="section-header">
          <h3>Integration Health</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-white rounded-[var(--radius-lg)] p-4 border border-[var(--slate-200)]">
          {/* Health Score - Uses SWK brand colors */}
          <div className="flex flex-col items-center p-3 xl:border-r xl:border-[var(--slate-100)]">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getHealthTone(healthSummary.healthPercent)}`}
            >
              <span className="text-base font-bold">
                {healthSummary.healthPercent}%
              </span>
            </div>
            <span className="text-[0.6875rem] text-[var(--text-tertiary)] font-medium">
              Health Score
            </span>
          </div>

          {/* Connected - Uses SWK Blue */}
          <div className="flex items-center gap-3 p-3 xl:border-r xl:border-[var(--slate-100)]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--swk-blue-light)]">
              <CheckCircle size={20} className="text-[var(--secondary)]" />
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--secondary)]">
                {healthSummary.connected}
              </div>
              <span className="text-[0.6875rem] text-[var(--text-tertiary)]">Verbunden</span>
            </div>
          </div>

          {/* Errors - Uses SWK Red */}
          <div className="flex items-center gap-3 p-3 xl:border-r xl:border-[var(--slate-100)]">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${healthSummary.errors > 0 ? 'bg-[var(--primary-light)]' : 'bg-[var(--slate-50)]'}`}>
              <XCircle size={20} className={healthSummary.errors > 0 ? 'text-[var(--primary)]' : 'text-[var(--slate-400)]'} />
            </div>
            <div>
              <div className={`text-xl font-bold ${healthSummary.errors > 0 ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}>
                {healthSummary.errors}
              </div>
              <span className="text-[0.6875rem] text-[var(--text-tertiary)]">Fehler</span>
            </div>
          </div>

          {/* Last Sync */}
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--slate-50)]">
              <Clock size={20} className="text-[var(--slate-500)]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                {healthSummary.lastSync.split(' ')[1] || healthSummary.lastSync}
              </div>
              <span className="text-[0.6875rem] text-[var(--text-tertiary)]">Letzter Sync</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3>System-Integration</h3>
        </div>

        <div className="integration-cards-grid">
          {integrations.map((integration) => {
            return (
              <div key={integration.id} className="integration-card">
                <div className="integration-header">
                  <Avatar name={integration.name} size="md" usePlaceholder type="company" />
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
