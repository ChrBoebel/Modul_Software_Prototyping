import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  BarChart3
} from 'lucide-react';

const KampagnenTab = ({ showToast }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('30d');

  // Mock campaign data
  const campaigns = [
    {
      id: 'camp-001',
      name: 'Solar Frühling 2025',
      status: 'Aktiv',
      events: 12500,
      impressions: 45000,
      clicks: 2800,
      ctr: '6.2%',
      leads: 145,
      qualiQuote: '35%',
      trend: 'up'
    },
    {
      id: 'camp-002',
      name: 'Wärmepumpen Aktion',
      status: 'Pausiert',
      events: 8900,
      impressions: 32000,
      clicks: 1500,
      ctr: '4.7%',
      leads: 89,
      qualiQuote: '42%',
      trend: 'down'
    },
    {
      id: 'camp-003',
      name: 'E-Auto Förderung',
      status: 'Aktiv',
      events: 6700,
      impressions: 28000,
      clicks: 1200,
      ctr: '4.3%',
      leads: 67,
      qualiQuote: '28%',
      trend: 'up'
    },
    {
      id: 'camp-004',
      name: 'Ökostrom Wechsel',
      status: 'Prüfung',
      events: 15200,
      impressions: 52000,
      clicks: 3100,
      ctr: '6.0%',
      leads: 234,
      qualiQuote: '18%',
      trend: 'stable'
    },
    {
      id: 'camp-005',
      name: 'Glasfaser Anschluss',
      status: 'Aktiv',
      events: 4500,
      impressions: 18000,
      clicks: 890,
      ctr: '4.9%',
      leads: 56,
      qualiQuote: '31%',
      trend: 'up'
    }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'Aktiv': 'success',
      'Pausiert': 'warning',
      'Prüfung': 'info'
    };
    return statusMap[status] || 'neutral';
  };

  const filteredCampaigns = campaigns.filter(camp =>
    filterStatus === 'all' || camp.status === filterStatus
  );

  return (
    <div className="kampagnen-tab">
      <h2 className="sr-only">Kampagnen Verwaltung</h2>
      {/* Filters */}
      <div className="filters-bar" role="search" aria-label="Filteroptionen">
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Alle</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Pausiert">Pausiert</option>
            <option value="Prüfung">Prüfung</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="period-filter">Zeitraum</label>
          <select
            id="period-filter"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="7d">Letzte 7 Tage</option>
            <option value="30d">Letzte 30 Tage</option>
            <option value="90d">Letzte 90 Tage</option>
          </select>
        </div>
      </div>

      <div className="kampagnen-content">
        {/* Campaign Table */}
        <div className="card">
          <div className="card-header">
            <h3>Kampagnen-Übersicht</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kampagne</th>
                  <th>Status</th>
                  <th>Events</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Leads 30d</th>
                  <th>Quali-Quote</th>
                  <th>Trend</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    className={selectedCampaign?.id === camp.id ? 'selected' : ''}
                    onClick={() => setSelectedCampaign(camp)}
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCampaign(camp);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="campaign-name">{camp.name}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(camp.status)}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td>{camp.events.toLocaleString('de-DE')}</td>
                    <td>{camp.impressions.toLocaleString('de-DE')}</td>
                    <td>{camp.clicks.toLocaleString('de-DE')}</td>
                    <td>{camp.ctr}</td>
                    <td>{camp.leads}</td>
                    <td>{camp.qualiQuote}</td>
                    <td>
                      {camp.trend === 'up' && (
                        <>
                          <ArrowUpRight size={16} className="trend-up" aria-hidden="true" />
                          <span className="sr-only">Steigend</span>
                        </>
                      )}
                      {camp.trend === 'down' && (
                        <>
                          <ArrowDownRight size={16} className="trend-down" aria-hidden="true" />
                          <span className="sr-only">Fallend</span>
                        </>
                      )}
                      {camp.trend === 'stable' && (
                        <>
                          <span className="trend-stable" aria-hidden="true">→</span>
                          <span className="sr-only">Stabil</span>
                        </>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Kampagne ${camp.name} bearbeiten`);
                        }}
                        aria-label={`Einstellungen für ${camp.name} öffnen`}
                      >
                        <Settings size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Details */}
        {selectedCampaign && (
          <div className="card campaign-details">
            <div className="card-header">
              <h3>Kampagnen-Details: {selectedCampaign.name}</h3>
            </div>
            <div className="details-content">
              <div className="chart-placeholder" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
                <div className="placeholder-content">
                  <BarChart3 size={48} className="text-muted" />
                  <span className="text-muted">Absatz-Analyse Chart für {selectedCampaign.name}</span>
                </div>
              </div>
              <div className="details-stats">
                <div className="stat-item">
                  <span className="stat-label">Quali-Quote</span>
                  <span className="stat-value">{selectedCampaign.qualiQuote}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Conversion Rate</span>
                  <span className="stat-value">{selectedCampaign.ctr}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Leads gesamt</span>
                  <span className="stat-value">{selectedCampaign.leads}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KampagnenTab;
