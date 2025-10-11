export const VoltageFrequencyMonitor = ({ data }) => {
  const { voltage, frequency } = data;

  const getStatusColor = (current, min, max) => {
    if (current < min || current > max) return '#ef4444';
    if (current < min * 1.05 || current > max * 0.95) return '#FD951F';
    return '#10b981';
  };

  const Gauge = ({ label, current, target, unit, min, max }) => {
    const percentage = ((current - min) / (max - min)) * 100;
    const color = getStatusColor(current, min, max);

    return (
      <div className="voltage-gauge">
        <div className="gauge-header">
          <span className="gauge-title">{label}</span>
          <span className="gauge-status" style={{ color }}>
            {current} {unit}
          </span>
        </div>
        <div className="gauge-bar">
          <div
            className="gauge-bar-fill"
            style={{
              width: `${percentage}%`,
              background: color,
              transition: 'width 0.5s ease'
            }}
          />
        </div>
        <div className="gauge-footer">
          <span>Min: {min}{unit}</span>
          <span>Target: {target}{unit}</span>
          <span>Max: {max}{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Netzstabilität</span>
      </div>
      <div className="voltage-monitor">
        <Gauge
          label="Spannung"
          current={voltage.current}
          target={voltage.target}
          unit={voltage.unit}
          min={voltage.min}
          max={voltage.max}
        />
        <Gauge
          label="Frequenz"
          current={frequency.current}
          target={frequency.target}
          unit={frequency.unit}
          min={frequency.min}
          max={frequency.max}
        />
      </div>
    </div>
  );
};
