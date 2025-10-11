export const BatteryStorageChart = ({ data }) => {
  const { labels, charging, discharging, capacity, current } = data;

  const maxValue = Math.max(...charging, ...discharging) * 1.2;
  const chartHeight = 180;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Batteriespeicher</span>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Füllstand: {current}% von {capacity} MWh
        </div>
      </div>
      <div className="chart-legend" style={{ padding: '0 24px 12px' }}>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#10b981' }}></span>
          Laden
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#3b82f6' }}></span>
          Entladen
        </span>
      </div>
      <div className="chart-container" style={{ height: `${chartHeight + 40}px` }}>
        <svg width="100%" height="100%">
          {/* Bars */}
          {labels.map((label, i) => {
            const barWidth = 80 / labels.length;
            const x = 50 + (i * (80 / labels.length));
            const chargingHeight = (charging[i] / maxValue) * chartHeight;
            const dischargingHeight = (discharging[i] / maxValue) * chartHeight;

            return (
              <g key={i}>
                {/* Charging bar (positive) */}
                <rect
                  x={`${x}%`}
                  y={20 + chartHeight / 2 - chargingHeight}
                  width={`${barWidth * 0.8}%`}
                  height={chargingHeight}
                  fill="#10b981"
                  rx="2"
                />
                {/* Discharging bar (negative) */}
                <rect
                  x={`${x}%`}
                  y={20 + chartHeight / 2}
                  width={`${barWidth * 0.8}%`}
                  height={dischargingHeight}
                  fill="#3b82f6"
                  rx="2"
                />
                {/* Label */}
                <text
                  x={`${x + barWidth * 0.4}%`}
                  y={chartHeight + 35}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-tertiary)"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Center line */}
          <line
            x1="40"
            y1={20 + chartHeight / 2}
            x2="95%"
            y2={20 + chartHeight / 2}
            stroke="var(--border)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};
