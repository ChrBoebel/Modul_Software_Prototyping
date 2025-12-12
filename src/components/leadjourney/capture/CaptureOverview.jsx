import { useState } from 'react';
import {
  Download,
  Settings,
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
import { theme } from '../../../theme/colors';

const CaptureOverview = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('magnets');
  const [variables, setVariables] = useState(mockData.globalVariables || []);
  const [editingVar, setEditingVar] = useState(null);
  const [editValue, setEditValue] = useState('');

  const leadMagnets = mockData.leadMagnets || [];

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

  const getMagnetVariant = (type) => {
    const map = {
      calculator: 'variant-secondary',
      download: 'variant-success',
      quiz: 'variant-primary'
    };
    return map[type] || 'variant-secondary';
  };

  const getDropOffColor = (dropOff) => {
    if (dropOff > 15) return theme.colors.danger;
    if (dropOff > 10) return theme.colors.slate500;
    return theme.colors.secondary;
  };

  // Edit logic helpers
  const startEditing = (variable) => {
    setEditingVar(variable.id);
    setEditValue(variable.value);
  };

  const cancelEditing = () => {
    setEditingVar(null);
    setEditValue('');
  };

  const saveVariable = (id) => {
    setVariables(prev => prev.map(v => 
      v.id === id ? { ...v, value: parseFloat(editValue), lastUpdated: new Date().toISOString().split('T')[0] } : v
    ));
    setEditingVar(null);
    showToast('Variable aktualisiert', 'success');
  };

  return (
    <div className="capture-overview">
      <h2 className="sr-only">Capture Phase Übersicht</h2>
      {/* Tab Navigation */}
      <div className="section-tabs" role="tablist">
        <button
          className={`section-tab ${activeTab === 'magnets' ? 'active' : ''}`}
          onClick={() => setActiveTab('magnets')}
          role="tab"
          aria-selected={activeTab === 'magnets'}
        >
          <Download size={18} aria-hidden="true" />
          Lead-Magneten
        </button>
        <button
          className={`section-tab ${activeTab === 'variables' ? 'active' : ''}`}
          onClick={() => setActiveTab('variables')}
          role="tab"
          aria-selected={activeTab === 'variables'}
        >
          <Settings size={18} aria-hidden="true" />
          Globale Werte
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'magnets' && (
        <div className="lead-magnets-grid" role="tabpanel">
          {leadMagnets.map(magnet => (
            <div key={magnet.id} className="lead-magnet-card">
              <div className="magnet-header">
                <div className={`magnet-icon ${getMagnetVariant(magnet.type)}`} aria-hidden="true">
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
                  <span className="metric-value">{((magnet.metrics.completions / magnet.metrics.views) * 100).toFixed(1)}%</span>
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
                              backgroundColor: getDropOffColor(step.dropOff)
                            }}
                          />
                        </div>
                        <div className="step-info">
                          <span className="step-name">{step.name}</span>
                          <span 
                            className="step-dropoff"
                            style={{ color: getDropOffColor(step.dropOff) }}
                          >
                            {step.dropOff > 0 && (
                              <>
                                <TrendingDown size={12} aria-hidden="true" />
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

      {activeTab === 'variables' && (
        <div className="card" role="tabpanel">
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
                          aria-label={`Wert für ${variable.label} bearbeiten`}
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
                            aria-label="Speichern"
                          >
                            <Save size={14} aria-hidden="true" />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={cancelEditing}
                            aria-label="Abbrechen"
                          >
                            <X size={14} aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => startEditing(variable)}
                          aria-label={`${variable.label} bearbeiten`}
                        >
                          <Edit2 size={14} aria-hidden="true" />
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
