import { EnergyChart } from '../dashboard/EnergyChart';
import { EnergyMixChart } from '../dashboard/EnergyMixChart';
import { PeakDemandChart } from '../dashboard/PeakDemandChart';
import { GridLossesSankey } from '../dashboard/GridLossesSankey';
import { RegionalGridMap } from '../dashboard/RegionalGridMap';
import { mockData } from '../../data/mockData';

export const AnalyticsView = () => {
  return (
    <>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Analytics & Auswertungen</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Detaillierte Analysen und historische Daten
        </div>
      </div>

      <div className="grid-4">
        {mockData.kpis.map((kpi) => (
          <div key={kpi.id} className="card">
            <div className="card-header">
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{kpi.title}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              {kpi.value} {kpi.unit}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Trend: <span style={{ color: kpi.trend === 'up' ? 'var(--success)' : 'var(--danger)' }}>
                {kpi.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <PeakDemandChart data={mockData.peakDemand} />
        <EnergyMixChart data={mockData.energyMix} />
      </div>

      <div style={{ marginTop: '24px' }}>
        <GridLossesSankey data={mockData.gridLosses} />
      </div>

      <div style={{ marginTop: '24px' }}>
        <RegionalGridMap data={mockData.regionalGrid} />
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <EnergyChart data={mockData.energyConsumption} />
      </div>
    </>
  );
};
