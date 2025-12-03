export const LoadForecastChart = ({ data }) => {
  const { labels, forecast, actual } = data;

  const maxValue = Math.max(...forecast, ...actual);
  const chartHeight = 180;
  const chartWidth = 600;
  const padding = { left: 40, right: 20, top: 20, bottom: 40 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight;

  // Better colors for dark/light mode
  const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';
  const actualColor = isDarkMode ? '#60a5fa' : '#2563eb'; // Lighter blue for dark mode, darker for light

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Lastprognose vs. Realität</span>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#e2001a' }}></span>
            Prognose
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: actualColor }}></span>
            Tatsächlich
          </span>
        </div>
      </div>
      <div className="chart-container" style={{ height: `${chartHeight + padding.bottom + padding.top}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight + padding.bottom + padding.top}`} preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1={padding.left}
              y1={padding.top + (plotHeight * percent) / 100}
              x2={chartWidth - padding.right}
              y2={padding.top + (plotHeight * percent) / 100}
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          {/* Forecast line */}
          <polyline
            points={forecast.map((value, i) => {
              const x = padding.left + (i / (labels.length - 1)) * plotWidth;
              const y = padding.top + plotHeight - (value / maxValue) * plotHeight;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#e2001a"
            strokeWidth="2"
          />

          {/* Actual line */}
          <polyline
            points={actual.map((value, i) => {
              const x = padding.left + (i / (labels.length - 1)) * plotWidth;
              const y = padding.top + plotHeight - (value / maxValue) * plotHeight;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke={actualColor}
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Labels */}
          {labels.map((label, i) => (
            <text
              key={i}
              x={padding.left + (i / (labels.length - 1)) * plotWidth}
              y={chartHeight + padding.top + 15}
              textAnchor="middle"
              fontSize="11"
              fill="var(--text-tertiary)"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
