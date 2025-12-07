import { useState } from 'react';
import {
  Eye,
  Link,
  TrendingUp,
  MousePointer,
  Users,
  Target,
  Copy,
  ExternalLink,
  Play,
  Pause,
  BarChart3,
  PieChart
} from 'lucide-react';
import { mockData } from '../../../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';

const AwarenessOverview = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('traffic');
  const [utmParams, setUtmParams] = useState({
    baseUrl: 'https://www.stadtwerke-konstanz.de',
    source: '',
    medium: '',
    campaign: '',
    content: '',
    term: ''
  });

  const trafficSources = mockData.trafficSources || [];
  const campaigns = mockData.campaigns || [];
  const dailyTraffic = mockData.dailyTraffic || [];
  const utmPresets = mockData.utmPresets || [];

  // Calculate totals
  const totalVisitors = trafficSources.reduce((sum, s) => sum + s.visitors, 0);
  const totalLeads = trafficSources.reduce((sum, s) => sum + s.leads, 0);
  const avgConversion = totalVisitors > 0 ? ((totalLeads / totalVisitors) * 100).toFixed(2) : 0;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  // Build UTM URL
  const buildUtmUrl = () => {
    const params = new URLSearchParams();
    if (utmParams.source) params.set('utm_source', utmParams.source);
    if (utmParams.medium) params.set('utm_medium', utmParams.medium);
    if (utmParams.campaign) params.set('utm_campaign', utmParams.campaign);
    if (utmParams.content) params.set('utm_content', utmParams.content);
    if (utmParams.term) params.set('utm_term', utmParams.term);
    const queryString = params.toString();
    return queryString ? `${utmParams.baseUrl}?${queryString}` : utmParams.baseUrl;
  };

  const copyToClipboard = () => {
    const url = buildUtmUrl();
    navigator.clipboard.writeText(url);
    showToast('URL in Zwischenablage kopiert', 'success');
  };

  const applyPreset = (preset) => {
    setUtmParams(prev => ({
      ...prev,
      source: preset.source,
      medium: preset.medium,
      content: preset.content || ''
    }));
    showToast(`Preset "${preset.name}" angewendet`, 'info');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: 'Aktiv', className: 'badge success' },
      paused: { label: 'Pausiert', className: 'badge warning' },
      completed: { label: 'Beendet', className: 'badge neutral' }
    };
    const config = statusMap[status] || statusMap.completed;
    
    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  };

  // Modern Palette for Charts
  const CHART_COLORS = {
    primary: '#2358A1', // SWK Blue
    secondary: '#E2001A', // SWK Red
    tertiary: '#cbd5e1', // Slate 300
    success: '#10b981',
    warning: '#f59e0b'
  };

  return (
    <div className="awareness-overview">
      {/* KPI Bar */}
      <div className="kpi-bar">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2358A1' }}>
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{totalVisitors.toLocaleString('de-DE')}</span>
            <span className="kpi-label">Besucher gesamt</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <Target size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{totalLeads.toLocaleString('de-DE')}</span>
            <span className="kpi-label">Leads generiert</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{avgConversion}%</span>
            <span className="kpi-label">Conversion-Rate</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>
            <MousePointer size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{activeCampaigns}</span>
            <span className="kpi-label">Aktive Kampagnen</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs">
        <button
          className={`section-tab ${activeTab === 'traffic' ? 'active' : ''}`}
          onClick={() => setActiveTab('traffic')}
        >
          <BarChart3 size={18} />
          Traffic-Quellen
        </button>
        <button
          className={`section-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          <Target size={18} />
          Kampagnen
        </button>
        <button
          className={`section-tab ${activeTab === 'utm' ? 'active' : ''}`}
          onClick={() => setActiveTab('utm')}
        >
          <Link size={18} />
          UTM-Generator
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'traffic' && (
        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <h3>Besucher nach Quelle</h3>
            </div>
            <div className="chart-container" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficSources} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="label" type="category" width={100} stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="visitors" name="Besucher" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Leads nach Quelle</h3>
            </div>
            <div className="chart-container" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={trafficSources}
                    dataKey="leads"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.success, CHART_COLORS.warning][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card full-width">
            <div className="card-header">
              <h3>Traffic Verlauf (7 Tage)</h3>
            </div>
            <div className="chart-container" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTraffic} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="visitors" name="Besucher" stroke={CHART_COLORS.primary} strokeWidth={3} dot={{ fill: CHART_COLORS.primary, r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="leads" name="Leads" stroke={CHART_COLORS.success} strokeWidth={3} dot={{ fill: CHART_COLORS.success, r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
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
                  <th>Kanäle</th>
                  <th>Budget</th>
                  <th>Impressionen</th>
                  <th>Klicks</th>
                  <th>CTR</th>
                  <th>Leads</th>
                  <th>CPL</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id}>
                    <td>
                      <div className="campaign-name">
                        <strong>{campaign.name}</strong>
                        <span className="campaign-dates">
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                      </div>
                    </td>
                    <td>{getStatusBadge(campaign.status)}</td>
                    <td>
                      <div className="channel-tags">
                        {campaign.channels.map(ch => (
                          <span key={ch} className="channel-tag">{ch}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="budget-info">
                        <span>{campaign.spent.toLocaleString('de-DE')}€</span>
                        <span className="budget-total">/ {campaign.budget.toLocaleString('de-DE')}€</span>
                      </div>
                    </td>
                    <td>{campaign.metrics.impressions.toLocaleString('de-DE')}</td>
                    <td>{campaign.metrics.clicks.toLocaleString('de-DE')}</td>
                    <td>{campaign.metrics.ctr.toFixed(1)}%</td>
                    <td><strong>{campaign.metrics.leads}</strong></td>
                    <td>{campaign.metrics.cpl.toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'utm' && (
        <div className="utm-generator">
          <div className="card">
            <div className="card-header">
              <h3>UTM-Link Generator</h3>
              <p className="card-description">Erstellen Sie nachverfolgbare Links für Ihre Kampagnen</p>
            </div>

            <div className="utm-presets">
              <span className="presets-label">Vorlagen:</span>
              {utmPresets.map(preset => (
                <button
                  key={preset.id}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="utm-form">
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Basis-URL *</label>
                  <input
                    type="url"
                    value={utmParams.baseUrl}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://www.stadtwerke-konstanz.de/solar"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>utm_source *</label>
                  <input
                    type="text"
                    value={utmParams.source}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="z.B. google, facebook, newsletter"
                  />
                  <span className="form-hint">Woher kommt der Traffic?</span>
                </div>
                <div className="form-group">
                  <label>utm_medium *</label>
                  <input
                    type="text"
                    value={utmParams.medium}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, medium: e.target.value }))}
                    placeholder="z.B. cpc, social, email"
                  />
                  <span className="form-hint">Welcher Kanal?</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>utm_campaign *</label>
                  <input
                    type="text"
                    value={utmParams.campaign}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, campaign: e.target.value }))}
                    placeholder="z.B. solar-herbst-2025"
                  />
                  <span className="form-hint">Kampagnenname</span>
                </div>
                <div className="form-group">
                  <label>utm_content</label>
                  <input
                    type="text"
                    value={utmParams.content}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="z.B. banner-top, cta-button"
                  />
                  <span className="form-hint">Optional: Unterscheide Anzeigenvarianten</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>utm_term</label>
                  <input
                    type="text"
                    value={utmParams.term}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, term: e.target.value }))}
                    placeholder="z.B. solaranlage kaufen"
                  />
                  <span className="form-hint">Optional: Suchbegriffe bei bezahlter Suche</span>
                </div>
              </div>
            </div>

            <div className="utm-result">
              <label>Generierte URL:</label>
              <div className="url-output">
                <code>{buildUtmUrl()}</code>
                <button className="btn btn-primary" onClick={copyToClipboard}>
                  <Copy size={16} />
                  Kopieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwarenessOverview;
