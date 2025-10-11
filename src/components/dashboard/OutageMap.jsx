export const OutageMap = ({ data }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#FD951F';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'high': return 'Schwer';
      case 'medium': return 'Mittel';
      case 'low': return 'Gering';
      default: return severity;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Störungskarte</span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {data.length} aktive
        </span>
      </div>
      <div className="outage-map-compact">
        {data.map((outage) => (
          <div key={outage.id} className="outage-compact-card">
            <div className="outage-compact-indicator">
              <div
                className="status-dot"
                style={{
                  background: getSeverityColor(outage.severity),
                  width: '10px',
                  height: '10px'
                }}
              />
            </div>
            <div className="outage-compact-content">
              <div className="outage-compact-header">
                <span className="outage-compact-zone">{outage.zone}</span>
                <span className="outage-compact-region">• {outage.region}</span>
              </div>
              <div className="outage-compact-stats">
                <span className="outage-compact-stat">
                  {outage.affected.toLocaleString()} Betroffene
                </span>
                <span className="outage-compact-divider">•</span>
                <span className="outage-compact-stat">{outage.duration}</span>
              </div>
            </div>
            <span
              className="severity-badge-compact"
              style={{
                color: getSeverityColor(outage.severity),
                background: `${getSeverityColor(outage.severity)}15`
              }}
            >
              {getSeverityLabel(outage.severity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
