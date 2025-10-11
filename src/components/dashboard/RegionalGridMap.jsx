export const RegionalGridMap = ({ data }) => {
  const getStatusColor = (load) => {
    if (load > 85) return '#ef4444';
    if (load > 70) return '#FD951F';
    return '#10b981';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'critical': return 'Kritisch';
      case 'warning': return 'Warnung';
      case 'normal': return 'Normal';
      default: return status;
    }
  };

  const RegionGauge = ({ region }) => {
    const color = getStatusColor(region.load);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (region.load / 100) * circumference;

    return (
      <div className="region-card-v2">
        <div className="region-gauge-wrapper">
          <svg className="region-gauge-svg" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text
              x="60"
              y="55"
              textAnchor="middle"
              className="region-gauge-value"
              fill="var(--text)"
            >
              {region.load}
            </text>
            <text
              x="60"
              y="70"
              textAnchor="middle"
              className="region-gauge-unit"
              fill="var(--text-secondary)"
            >
              %
            </text>
          </svg>
        </div>
        <div className="region-info">
          <div className="region-name-v2">{region.name}</div>
          <div className="region-capacity-v2">{region.capacity}</div>
          <div
            className="region-status-v2"
            style={{ color }}
          >
            {getStatusText(region.status)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Regionale Netzauslastung</span>
      </div>
      <div className="regional-grid-v2">
        {data.map((region) => (
          <RegionGauge key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
};
