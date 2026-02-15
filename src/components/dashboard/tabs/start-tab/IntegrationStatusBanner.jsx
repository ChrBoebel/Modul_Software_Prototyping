import { AlertCircle, CheckCircle } from 'lucide-react';

const IntegrationStatusBanner = ({ integrationStatus, integrations, onNavigate, showToast }) => {
  if (!integrations.length) {
    return null;
  }

  return (
    <div
      className="card"
      style={{
        padding: '0.5rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: integrationStatus.hasError ? 'var(--danger-light)' : 'var(--success-light)',
        border: `1px solid ${integrationStatus.hasError ? 'var(--danger)' : 'var(--success)'}`,
        borderRadius: '6px',
        marginBottom: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {integrationStatus.hasError ? (
          <AlertCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
        ) : (
          <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
        )}
        <span style={{
          fontWeight: 600,
          fontSize: '0.75rem',
          color: integrationStatus.hasError ? 'var(--danger)' : 'var(--success)'
        }}>
          {integrationStatus.hasError
            ? `${integrationStatus.errorCount} Fehler`
            : `${integrationStatus.connectedCount}/${integrationStatus.total} verbunden`
          }
        </span>
      </div>
      <button
        type="button"
        style={{
          background: 'none',
          border: 'none',
          color: integrationStatus.hasError ? 'var(--danger)' : 'var(--success)',
          cursor: 'pointer',
          fontSize: '0.6875rem',
          fontWeight: 500,
          textDecoration: 'underline'
        }}
        onClick={() => {
          if (onNavigate) {
            onNavigate('einstellung');
          } else {
            showToast('Einstellungen öffnen');
          }
        }}
      >
        {integrationStatus.hasError ? 'Beheben' : 'Details'}
      </button>
    </div>
  );
};

export default IntegrationStatusBanner;
