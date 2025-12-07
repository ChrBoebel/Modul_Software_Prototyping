import { useState } from 'react';
import {
  UserCheck,
  Users,
  Link2,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  BarChart3,
  ArrowRight,
  User,
  Mail,
  Phone,
  Settings
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
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
  LineChart,
  Line
} from 'recharts';

const ClosingOverview = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('funnel');

  const salesReps = mockData.salesReps || [];
  const integrations = mockData.integrations || [];
  const syncLogs = mockData.syncLogs || [];
  const conversionFunnel = mockData.conversionFunnel || {};
  const leads = mockData.leads || [];

  // Calculate stats
  const totalPipelineValue = conversionFunnel.metrics?.pipelineValue || 0;
  const overallConversion = conversionFunnel.metrics?.overallConversion || 0;
  const avgDealValue = conversionFunnel.metrics?.avgDealValue || 0;
  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle size={16} color="#16a34a" />;
      case 'warning': return <AlertTriangle size={16} color="#d97706" />;
      case 'disconnected':
      case 'error': return <XCircle size={16} color="#dc2626" />;
      default: return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#16a34a';
      case 'warning': return '#d97706';
      case 'disconnected':
      case 'error': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getSyncLogStatus = (status) => {
    const styles = {
      success: { bg: '#dcfce7', color: '#166534', label: 'Erfolgreich' },
      error: { bg: '#fef2f2', color: '#991b1b', label: 'Fehler' },
      warning: { bg: '#fef3c7', color: '#92400e', label: 'Warnung' }
    };
    return styles[status] || styles.success;
  };

  const funnelData = conversionFunnel.stages?.map((stage, index) => ({
    name: stage.label,
    value: stage.count,
    fill: stage.color
  })) || [];

  const trendData = conversionFunnel.trend || [];

  return (
    <div className="closing-overview">
      {/* KPI Bar */}
      <div className="kpi-bar">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#dcfce7' }}>
            <DollarSign size={20} color="#16a34a" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{(totalPipelineValue / 1000000).toFixed(1)}M €</span>
            <span className="kpi-label">Pipeline-Wert</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#dbeafe' }}>
            <TrendingUp size={20} color="#2563eb" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{overallConversion}%</span>
            <span className="kpi-label">Conversion-Rate</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fef3c7' }}>
            <UserCheck size={20} color="#d97706" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{avgDealValue.toLocaleString('de-DE')} €</span>
            <span className="kpi-label">Ø Deal-Wert</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ede9fe' }}>
            <Link2 size={20} color="#7c3aed" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{connectedIntegrations}/{integrations.length}</span>
            <span className="kpi-label">Integrationen</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs">
        <button
          className={`section-tab ${activeTab === 'funnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('funnel')}
        >
          <BarChart3 size={16} />
          Conversion-Funnel
        </button>
        <button
          className={`section-tab ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <Users size={16} />
          Vertriebsteam
        </button>
        <button
          className={`section-tab ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          <Link2 size={16} />
          Integrationen
        </button>
        <button
          className={`section-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <Clock size={16} />
          Sync-Protokoll
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'funnel' && (
        <div className="funnel-section">
          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Conversion-Funnel</h3>
              </div>
              <div className="funnel-visualization">
                {funnelData.map((stage, index) => {
                  const width = funnelData[0]?.value > 0
                    ? (stage.value / funnelData[0].value) * 100
                    : 0;
                  return (
                    <div key={index} className="funnel-stage">
                      <div
                        className="funnel-bar"
                        style={{
                          width: `${Math.max(width, 20)}%`,
                          backgroundColor: stage.fill
                        }}
                      >
                        <span className="funnel-label">{stage.name}</span>
                        <span className="funnel-value">{stage.value.toLocaleString('de-DE')}</span>
                      </div>
                      {index < funnelData.length - 1 && (
                        <div className="funnel-conversion">
                          <ArrowRight size={16} />
                          <span>
                            {funnelData[index + 1]?.value && stage.value > 0
                              ? ((funnelData[index + 1].value / stage.value) * 100).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Nach Produkt</h3>
              </div>
              <div className="product-breakdown">
                {conversionFunnel.byProduct?.map((product, index) => (
                  <div key={index} className="product-row">
                    <div className="product-info">
                      <span className="product-name">{product.label}</span>
                      <span className="product-leads">{product.leads} Leads</span>
                    </div>
                    <div className="product-metrics">
                      <span className="metric">
                        <strong>{product.won}</strong> gewonnen
                      </span>
                      <span className="metric highlight">
                        {product.conversion}% Rate
                      </span>
                      <span className="metric">
                        {(product.revenue / 1000).toFixed(0)}k € Umsatz
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card full-width">
              <div className="card-header">
                <h3>Trend (letzte 6 Monate)</h3>
              </div>
              <div className="chart-container" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--text-secondary)" />
                    <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="leads" name="Leads" stroke="#3b82f6" strokeWidth={2} />
                    <Line yAxisId="left" type="monotone" dataKey="won" name="Gewonnen" stroke="#10b981" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" name="Umsatz (€)" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="sales-section">
          <div className="card">
            <div className="card-header">
              <h3>Vertriebsteam</h3>
            </div>
            <div className="sales-reps-grid">
              {salesReps.map(rep => (
                <div key={rep.id} className="sales-rep-card">
                  <div className="rep-header">
                    <div className="rep-avatar">
                      <User size={24} />
                    </div>
                    <div className="rep-info">
                      <h4>{rep.name}</h4>
                      <span className="rep-department">{rep.department}</span>
                    </div>
                    <span className={`status-badge ${rep.status}`}>
                      {rep.status === 'active' ? 'Aktiv' : rep.status === 'vacation' ? 'Urlaub' : rep.status}
                    </span>
                  </div>
                  <div className="rep-contact">
                    <a href={`mailto:${rep.email}`}>
                      <Mail size={14} />
                      {rep.email}
                    </a>
                    <a href={`tel:${rep.phone}`}>
                      <Phone size={14} />
                      {rep.phone}
                    </a>
                  </div>
                  <div className="rep-stats">
                    <div className="stat">
                      <span className="stat-value">{rep.assignedLeads}</span>
                      <span className="stat-label">Zugewiesen</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{rep.closedDeals}</span>
                      <span className="stat-label">Abgeschlossen</span>
                    </div>
                    <div className="stat highlight">
                      <span className="stat-value">{rep.conversionRate}%</span>
                      <span className="stat-label">Rate</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{(rep.revenue / 1000).toFixed(0)}k €</span>
                      <span className="stat-label">Umsatz</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="integrations-section">
          <div className="card">
            <div className="card-header">
              <h3>System-Integrationen</h3>
              <button className="btn btn-secondary" onClick={() => showToast('Synchronisierung gestartet', 'info')}>
                <RefreshCw size={16} />
                Alle synchronisieren
              </button>
            </div>
            <div className="integrations-grid">
              {integrations.map(integration => (
                <div key={integration.id} className="integration-card">
                  <div className="integration-header">
                    <div className="integration-icon">
                      <Link2 size={20} />
                    </div>
                    <div className="integration-info">
                      <h4>{integration.name}</h4>
                      <span className="integration-type">{integration.type.toUpperCase()}</span>
                    </div>
                    <div className="integration-status" style={{ color: getStatusColor(integration.status) }}>
                      {getStatusIcon(integration.status)}
                      <span>{integration.status === 'connected' ? 'Verbunden' : integration.status === 'warning' ? 'Warnung' : 'Getrennt'}</span>
                    </div>
                  </div>
                  <p className="integration-description">{integration.description}</p>
                  <div className="integration-meta">
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>Letzte Sync: {new Date(integration.lastSync).toLocaleString('de-DE')}</span>
                    </div>
                    <div className="meta-item">
                      <RefreshCw size={14} />
                      <span>Alle {integration.syncInterval} Min.</span>
                    </div>
                    <div className="meta-item">
                      <BarChart3 size={14} />
                      <span>{integration.recordsSynced.toLocaleString('de-DE')} Datensätze</span>
                    </div>
                  </div>
                  {integration.error && (
                    <div className="integration-error">
                      <AlertTriangle size={14} />
                      <span>{integration.error}</span>
                    </div>
                  )}
                  <div className="integration-actions">
                    <button className="btn btn-sm btn-secondary">
                      <RefreshCw size={14} />
                      Sync
                    </button>
                    <button className="btn btn-sm btn-secondary">
                      <Settings size={14} />
                      Konfigurieren
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="logs-section">
          <div className="card">
            <div className="card-header">
              <h3>Synchronisierungs-Protokoll</h3>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Zeitpunkt</th>
                    <th>Integration</th>
                    <th>Status</th>
                    <th>Datensätze</th>
                    <th>Dauer</th>
                    <th>Nachricht</th>
                  </tr>
                </thead>
                <tbody>
                  {syncLogs.map(log => {
                    const status = getSyncLogStatus(log.status);
                    return (
                      <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString('de-DE')}</td>
                        <td><strong>{log.integrationName}</strong></td>
                        <td>
                          <span className="badge" style={{ backgroundColor: status.bg, color: status.color }}>
                            {status.label}
                          </span>
                        </td>
                        <td>{log.recordsProcessed}</td>
                        <td>{log.duration}s</td>
                        <td>
                          {log.error ? (
                            <span className="error-message">{log.error}</span>
                          ) : (
                            log.message
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClosingOverview;
