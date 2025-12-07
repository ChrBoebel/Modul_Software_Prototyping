import { useState } from 'react';
import {
  Heart,
  Mail,
  GitBranch,
  Image,
  Play,
  Pause,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Copy,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  MousePointer
} from 'lucide-react';
import { mockData } from '../../../data/mockData';
import JourneyBuilder from './JourneyBuilder';

const NurturingOverview = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('journeys');
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const journeys = mockData.journeys || [];
  const emailTemplates = mockData.emailTemplates || [];
  const assets = mockData.assets || [];

  // Calculate totals
  const totalEnrolled = journeys.reduce((sum, j) => sum + j.stats.enrolled, 0);
  const totalConverted = journeys.reduce((sum, j) => sum + j.stats.converted, 0);
  const activeJourneys = journeys.filter(j => j.status === 'active').length;
  const avgConversion = totalEnrolled > 0 ? ((totalConverted / totalEnrolled) * 100).toFixed(1) : 0;

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: '#dcfce7', color: '#166534', label: 'Aktiv' },
      draft: { bg: '#e5e7eb', color: '#374151', label: 'Entwurf' },
      paused: { bg: '#fef3c7', color: '#92400e', label: 'Pausiert' }
    };
    const style = styles[status] || styles.draft;
    return (
      <span className="badge" style={{ backgroundColor: style.bg, color: style.color }}>
        {style.label}
      </span>
    );
  };

  const getCategoryLabel = (category) => {
    const labels = {
      welcome: 'Willkommen',
      followup: 'Follow-up',
      offer: 'Angebot',
      education: 'Ratgeber',
      information: 'Information'
    };
    return labels[category] || category;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const openJourneyBuilder = (journey) => {
    setSelectedJourney(journey);
    setActiveTab('builder');
  };

  return (
    <div className="nurturing-overview">
      {/* KPI Bar */}
      <div className="kpi-bar">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fce7f3' }}>
            <GitBranch size={20} color="#db2777" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{activeJourneys}</span>
            <span className="kpi-label">Aktive Journeys</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#dbeafe' }}>
            <Users size={20} color="#2563eb" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{totalEnrolled.toLocaleString('de-DE')}</span>
            <span className="kpi-label">Eingeschrieben</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#dcfce7' }}>
            <CheckCircle size={20} color="#16a34a" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{totalConverted.toLocaleString('de-DE')}</span>
            <span className="kpi-label">Konvertiert</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fef3c7' }}>
            <TrendingUp size={20} color="#d97706" />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{avgConversion}%</span>
            <span className="kpi-label">Conversion-Rate</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs">
        <button
          className={`section-tab ${activeTab === 'journeys' ? 'active' : ''}`}
          onClick={() => { setActiveTab('journeys'); setSelectedJourney(null); }}
        >
          <GitBranch size={16} />
          Journeys
        </button>
        <button
          className={`section-tab ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('builder')}
          disabled={!selectedJourney}
        >
          <Play size={16} />
          Journey Builder
        </button>
        <button
          className={`section-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Mail size={16} />
          E-Mail-Templates
        </button>
        <button
          className={`section-tab ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => setActiveTab('assets')}
        >
          <Image size={16} />
          Asset-Bibliothek
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'journeys' && (
        <div className="journeys-list">
          <div className="list-header">
            <h3>E-Mail-Journeys</h3>
            <button className="btn btn-primary" onClick={() => showToast('Journey-Erstellung in Entwicklung', 'info')}>
              <Plus size={16} />
              Neue Journey
            </button>
          </div>
          <div className="journeys-grid">
            {journeys.map(journey => (
              <div key={journey.id} className="journey-card">
                <div className="journey-header">
                  <div className="journey-info">
                    <h4>{journey.name}</h4>
                    <p>{journey.description}</p>
                  </div>
                  {getStatusBadge(journey.status)}
                </div>
                <div className="journey-stats">
                  <div className="stat">
                    <Users size={14} />
                    <span>{journey.stats.enrolled} eingeschrieben</span>
                  </div>
                  <div className="stat">
                    <Play size={14} />
                    <span>{journey.stats.active} aktiv</span>
                  </div>
                  <div className="stat">
                    <CheckCircle size={14} />
                    <span>{journey.stats.converted} konvertiert</span>
                  </div>
                  <div className="stat highlight">
                    <TrendingUp size={14} />
                    <span>{journey.stats.conversionRate}% Rate</span>
                  </div>
                </div>
                <div className="journey-meta">
                  <span>Erstellt: {journey.createdDate}</span>
                  <span>Aktualisiert: {journey.lastModified}</span>
                </div>
                <div className="journey-actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openJourneyBuilder(journey)}
                  >
                    <Edit2 size={14} />
                    Bearbeiten
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    <Copy size={14} />
                    Duplizieren
                  </button>
                  {journey.status === 'active' ? (
                    <button className="btn btn-sm btn-secondary">
                      <Pause size={14} />
                      Pausieren
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-secondary">
                      <Play size={14} />
                      Aktivieren
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'builder' && selectedJourney && (
        <JourneyBuilder
          journey={selectedJourney}
          showToast={showToast}
          onClose={() => { setActiveTab('journeys'); setSelectedJourney(null); }}
        />
      )}

      {activeTab === 'templates' && (
        <div className="templates-section">
          <div className="list-header">
            <h3>E-Mail-Templates</h3>
            <button className="btn btn-primary" onClick={() => showToast('Template-Erstellung in Entwicklung', 'info')}>
              <Plus size={16} />
              Neues Template
            </button>
          </div>
          <div className="templates-grid">
            {emailTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <span className="template-category">{getCategoryLabel(template.category)}</span>
                  </div>
                  {template.abTest?.enabled && (
                    <span className="badge badge-info">A/B Test</span>
                  )}
                </div>
                <div className="template-subject">
                  <Mail size={14} />
                  <span>{template.subject}</span>
                </div>
                <div className="template-stats">
                  <div className="stat">
                    <span className="stat-value">{template.stats.sent.toLocaleString('de-DE')}</span>
                    <span className="stat-label">Gesendet</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{template.stats.openRate}%</span>
                    <span className="stat-label">Öffnungsrate</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{template.stats.clickRate}%</span>
                    <span className="stat-label">Klickrate</span>
                  </div>
                </div>
                {template.abTest?.enabled && template.abTest.winner && (
                  <div className="ab-test-result">
                    <span>Gewinner: Variante {template.abTest.winner}</span>
                    <span className="winner-rate">
                      {template.abTest.winner === 'A'
                        ? template.abTest.variantA.stats.openRate
                        : template.abTest.variantB.stats.openRate}% Öffnungsrate
                    </span>
                  </div>
                )}
                <div className="template-actions">
                  <button className="btn btn-sm btn-secondary">
                    <Eye size={14} />
                    Vorschau
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    <Edit2 size={14} />
                    Bearbeiten
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    <BarChart3 size={14} />
                    Statistiken
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="assets-section">
          <div className="list-header">
            <h3>Asset-Bibliothek</h3>
            <button className="btn btn-primary" onClick={() => showToast('Upload in Entwicklung', 'info')}>
              <Plus size={16} />
              Asset hochladen
            </button>
          </div>
          <div className="assets-grid">
            {assets.map(asset => (
              <div key={asset.id} className="asset-card">
                <div className="asset-preview">
                  {asset.type === 'pdf' ? (
                    <FileText size={48} />
                  ) : (
                    <Image size={48} />
                  )}
                </div>
                <div className="asset-info">
                  <h4>{asset.name}</h4>
                  <div className="asset-meta">
                    <span>{formatFileSize(asset.size)}</span>
                    <span>{asset.uploadDate}</span>
                  </div>
                  <div className="asset-downloads">
                    <MousePointer size={12} />
                    <span>{asset.downloads} Downloads</span>
                  </div>
                </div>
                <div className="asset-actions">
                  <button className="btn btn-sm btn-secondary">
                    <Eye size={14} />
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    <Copy size={14} />
                  </button>
                  <button className="btn btn-sm btn-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NurturingOverview;
