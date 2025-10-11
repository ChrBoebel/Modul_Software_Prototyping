import { KPICard } from '../dashboard/KPICard';
import { EnergyChart } from '../dashboard/EnergyChart';
import { EnergyMixChart } from '../dashboard/EnergyMixChart';
import { FacilitiesTable } from '../dashboard/FacilitiesTable';
import { AlertsList } from '../dashboard/AlertsList';
import { GridLoadGauge } from '../dashboard/GridLoadGauge';
import { LoadForecastChart } from '../dashboard/LoadForecastChart';
import { RenewableStackedChart } from '../dashboard/RenewableStackedChart';
import { RegionalGridMap } from '../dashboard/RegionalGridMap';
import { mockData } from '../../data/mockData';

export const DashboardView = ({ onKPIClick, onFacilityClick, onAddFacility, onAlertClick }) => {
  return (
    <>
      {/* Grid Load Gauge */}
      <div style={{ marginBottom: '20px' }}>
        <GridLoadGauge data={mockData.gridLoad} />
      </div>

      {/* KPIs */}
      <div className="grid-4">
        {mockData.kpis.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} onClick={onKPIClick} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2">
        <LoadForecastChart data={mockData.loadForecast} />
        <EnergyMixChart data={mockData.energyMix} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid-2">
        <RenewableStackedChart data={mockData.renewableTimeline} />
        <EnergyChart data={mockData.energyConsumption} />
      </div>

      {/* Regional Grid */}
      <div style={{ marginTop: '24px' }}>
        <RegionalGridMap data={mockData.regionalGrid} />
      </div>

      {/* Table */}
      <div style={{ marginTop: '24px' }}>
        <FacilitiesTable
          facilities={mockData.facilities}
          onFacilityClick={onFacilityClick}
          onAddFacility={onAddFacility}
        />
      </div>

      {/* Alerts */}
      <div style={{ marginTop: '24px' }}>
        <AlertsList alerts={mockData.alerts} onAlertClick={onAlertClick} />
      </div>
    </>
  );
};
