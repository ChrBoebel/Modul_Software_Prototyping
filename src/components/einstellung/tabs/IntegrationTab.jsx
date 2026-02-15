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
import { theme } from '../../../theme/colors';
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
      <div className="section" style={{ marginBottom: '1.5rem' }}>
        <div className="section-header">
          <h3>Integration Health</h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          border: '1px solid var(--slate-200)'
        }}>
          {/* Health Score - Uses SWK brand colors */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.75rem',
            borderRight: '1px solid var(--slate-100)'
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: healthSummary.healthPercent >= 80
                ? theme.colors.secondaryLight
                : healthSummary.healthPercent >= 50
                  ? theme.colors.slate100
                  : theme.colors.primaryLight,
              marginBottom: '0.5rem'
            }}>
              <span style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: healthSummary.healthPercent >= 80
                  ? theme.colors.secondary
                  : healthSummary.healthPercent >= 50
                    ? theme.colors.slate600
                    : theme.colors.primary
              }}>
                {healthSummary.healthPercent}%
              </span>
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Health Score
            </span>
          </div>

          {/* Connected - Uses SWK Blue */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            borderRight: '1px solid var(--slate-100)'
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.secondaryLight
            }}>
              <CheckCircle size={20} color={theme.colors.secondary} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: theme.colors.secondary }}>
                {healthSummary.connected}
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Verbunden</span>
            </div>
          </div>

          {/* Errors - Uses SWK Red */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            borderRight: '1px solid var(--slate-100)'
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: healthSummary.errors > 0 ? theme.colors.primaryLight : 'var(--slate-50)'
            }}>
              <XCircle size={20} color={healthSummary.errors > 0 ? theme.colors.primary : 'var(--slate-400)'} />
            </div>
            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: healthSummary.errors > 0 ? theme.colors.primary : 'var(--text-secondary)'
              }}>
                {healthSummary.errors}
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Fehler</span>
            </div>
          </div>

          {/* Last Sync */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem'
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--slate-50)'
            }}>
              <Clock size={20} color="var(--slate-500)" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {healthSummary.lastSync.split(' ')[1] || healthSummary.lastSync}
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Letzter Sync</span>
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
