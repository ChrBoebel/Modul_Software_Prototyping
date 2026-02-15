import { Users, TrendingUp, Activity, BarChart3, Zap } from 'lucide-react';
import { KPICard, KPIBar } from '../KPICard';
import { ComponentSection, ComponentShowcase } from './shared';

const KPIsSection = () => (
  <ComponentSection
    title="KPI Cards"
    description="Metriken und Kennzahlen übersichtlich darstellen."
  >
    <ComponentShowcase
      title="KPI Bar"
      code={`<KPIBar>
  <KPICard icon={Users} value="1.234" label="Besucher" variant="primary" />
  <KPICard icon={TrendingUp} value="89" label="Leads" variant="success" trend={{ direction: 'up', value: '+12%' }} />
</KPIBar>`}
    >
      <KPIBar>
        <KPICard icon={Users} value="1.234" label="Besucher" variant="primary" />
        <KPICard icon={TrendingUp} value="89" label="Leads" variant="success" trend={{ direction: 'up', value: '+12%' }} />
        <KPICard icon={Activity} value="45" label="Quali-Leads" variant="secondary" />
        <KPICard icon={BarChart3} value="3,2" label="Conversion" unit="%" variant="warning" />
      </KPIBar>
    </ComponentShowcase>

    <ComponentShowcase
      title="Einzelne KPI Card"
      code={`<KPICard
  icon={Zap}
  value="156"
  label="Aktive Kampagnen"
  variant="primary"
  trend={{ direction: 'up', value: '+5' }}
/>`}
    >
      <div className="preview-row">
        <KPICard icon={Zap} value="156" label="Aktive Kampagnen" variant="primary" trend={{ direction: 'up', value: '+5' }} />
      </div>
    </ComponentShowcase>
  </ComponentSection>
);

export default KPIsSection;
