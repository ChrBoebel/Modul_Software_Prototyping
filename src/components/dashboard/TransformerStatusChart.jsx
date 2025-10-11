export const TransformerStatusChart = ({ data }) => {
  const getStatusColor = (load) => {
    if (load > 90) return '#ef4444';
    if (load > 75) return '#FD951F';
    return '#10b981';
  };

  const sortedData = [...data].sort((a, b) => b.load - a.load);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Transformatoren-Status</span>
      </div>
      <div className="transformer-chart">
        {sortedData.map((transformer) => (
          <div key={transformer.id} className="transformer-row">
            <div className="transformer-info">
              <span className="transformer-name">{transformer.name}</span>
              <span className="transformer-capacity">{transformer.capacity}</span>
            </div>
            <div className="transformer-bar-wrapper">
              <div className="transformer-bar">
                <div
                  className="transformer-bar-fill"
                  style={{
                    width: `${transformer.load}%`,
                    background: getStatusColor(transformer.load)
                  }}
                />
              </div>
              <span className="transformer-load">{transformer.load}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
