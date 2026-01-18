import { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  CheckCircle,
  Percent
} from 'lucide-react';
import { Tabs, KPICard, KPIBar } from '../ui';
import StartTab from './tabs/StartTab';
import KampagnenTab from './tabs/KampagnenTab';
import NewsFeedTab from './tabs/NewsFeedTab';
import TrafficTab from './tabs/TrafficTab';
import leadsData from '../../data/leads.json';

const TABS = [
  { id: 'start', label: 'Start' },
  { id: 'kampagnen', label: 'Kampagnen' },
  { id: 'news-feed', label: 'News-Feed' },
  { id: 'traffic', label: 'Traffic' }
];

const DashboardView = ({ showToast, onNavigate, flowLeads = [] }) => {
  const [activeTab, setActiveTab] = useState('start');

  // Mock sparkline data for 7-day trend visualization (Tufte's "small multiples")
  const sparklineData = useMemo(() => ({
    visitors: [180, 220, 195, 240, 265, 250, 265],
    leads: [5, 8, 6, 9, 11, 7, 9],
    qualified: [2, 3, 2, 4, 3, 2, 3],
    conversion: [2.8, 3.2, 2.9, 3.4, 3.6, 3.1, 3.4]
  }), []);

  // Calculate trend from sparkline data (Few's principle: provide context)
  const calculateTrend = (data) => {
    if (!data || data.length < 2) return null;
    const first = data[0];
    const last = data[data.length - 1];
    const change = ((last - first) / first * 100).toFixed(1);
    const direction = last > first ? 'up' : last < first ? 'down' : 'stable';
    return { direction, value: `${change > 0 ? '+' : ''}${change}%` };
  };

  const trends = useMemo(() => ({
    visitors: calculateTrend(sparklineData.visitors),
    leads: calculateTrend(sparklineData.leads),
    qualified: calculateTrend(sparklineData.qualified),
    conversion: calculateTrend(sparklineData.conversion)
  }), [sparklineData]);

  // Calculate KPIs from leads data (including flow-generated leads)
  const kpis = useMemo(() => {
    const jsonLeads = leadsData.leads || [];
    const leads = [...flowLeads, ...jsonLeads];
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l =>
      l.status === 'qualified' || l.status === 'converted'
    ).length;
    // Mock visitor count (would come from analytics in real app)
    const visitors = Math.floor(totalLeads * 29.5); // Approximate ratio
    const conversionRate = visitors > 0 ? ((totalLeads / visitors) * 100).toFixed(2) : '0';

    return {
      visitors: visitors.toLocaleString('de-DE'),
      totalLeads: totalLeads.toLocaleString('de-DE'),
      qualifiedLeads: qualifiedLeads.toLocaleString('de-DE'),
      conversionRate: `${conversionRate.replace('.', ',')}%`
    };
  }, [flowLeads]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'start':
        return <StartTab showToast={showToast} onTabChange={setActiveTab} onNavigate={onNavigate} flowLeads={flowLeads} />;
      case 'kampagnen':
        return <KampagnenTab showToast={showToast} onNavigate={onNavigate} />;
      case 'news-feed':
        return <NewsFeedTab showToast={showToast} onNavigate={onNavigate} flowLeads={flowLeads} />;
      case 'traffic':
        return <TrafficTab showToast={showToast} onNavigate={onNavigate} onTabChange={setActiveTab} />;
      default:
        return <StartTab showToast={showToast} onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="view-container">
      <h1 className="sr-only">Dashboard Übersicht</h1>
      <KPIBar>
        <KPICard
          icon={Users}
          value={kpis.visitors}
          label="Besucher gesamt"
          variant="primary"
          tooltip="Anzahl aller Website-Besucher im gewählten Zeitraum"
          sparklineData={sparklineData.visitors}
          trend={trends.visitors}
        />
        <KPICard
          icon={TrendingUp}
          value={kpis.totalLeads}
          label="Leads gesamt"
          variant="secondary"
          tooltip="Anzahl aller erfassten Kontaktanfragen"
          sparklineData={sparklineData.leads}
          trend={trends.leads}
        />
        <KPICard
          icon={CheckCircle}
          value={kpis.qualifiedLeads}
          label="Qualifizierte Leads"
          variant="success"
          tooltip="Leads mit Score ≥50, die für den Vertrieb relevant sind"
          sparklineData={sparklineData.qualified}
          trend={trends.qualified}
        />
        <KPICard
          icon={Percent}
          value={kpis.conversionRate}
          label="Conversion-Rate"
          variant="warning"
          tooltip="Berechnung: (Leads / Besucher) × 100"
          sparklineData={sparklineData.conversion}
          trend={trends.conversion}
        />
      </KPIBar>

      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel="Dashboard Bereiche"
      />

      {renderTabContent()}
    </div>
  );
};

export default DashboardView;
