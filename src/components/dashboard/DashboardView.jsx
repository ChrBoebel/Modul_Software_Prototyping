import { useState } from 'react';
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

const TABS = [
  { id: 'start', label: 'Start' },
  { id: 'kampagnen', label: 'Kampagnen' },
  { id: 'news-feed', label: 'News-Feed' },
  { id: 'traffic', label: 'Traffic' }
];

const DashboardView = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('start');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'start':
        return <StartTab showToast={showToast} onTabChange={setActiveTab} />;
      case 'kampagnen':
        return <KampagnenTab showToast={showToast} />;
      case 'news-feed':
        return <NewsFeedTab showToast={showToast} />;
      case 'traffic':
        return <TrafficTab showToast={showToast} />;
      default:
        return <StartTab showToast={showToast} />;
    }
  };

  return (
    <div className="view-container">
      <h1 className="sr-only">Dashboard Übersicht</h1>
      <KPIBar>
        <KPICard icon={Users} value="35.700" label="Besucher gesamt" variant="primary" />
        <KPICard icon={TrendingUp} value="1.208" label="Leads gesamt" variant="secondary" />
        <KPICard icon={CheckCircle} value="423" label="qualifiziert Leads" variant="success" />
        <KPICard icon={Percent} value="3,38%" label="Conversion-Rate" variant="warning" />
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
