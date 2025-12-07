import { useState } from 'react';
import {
  Download,
  Settings,
  BarChart3,
  Calculator,
  FileText,
  Edit2,
  Save,
  X,
  TrendingDown,
  TrendingUp,
  Eye,
  CheckCircle
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
  Cell
} from 'recharts';

const CaptureOverview = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('magnets');
  const [variables, setVariables] = useState(mockData.globalVariables || []);
  const [editingVar, setEditingVar] = useState(null);
  const [editValue, setEditValue] = useState('');

  const leadMagnets = mockData.leadMagnets || [];
  const funnelAnalytics = mockData.funnelAnalytics || {};

  // Calculate totals
  const totalViews = leadMagnets.reduce((sum, m) => sum + m.metrics.views, 0);
  const totalCompletions = leadMagnets.reduce((sum, m) => sum + m.metrics.completions, 0);
  const totalLeads = leadMagnets.reduce((sum, m) => sum + m.metrics.leads, 0);
  const avgCompletionRate = totalViews > 0 ? ((totalCompletions / totalViews) * 100).toFixed(1) : 0;

  const getMagnetIcon = (type) => {
    switch (type) {
      case 'calculator': return <Calculator size={24} />;
      case 'download': return <FileText size={24} />;
      case 'quiz': return <CheckCircle size={24} />;
      default: return <Download size={24} />;
    }
  };

  const getMagnetTypeLabel = (type) => {
    const labels = {
      calculator: 'Rechner',
      download: 'Download',
      quiz: 'Quiz/Check'
    };
    return labels[type] || type;
  };

  const getMagnetTypeClass = (type) => {
    const map = {
      calculator: 'bg-blue-50 text-blue-600', // You can define these utilities or use inline style with var
      download: 'bg-green-50 text-green-600',
      quiz: 'bg-purple-50 text-purple-600'
    };
    // For now, let's stick to inline styles using the NEW palette variables for simplicity in this refactor, 
    // or better yet, return a color string and apply it cleanly.
    return ''; 
  };
  
  // Modern Palette for Charts
  const CHART_COLORS = {
    primary: '#2358A1', // SWK Blue
    secondary: '#E2001A', // SWK Red
    tertiary: '#cbd5e1', // Slate 300
    success: '#10b981',
    warning: '#f59e0b',
    purple: '#8b5cf6'
  };

  return (
    <div className="capture-overview">
      {/* KPI Bar */}
      <div className="kpi-bar">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2358A1' }}>
            <Eye size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{totalViews.toLocaleString('de-DE')}</span>
            <span className="kpi-label">Aufrufe gesamt</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{totalCompletions.toLocaleString('de-DE')}</span>
            <span className="kpi-label">Abgeschlossen</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
            <Download size={24} />
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
            <span className="kpi-value">{avgCompletionRate}%</span>
            <span className="kpi-label">Abschlussrate</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs">
        <button
          className={`section-tab ${activeTab === 'magnets' ? 'active' : ''}`}
          onClick={() => setActiveTab('magnets')}
        >
          <Download size={18} />
          Lead-Magneten
        </button>
        <button
          className={`section-tab ${activeTab === 'funnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('funnel')}
        >
          <BarChart3 size={18} />
          Funnel-Analyse
        </button>
        <button
          className={`section-tab ${activeTab === 'variables' ? 'active' : ''}`}
          onClick={() => setActiveTab('variables')}
        >
          <Settings size={18} />
          Variablen-Manager
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'magnets' && (
        <div className="lead-magnets-grid">
          {leadMagnets.map(magnet => (
            <div key={magnet.id} className="lead-magnet-card">
              <div className="magnet-header">
                <div className="magnet-icon" style={{
                  backgroundColor: magnet.type === 'calculator' ? '#eff6ff' :
                    magnet.type === 'download' ? '#ecfdf5' : '#f3e8ff',
                  color: magnet.type === 'calculator' ? '#2563eb' :
                    magnet.type === 'download' ? '#16a34a' : '#7c3aed'
                }}>
                  {getMagnetIcon(magnet.type)}
                </div>
                <div className="magnet-info">
                  <h4>{magnet.name}</h4>
                  <span className="magnet-type">{getMagnetTypeLabel(magnet.type)}</span>
                </div>
                <span className={`badge ${magnet.status === 'active' ? 'success' : 'neutral'}`}>
                  {magnet.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <p className="magnet-description">{magnet.description}</p>
              <div className="magnet-metrics">
                <div className="metric">
                  <span className="metric-value">{magnet.metrics.views.toLocaleString('de-DE')}</span>
                  <span className="metric-label">Aufrufe</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{magnet.metrics.completions.toLocaleString('de-DE')}</span>
                  <span className="metric-label">Fertig</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{magnet.metrics.completionRate.toFixed(1)}%</span>
                  <span className="metric-label">Rate</span>
                </div>
                <div className="metric highlight">
                  <span className="metric-value">{magnet.metrics.leads.toLocaleString('de-DE')}</span>
                  <span className="metric-label">Leads</span>
                </div>
              </div>
              {magnet.steps && magnet.steps.length > 0 && (
                <div className="magnet-funnel">
                  <h5>Abbruch-Analyse</h5>
                  <div className="funnel-steps">
                    {magnet.steps.map((step, index) => (
                      <div key={index} className="funnel-step">
                        <div className="step-bar">
                          <div
                            className="step-fill"
                            style={{
                              width: `${(step.views / magnet.steps[0].views) * 100}%`,
                              backgroundColor: step.dropOff > 15 ? '#ef4444' : step.dropOff > 10 ? '#f59e0b' : '#10b981'
                            }}
                          />
                        </div>
                        <div className="step-info">
                          <span className="step-name">{step.name}</span>
                          <span className="step-dropoff">
                            {step.dropOff > 0 && (
                              <>
                                <TrendingDown size={12} />
                                {step.dropOff}%
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'funnel' && (
        <div className="content-grid">
          <div className="card full-width">
            <div className="card-header">
              <h3>Gesamt-Funnel-Analyse</h3>
              <p className="text-sm text-muted">Visualisierung der Abbruchraten über alle Lead-Magneten</p>
            </div>
            {funnelData.length > 0 ? (
              <div className="chart-container" style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical" margin={{ left: 20, right: 30, top: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={150} stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value, name) => [value.toLocaleString('de-DE'), 'Besucher']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="value" name="Besucher" radius={[0, 4, 4, 0]} barSize={32}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[CHART_COLORS.primary, '#3b82f6', '#60a5fa', '#93c5fd'][index % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-state">
                <p>Keine Funnel-Daten verfügbar</p>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Abbruchgründe</h3>
            </div>
            <div className="dropoff-reasons">
              {funnelAnalytics.dropOffReasons?.map((reason, index) => (
                <div key={index} className="reason-item">
                  <div className="reason-bar">
                    <div
                      className="reason-fill"
                      style={{ width: `${reason.percentage}%` }}
                    />
                  </div>
                  <div className="reason-info">
                    <span className="reason-name">{reason.reason}</span>
                    <span className="reason-percentage">{reason.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Performance nach Produkt</h3>
            </div>
            <div className="product-stats">
              {funnelAnalytics.byProduct?.map((product, index) => (
                <div key={index} className="product-stat-row">
                  <span className="product-name">{product.product}</span>
                  <div className="product-metrics">
                    <span>{product.visitors.toLocaleString('de-DE')} Besucher</span>
                    <span className="highlight">{product.rate.toFixed(1)}% Conversion</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'variables' && (
        <div className="card">
          <div className="card-header">
            <h3>Globale Variablen</h3>
            <p className="card-description">
              Zentrale Konfiguration für Preise, Faktoren und Förderungen.
              Änderungen wirken sich auf alle Rechner und Formulare aus.
            </p>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Beschreibung</th>
                  <th>Wert</th>
                  <th>Einheit</th>
                  <th>Zuletzt aktualisiert</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {variables.map(variable => (
                  <tr key={variable.id}>
                    <td>
                      <code className="variable-key">{variable.key}</code>
                      <div className="variable-label">{variable.label}</div>
                    </td>
                    <td>{variable.description}</td>
                    <td>
                      {editingVar === variable.id ? (
                        <input
                          type="number"
                          step="0.001"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="variable-input"
                          autoFocus
                        />
                      ) : (
                        <span className="variable-value">{variable.value}</span>
                      )}
                    </td>
                    <td>{variable.unit}</td>
                    <td>{variable.lastUpdated}</td>
                    <td>
                      {editingVar === variable.id ? (
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => saveVariable(variable.id)}
                          >
                            <Save size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={cancelEditing}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => startEditing(variable)}
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureOverview;
