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
  Mail,
  Phone,
  Settings
} from 'lucide-react';
import { mockData } from '../../../data/mockData';
import { theme } from '../../../theme/colors';
import { Avatar } from '../../ui/Avatar';
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
  const [activeTab, setActiveTab] = useState('sales');

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
      case 'connected': return (
        <>
          <CheckCircle size={16} color={theme.colors.success} aria-hidden="true" />
          <span className="sr-only">Status: Verbunden</span>
        </>
      );
      case 'warning': return (
        <>
          <AlertTriangle size={16} color={theme.colors.warning} aria-hidden="true" />
          <span className="sr-only">Status: Warnung</span>
        </>
      );
      case 'disconnected':
      case 'error': return (
        <>
          <XCircle size={16} color={theme.colors.danger} aria-hidden="true" />
          <span className="sr-only">Status: Fehler</span>
        </>
      );
      default: return (
        <>
          <Clock size={16} color={theme.colors.slate400} aria-hidden="true" />
          <span className="sr-only">Status: Unbekannt</span>
        </>
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'disconnected':
      case 'error': return theme.colors.danger;
      default: return theme.colors.slate400;
    }
  };

  const getSyncLogStatus = (status) => {
    const styles = {
      success: { bg: 'var(--success-light)', color: 'var(--success)', label: 'Erfolgreich' },
      error: { bg: 'var(--danger-light)', color: 'var(--danger)', label: 'Fehler' },
      warning: { bg: 'var(--warning-light)', color: 'var(--warning)', label: 'Warnung' }
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
      <h2 className="sr-only">Closing & Sales Übersicht</h2>
      {/* KPI Bar */}
      <div className="kpi-bar">
        <div className="kpi-card">
          <div className="kpi-icon variant-success" aria-hidden="true">
            <DollarSign size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{(totalPipelineValue / 1000000).toFixed(1)}M €</span>
            <span className="kpi-label">Pipeline-Wert</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon variant-secondary" aria-hidden="true">
            <TrendingUp size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{overallConversion}%</span>
            <span className="kpi-label">Conversion-Rate</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon variant-warning" aria-hidden="true">
            <UserCheck size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{avgDealValue.toLocaleString('de-DE')} €</span>
            <span className="kpi-label">Ø Deal-Wert</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon variant-primary" aria-hidden="true">
            <Link2 size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{connectedIntegrations}/{integrations.length}</span>
            <span className="kpi-label">Integrationen</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs" role="tablist">
        <button
          className={`section-tab ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
          role="tab"
          aria-selected={activeTab === 'sales'}
        >
          <Users size={16} aria-hidden="true" />
          Vertriebsteam
        </button>
        <button
          className={`section-tab ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
          role="tab"
          aria-selected={activeTab === 'integrations'}
        >
          <Link2 size={16} aria-hidden="true" />
          Integrationen
        </button>
        <button
          className={`section-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
          role="tab"
          aria-selected={activeTab === 'logs'}
        >
          <Clock size={16} aria-hidden="true" />
          Sync-Protokoll
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'sales' && (
        <div className="sales-section" role="tabpanel">
          <div className="card">
            <div className="card-header">
              <h3>Vertriebsteam</h3>
            </div>
            <div className="sales-reps-grid">
              {salesReps.map(rep => (
                <div key={rep.id} className="sales-rep-card">
                  <div className="rep-header">
                    <Avatar name={rep.name} size="lg" usePlaceholder type="person" />
                    <div className="rep-info">
                      <h4>{rep.name}</h4>
                      <span className="rep-department">{rep.department}</span>
                    </div>
                    <span className={`status-badge ${rep.status}`}>
                      {rep.status === 'active' ? 'Aktiv' : rep.status === 'vacation' ? 'Urlaub' : rep.status}
                    </span>
                  </div>
                  <div className="rep-contact">
                    <a href={`mailto:${rep.email}`} aria-label={`E-Mail an ${rep.name}`}>
                      <Mail size={14} aria-hidden="true" />
                      {rep.email}
                    </a>
                    <a href={`tel:${rep.phone}`} aria-label={`Anruf an ${rep.name}`}>
                      <Phone size={14} aria-hidden="true" />
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
        <div className="integrations-section" role="tabpanel">
          <div className="card">
            <div className="card-header">
              <h3>System-Integrationen</h3>
              <button className="btn btn-secondary" onClick={() => showToast('Synchronisierung gestartet', 'info')}>
                <RefreshCw size={16} aria-hidden="true" />
                Alle synchronisieren
              </button>
            </div>
            <div className="integrations-grid">
              {integrations.map(integration => (
                <div key={integration.id} className="integration-card">
                  <div className="integration-header">
                    <Avatar name={integration.name} size="md" usePlaceholder type="company" />
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
                      <Clock size={14} aria-hidden="true" />
                      <span>Letzte Sync: {new Date(integration.lastSync).toLocaleString('de-DE')}</span>
                    </div>
                    <div className="meta-item">
                      <RefreshCw size={14} aria-hidden="true" />
                      <span>Alle {integration.syncInterval} Min.</span>
                    </div>
                    <div className="meta-item">
                      <BarChart3 size={14} aria-hidden="true" />
                      <span>{integration.recordsSynced.toLocaleString('de-DE')} Datensätze</span>
                    </div>
                  </div>
                  {integration.error && (
                    <div className="integration-error" role="alert">
                      <AlertTriangle size={14} aria-hidden="true" />
                      <span>{integration.error}</span>
                    </div>
                  )}
                  <div className="integration-actions">
                    <button className="btn btn-sm btn-secondary" aria-label={`${integration.name} synchronisieren`}>
                      <RefreshCw size={14} aria-hidden="true" />
                      Sync
                    </button>
                    <button className="btn btn-sm btn-secondary" aria-label={`${integration.name} konfigurieren`}>
                      <Settings size={14} aria-hidden="true" />
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
