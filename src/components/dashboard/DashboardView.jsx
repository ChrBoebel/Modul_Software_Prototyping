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
        return <NewsFeedTab showToast={showToast} />;
      case 'traffic':
        return <TrafficTab showToast={showToast} />;
      default:
        return <StartTab showToast={showToast} onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="view-container">
      <h1 className="sr-only">Dashboard Übersicht</h1>
      <KPIBar>
        <KPICard icon={Users} value={kpis.visitors} label="Besucher gesamt" variant="primary" />
        <KPICard icon={TrendingUp} value={kpis.totalLeads} label="Leads gesamt" variant="secondary" />
        <KPICard icon={CheckCircle} value={kpis.qualifiedLeads} label="qualifiziert Leads" variant="success" />
        <KPICard icon={Percent} value={kpis.conversionRate} label="Conversion-Rate" variant="warning" />
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
