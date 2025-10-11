export const CustomerSegmentsDonut = ({ data }) => {
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const radius = 70;
  const innerRadius = 45;
  const centerX = 90;
  const centerY = 90;

  let currentAngle = -90;

  const createArc = (startAngle, endAngle, outerRadius, innerRadius) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + outerRadius * Math.cos(startRad);
    const y1 = centerY + outerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(endRad);
    const y2 = centerY + outerRadius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Kundenverbrauch nach Segment</span>
      </div>
      <div className="donut-container">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {data.map((segment) => {
            const angle = (segment.value / total) * 360;
            const path = createArc(currentAngle, currentAngle + angle, radius, innerRadius);
            const arcPath = path;
            currentAngle += angle;

            return (
              <path
                key={segment.name}
                d={arcPath}
                fill={segment.color}
                opacity="0.9"
              />
            );
          })}

          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            fontSize="24"
            fontWeight="700"
            fill="var(--text)"
          >
            {total}%
          </text>
          <text
            x={centerX}
            y={centerY + 12}
            textAnchor="middle"
            fontSize="11"
            fill="var(--text-secondary)"
          >
            Gesamt
          </text>
        </svg>

        <div className="donut-legend">
          {data.map((segment) => (
            <div key={segment.name} className="donut-legend-item">
              <span className="legend-dot" style={{ background: segment.color }}></span>
              <span className="legend-label">{segment.name}</span>
              <span className="legend-value">{segment.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
