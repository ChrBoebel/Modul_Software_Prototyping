import { useState } from 'react';
import {
  CheckCircle,
  Settings,
  LayoutGrid,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Zap,
  Clock,
  Home,
  Package,
  Euro,
  User
} from 'lucide-react';
import { mockData } from '../../../data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const QualificationOverview = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('scoring');
  const [scoringRules, setScoringRules] = useState(mockData.scoringRules || []);
  const [thresholds, setThresholds] = useState(mockData.scoreThresholds || { mql: 50, sql: 75, hot: 90 });
  const [editingRule, setEditingRule] = useState(null);
  const [editingThresholds, setEditingThresholds] = useState(false);

  const leads = mockData.leads || [];
  const pipelineStages = mockData.pipelineStages || [];
  const scoreHistory = mockData.scoreHistory || [];

  // Calculate stats
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.qualification?.score >= thresholds.mql).length;
  const hotLeads = leads.filter(l => l.qualification?.score >= thresholds.hot).length;
  const avgScore = leads.length > 0
    ? (leads.reduce((sum, l) => sum + (l.qualification?.score || 0), 0) / leads.length).toFixed(1)
    : 0;

  // Group leads by pipeline stage
  const leadsByStage = pipelineStages.map(stage => ({
    ...stage,
    leads: leads.filter(l => l.status === stage.id)
  }));

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'property': return <Home size={14} />;
      case 'product': return <Package size={14} />;
      case 'financial': return <Euro size={14} />;
      case 'timing': return <Clock size={14} />;
      case 'consumption': return <Zap size={14} />;
      case 'customer': return <User size={14} />;
      default: return <Settings size={14} />;
    }
  };

  const toggleRuleActive = (ruleId) => {
    setScoringRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, active: !r.active } : r
    ));
    showToast('Regel aktualisiert', 'success');
  };

  const updateRulePoints = (ruleId, points) => {
    setScoringRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, points: parseInt(points) || 0 } : r
    ));
  };

  const saveThresholds = () => {
    setEditingThresholds(false);
    showToast('Schwellenwerte gespeichert', 'success');
  };

  const getScoreBadge = (score) => {
    if (score >= thresholds.hot) return { label: 'Hot', color: '#dc2626', bg: '#fef2f2' };
    if (score >= thresholds.sql) return { label: 'SQL', color: '#16a34a', bg: '#dcfce7' };
    if (score >= thresholds.mql) return { label: 'MQL', color: '#2563eb', bg: '#dbeafe' };
    return { label: 'Neu', color: '#6b7280', bg: '#f3f4f6' };
  };

  return (
    <div className="qualification-overview">
      {/* KPI Bar */}
      <div className="kpi-bar">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#dbeafe' }}>
            <Users size={20} color="#2563eb" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{totalLeads}</span>
            <span className="kpi-label">Leads gesamt</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#dcfce7' }}>
            <CheckCircle size={20} color="#16a34a" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{qualifiedLeads}</span>
            <span className="kpi-label">Qualifiziert (MQL+)</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fef2f2' }}>
            <Zap size={20} color="#dc2626" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{hotLeads}</span>
            <span className="kpi-label">Hot Leads</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fef3c7' }}>
            <Target size={20} color="#d97706" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{avgScore}</span>
            <span className="kpi-label">Durchschnittsscore</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs">
        <button
          className={`section-tab ${activeTab === 'scoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('scoring')}
        >
          <Settings size={16} />
          Scoring-Regeln
        </button>
        <button
          className={`section-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('pipeline')}
        >
          <LayoutGrid size={16} />
          Pipeline (Kanban)
        </button>
        <button
          className={`section-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <BarChart3 size={16} />
          Score-Historie
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'scoring' && (
        <div className="scoring-section">
          {/* Thresholds Card */}
          <div className="card thresholds-card">
            <div className="card-header">
              <h3>Schwellenwerte</h3>
              {!editingThresholds ? (
                <button className="btn btn-sm btn-secondary" onClick={() => setEditingThresholds(true)}>
                  <Edit2 size={14} />
                  Bearbeiten
                </button>
              ) : (
                <div className="header-actions">
                  <button className="btn btn-sm btn-primary" onClick={saveThresholds}>
                    <Save size={14} />
                    Speichern
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => setEditingThresholds(false)}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="thresholds-grid">
              <div className="threshold-item">
                <div className="threshold-label">
                  <span className="threshold-badge" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>MQL</span>
                  <span>Marketing Qualified Lead</span>
                </div>
                {editingThresholds ? (
                  <input
                    type="number"
                    value={thresholds.mql}
                    onChange={(e) => setThresholds(prev => ({ ...prev, mql: parseInt(e.target.value) }))}
                    className="threshold-input"
                  />
                ) : (
                  <span className="threshold-value">≥ {thresholds.mql} Punkte</span>
                )}
              </div>
              <div className="threshold-item">
                <div className="threshold-label">
                  <span className="threshold-badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>SQL</span>
                  <span>Sales Qualified Lead</span>
                </div>
                {editingThresholds ? (
                  <input
                    type="number"
                    value={thresholds.sql}
                    onChange={(e) => setThresholds(prev => ({ ...prev, sql: parseInt(e.target.value) }))}
                    className="threshold-input"
                  />
                ) : (
                  <span className="threshold-value">≥ {thresholds.sql} Punkte</span>
                )}
              </div>
              <div className="threshold-item">
                <div className="threshold-label">
                  <span className="threshold-badge" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>Hot</span>
                  <span>Heißer Lead</span>
                </div>
                {editingThresholds ? (
                  <input
                    type="number"
                    value={thresholds.hot}
                    onChange={(e) => setThresholds(prev => ({ ...prev, hot: parseInt(e.target.value) }))}
                    className="threshold-input"
                  />
                ) : (
                  <span className="threshold-value">≥ {thresholds.hot} Punkte</span>
                )}
              </div>
            </div>
          </div>

          {/* Scoring Rules Table */}
          <div className="card">
            <div className="card-header">
              <h3>Scoring-Regeln</h3>
              <button className="btn btn-primary" onClick={() => showToast('Regel-Erstellung in Entwicklung', 'info')}>
                <Plus size={16} />
                Neue Regel
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table scoring-table">
                <thead>
                  <tr>
                    <th>Aktiv</th>
                    <th>Regel</th>
                    <th>Kategorie</th>
                    <th>Bedingung</th>
                    <th>Punkte</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {scoringRules.map(rule => (
                    <tr key={rule.id} className={!rule.active ? 'inactive' : ''}>
                      <td>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={rule.active}
                            onChange={() => toggleRuleActive(rule.id)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </td>
                      <td>
                        <div className="rule-info">
                          <strong>{rule.name}</strong>
                          <span>{rule.description}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">
                          {getCategoryIcon(rule.category)}
                          {mockData.ruleCategories?.find(c => c.id === rule.category)?.label || rule.category}
                        </span>
                      </td>
                      <td>
                        <code className="condition-code">
                          {rule.field} {rule.condition === 'equals' ? '=' : rule.condition === 'greater_than' ? '>' : rule.condition === 'less_than' ? '<' : rule.condition} {String(rule.value)}
                        </code>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={rule.points}
                          onChange={(e) => updateRulePoints(rule.id, e.target.value)}
                          className={`points-input ${rule.points >= 0 ? 'positive' : 'negative'}`}
                        />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-secondary">
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-sm btn-danger">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="pipeline-section">
          <div className="kanban-board">
            {leadsByStage.map(stage => (
              <div key={stage.id} className="kanban-column">
                <div className="kanban-column-header" style={{ borderColor: stage.color }}>
                  <h4>{stage.label}</h4>
                  <span className="column-count">{stage.leads.length}</span>
                </div>
                <div className="kanban-cards">
                  {stage.leads.map(lead => {
                    const scoreBadge = getScoreBadge(lead.qualification?.score || 0);
                    return (
                      <div key={lead.id} className="kanban-card">
                        <div className="card-header">
                          <span className="lead-number">{lead.leadNumber}</span>
                          <span
                            className="score-badge"
                            style={{ backgroundColor: scoreBadge.bg, color: scoreBadge.color }}
                          >
                            {lead.qualification?.score || 0}
                          </span>
                        </div>
                        <div className="card-content">
                          <h5>{lead.customer?.firstName} {lead.customer?.lastName}</h5>
                          <span className="lead-product">{lead.interest?.type}</span>
                        </div>
                        <div className="card-footer">
                          <span className="lead-date">
                            {new Date(lead.timestamp).toLocaleDateString('de-DE')}
                          </span>
                          <span
                            className="qualification-badge"
                            style={{ backgroundColor: scoreBadge.bg, color: scoreBadge.color }}
                          >
                            {scoreBadge.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {stage.leads.length === 0 && (
                    <div className="kanban-empty">
                      <span>Keine Leads</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="history-section">
          <div className="card full-width">
            <div className="card-header">
              <h3>Score-Änderungen</h3>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Zeitpunkt</th>
                    <th>Lead-ID</th>
                    <th>Vorher</th>
                    <th>Nachher</th>
                    <th>Änderung</th>
                    <th>Grund</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreHistory.map(entry => {
                    const change = entry.newScore - entry.previousScore;
                    return (
                      <tr key={entry.id}>
                        <td>{new Date(entry.timestamp).toLocaleString('de-DE')}</td>
                        <td>
                          <code>Lead #{entry.leadId}</code>
                        </td>
                        <td>{entry.previousScore}</td>
                        <td><strong>{entry.newScore}</strong></td>
                        <td>
                          <span className={`change-badge ${change >= 0 ? 'positive' : 'negative'}`}>
                            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {change >= 0 ? '+' : ''}{change}
                          </span>
                        </td>
                        <td>{entry.reason}</td>
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

export default QualificationOverview;
