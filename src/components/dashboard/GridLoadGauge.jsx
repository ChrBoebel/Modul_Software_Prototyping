export const GridLoadGauge = ({ data }) => {
  const { current, max, unit, status } = data;
  const percentage = (current / max) * 100;

  const getStatusColor = () => {
    if (status === 'critical' || percentage > 85) return 'var(--danger)';
    if (status === 'warning' || percentage > 70) return 'var(--warning)';
    return 'var(--swk-blue)'; // Use brand blue for normal instead of generic green
  };

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Netzauslastung</span>
      </div>
      <div className="gauge-container">
        <svg className="gauge-svg" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="var(--border)"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={getStatusColor()}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
          <text
            x="80"
            y="75"
            textAnchor="middle"
            className="gauge-value"
            fill="var(--text)"
          >
            {current}
          </text>
          <text
            x="80"
            y="95"
            textAnchor="middle"
            className="gauge-unit"
            fill="var(--text-secondary)"
          >
            {unit}
          </text>
        </svg>
        <div className="gauge-label" style={{ color: getStatusColor() }}>
          {status === 'critical' ? 'Kritisch' : status === 'warning' ? 'Warnung' : 'Normal'}
        </div>
      </div>
    </div>
  );
};
