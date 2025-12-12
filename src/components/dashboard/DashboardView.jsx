import { useState } from 'react';
import {
  Users,
  TrendingUp,
  CheckCircle,
  Percent
} from 'lucide-react';
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

  // KPI Data
  const kpis = [
    {
      id: 'besucher',
      label: 'Besucher gesamt',
      value: '35.700',
      icon: Users,
      variant: 'primary'
    },
    {
      id: 'leads',
      label: 'Leads gesamt',
      value: '1.208',
      icon: TrendingUp,
      variant: 'secondary'
    },
    {
      id: 'qualifiziert',
      label: 'qualifiziert Leads',
      value: '423',
      icon: CheckCircle,
      variant: 'success'
    },
    {
      id: 'conversion',
      label: 'Conversion-Rate',
      value: '3,38%',
      icon: Percent,
      variant: 'warning'
    }
  ];

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
      {/* KPI Bar */}
      <div className="kpi-bar">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.id} className="kpi-card">
              <div className={`kpi-icon variant-${kpi.variant}`}>
                <Icon size={24} />
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{kpi.value}</div>
                <div className="kpi-label">{kpi.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs" role="tablist" aria-label="Dashboard Bereiche">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`section-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default DashboardView;
