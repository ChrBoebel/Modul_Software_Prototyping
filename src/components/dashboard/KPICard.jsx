import { TrendingUp, TrendingDown } from 'lucide-react';

export const KPICard = ({ kpi, onClick }) => {
  return (
    <div className="kpi" onClick={() => onClick(`KPI: ${kpi.id}`)}>
      <div className="kpi-label">{kpi.title}</div>
      <div className="kpi-value">
        {kpi.value}
        <span className="kpi-unit">{kpi.unit}</span>
      </div>
      <div className={`kpi-change ${kpi.trend === 'up' ? 'positive' : 'negative'}`}>
        {kpi.trend === 'up' ? (
          <TrendingUp size={14} />
        ) : (
          <TrendingDown size={14} />
        )}
        {kpi.change}%
      </div>
    </div>
  );
};
