export const RenewableStackedChart = ({ data }) => {
  const { labels, renewable, conventional } = data;

  const maxValue = Math.max(...renewable.map((r, i) => r + conventional[i])) * 1.1;
  const chartHeight = 180;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Erneuerbare vs. Konventionell</span>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#10b981' }}></span>
            Erneuerbar
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#6b7280' }}></span>
            Konventionell
          </span>
        </div>
      </div>
      <div className="chart-container" style={{ height: `${chartHeight + 40}px` }}>
        <svg width="100%" height="100%">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="40"
              y1={20 + (chartHeight * percent) / 100}
              x2="100%"
              y2={20 + (chartHeight * percent) / 100}
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          {/* Stacked bars */}
          {labels.map((label, i) => {
            const barWidth = 70 / labels.length;
            const x = 45 + (i * (80 / labels.length));
            const renewableHeight = (renewable[i] / maxValue) * chartHeight;
            const conventionalHeight = (conventional[i] / maxValue) * chartHeight;
            const totalHeight = renewableHeight + conventionalHeight;

            return (
              <g key={i}>
                {/* Conventional (bottom) */}
                <rect
                  x={`${x}%`}
                  y={20 + chartHeight - totalHeight}
                  width={`${barWidth * 0.8}%`}
                  height={conventionalHeight}
                  fill="#6b7280"
                  rx="2"
                />
                {/* Renewable (top) */}
                <rect
                  x={`${x}%`}
                  y={20 + chartHeight - renewableHeight}
                  width={`${barWidth * 0.8}%`}
                  height={renewableHeight}
                  fill="#10b981"
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
        </svg>
      </div>
    </div>
  );
};
