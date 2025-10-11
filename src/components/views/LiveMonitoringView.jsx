import { EnergyChart } from '../dashboard/EnergyChart';
import { VoltageFrequencyMonitor } from '../dashboard/VoltageFrequencyMonitor';
import { TransformerStatusChart } from '../dashboard/TransformerStatusChart';
import { BatteryStorageChart } from '../dashboard/BatteryStorageChart';
import { OutageMap } from '../dashboard/OutageMap';
import { mockData } from '../../data/mockData';

export const LiveMonitoringView = () => {
  return (
    <>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Live Energie-Monitor</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--success)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--success)',
              animation: 'pulse 4s infinite'
            }}></span>
            Live
          </span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Echtzeit-Überwachung aller Energieanlagen
        </div>
      </div>

      {/* Voltage & Frequency */}
      <div style={{ marginBottom: '20px' }}>
        <VoltageFrequencyMonitor data={mockData.voltageFrequency} />
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {mockData.kpis.slice(0, 2).map((kpi) => (
          <div key={kpi.id} className="kpi">
            <div className="kpi-label">{kpi.title}</div>
            <div className="kpi-value">
              {kpi.value}
              <span className="kpi-unit">{kpi.unit}</span>
            </div>
            <div className={`kpi-change ${kpi.trend === 'up' ? 'positive' : 'negative'}`}>
              {kpi.change}%
            </div>
          </div>
        ))}
        {mockData.facilities.slice(0, 2).map((facility) => (
          <div key={facility.id} className="kpi">
            <div className="kpi-label">{facility.name}</div>
            <div className="kpi-value" style={{ fontSize: '20px' }}>
              {facility.output}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Effizienz: {facility.efficiency}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <TransformerStatusChart data={mockData.transformers} />
        <BatteryStorageChart data={mockData.batteryStorage} />
      </div>

      <div style={{ marginTop: '24px' }}>
        <EnergyChart data={mockData.energyConsumption} />
      </div>

      <div style={{ marginTop: '24px' }}>
        <OutageMap data={mockData.outages} />
      </div>
    </>
  );
};
