import { AlertCircle, Info, CheckCircle, X, Check } from 'lucide-react';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60);

  if (diff < 1) return 'Gerade eben';
  if (diff < 60) return `vor ${diff} Min.`;
  if (diff < 1440) return `vor ${Math.floor(diff / 60)} Std.`;
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const AlertsList = ({ alerts, onAlertClick }) => {
  const severityConfig = {
    high: {
      color: 'var(--danger)',
      label: 'Kritisch',
      icon: AlertCircle,
      dotColor: 'var(--danger)'
    },
    medium: {
      color: 'var(--warning)',
      label: 'Warnung',
      icon: AlertCircle,
      dotColor: 'var(--warning)'
    },
    low: {
      color: 'var(--success)',
      label: 'Erfolgreich',
      icon: CheckCircle,
      dotColor: 'var(--success)'
    },
    info: {
      color: 'var(--primary)', // Use primary (red) or a specific info color if defined
      label: 'Info',
      icon: Info,
      dotColor: 'var(--primary)'
    }
  };

  const handleDismiss = (e, alertId) => {
    e.stopPropagation();
    console.log('Dismiss alert:', alertId);
  };

  const handleAcknowledge = (e, alertId) => {
    e.stopPropagation();
    console.log('Acknowledge alert:', alertId);
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Aktuelle Alarme</span>
        <span className="alert-count">{alerts.length} Alarme</span>
      </div>
      <div className="alerts-container">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity] || severityConfig.low;
          const Icon = cfg.icon;

          return (
            <div
              key={alert.id}
              className="alert-card"
              onClick={() => onAlertClick(alert.facility)}
            >
              <div className="alert-indicator">
                <span className="status-dot" style={{ backgroundColor: cfg.dotColor }}></span>
              </div>

              <div className="alert-content">
                <div className="alert-header">
                  <div className="alert-icon-wrapper" style={{ color: cfg.color }}>
                    <Icon size={18} />
                  </div>
                  <span className="severity-label" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <span className="alert-facility-name">{alert.facility}</span>
                </div>

                <div className="alert-message">{alert.message}</div>

                <div className="alert-footer">
                  <span className="alert-timestamp">{formatTime(alert.timestamp)}</span>
                  <div className="alert-actions">
                    <button
                      className="alert-action-btn dismiss"
                      onClick={(e) => handleDismiss(e, alert.id)}
                      title="Ignorieren"
                    >
                      <X size={14} />
                    </button>
                    <button
                      className="alert-action-btn acknowledge"
                      onClick={(e) => handleAcknowledge(e, alert.id)}
                      title="Bestätigen"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
