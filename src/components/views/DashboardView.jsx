import { KPICard } from '../dashboard/KPICard';
import { EnergyChart } from '../dashboard/EnergyChart';
import { EnergyMixChart } from '../dashboard/EnergyMixChart';
import { FacilitiesTable } from '../dashboard/FacilitiesTable';
import { AlertsList } from '../dashboard/AlertsList';
import { GridLoadGauge } from '../dashboard/GridLoadGauge';
import { LoadForecastChart } from '../dashboard/LoadForecastChart';
import { RenewableStackedChart } from '../dashboard/RenewableStackedChart';
import { RegionalGridMap } from '../dashboard/RegionalGridMap';
import { SectionHeader } from '../ui/SectionHeader';
import { Gauge, TrendingUp, BarChart3, Map, Factory, AlertTriangle } from 'lucide-react';
import { mockData } from '../../data/mockData';

export const DashboardView = ({ onKPIClick, onFacilityClick, onAddFacility, onAlertClick }) => {
  return (
    <>
      <SectionHeader title="Netzauslastung" icon={Gauge} />
      <div style={{ marginBottom: '20px' }}>
        <GridLoadGauge data={mockData.gridLoad} />
      </div>

      <SectionHeader title="Key Performance Indicators" icon={TrendingUp} />
      <div className="grid-4">
        {mockData.kpis.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} onClick={onKPIClick} />
        ))}
      </div>

      <SectionHeader title="Energiedaten & Prognosen" icon={BarChart3} />
      <div className="grid-2">
        <LoadForecastChart data={mockData.loadForecast} />
        <EnergyMixChart data={mockData.energyMix} />
      </div>

      <div className="grid-2">
        <RenewableStackedChart data={mockData.renewableTimeline} />
        <EnergyChart data={mockData.energyConsumption} />
      </div>

      <SectionHeader title="Regionale Übersicht" icon={Map} />
      <div style={{ marginTop: '24px' }}>
        <RegionalGridMap data={mockData.regionalGrid} />
      </div>

      <SectionHeader title="Anlagen" icon={Factory} />
      <div style={{ marginTop: '24px' }}>
        <FacilitiesTable
          facilities={mockData.facilities}
          onFacilityClick={onFacilityClick}
          onAddFacility={onAddFacility}
        />
      </div>

      <SectionHeader title="Alarme" icon={AlertTriangle} />
      <div style={{ marginTop: '24px' }}>
        <AlertsList alerts={mockData.alerts} onAlertClick={onAlertClick} />
      </div>
    </>
  );
};
