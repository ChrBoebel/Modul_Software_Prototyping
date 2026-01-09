import { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  ThumbsUp,
  ThumbsDown,
  History,
  User,
  Package,
  FileCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  ChevronDown
} from 'lucide-react';

const LeadDetail = ({ lead, showToast, onClose }) => {
  const [activeStatus, setActiveStatus] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    product: true,
    scoreHistory: false,
    activities: false,
    consents: false
  });
  const [showAllActivities, setShowAllActivities] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Mock score history
  const scoreHistory = [
    { step: 1, scoreAlt: 0, scoreNeu: 20, grund: 'Formular gestartet', datum: '2025-01-15 10:20' },
    { step: 2, scoreAlt: 20, scoreNeu: 45, grund: 'Kontaktdaten eingegeben', datum: '2025-01-15 10:22' },
    { step: 3, scoreAlt: 45, scoreNeu: 72, grund: 'Produktinteresse: Solar PV', datum: '2025-01-15 10:23' },
    { step: 4, scoreAlt: 72, scoreNeu: 92, grund: 'Eigentümer bestätigt', datum: '2025-01-15 10:23' }
  ];

  // Mock activity timeline
  const activities = [
    { id: 1, type: 'status', icon: CheckCircle, color: 'var(--success)', title: 'Status auf "Grün" gesetzt', user: 'Max Mustermann', timestamp: '2025-01-16 14:30' },
    { id: 2, type: 'call', icon: Phone, color: 'var(--primary)', title: 'Telefonkontakt versucht', user: 'Max Mustermann', description: 'Nicht erreicht - Mailbox', timestamp: '2025-01-16 11:15' },
    { id: 3, type: 'assignment', icon: UserPlus, color: 'var(--secondary)', title: 'Lead zugewiesen', user: 'System', description: 'Zugewiesen an Max Mustermann', timestamp: '2025-01-15 16:00' },
    { id: 4, type: 'email', icon: Mail, color: 'var(--primary)', title: 'E-Mail gesendet', user: 'System', description: 'Willkommens-Mail versendet', timestamp: '2025-01-15 10:25' },
    { id: 5, type: 'created', icon: AlertCircle, color: 'var(--warning)', title: 'Lead erstellt', user: 'System', description: 'Über Formular "Solar PV Anfrage"', timestamp: '2025-01-15 10:20' }
  ];

  // Mock personal data
  const personalData = {
    name: lead?.name || 'Max Muster',
    email: lead?.email || 'max.muster@email.de',
    phone: lead?.phone || '+49 171 1234567',
    address: 'Musterstraße 123, 78462 Konstanz',
    birthdate: '1985-06-15'
  };

  // Mock product data
  const productData = {
    interest: lead?.produkt || 'Solar PV',
    dachflaeche: '80 m²',
    ausrichtung: 'Süd-West',
    stromverbrauch: '4.500 kWh/Jahr',
    eigentuemer: 'Ja',
    budget: '15.000 - 25.000 EUR'
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    showToast(`Lead Status: ${status}`);
  };

  // Displayed activities (limited or all)
  const displayedActivities = showAllActivities ? activities : activities.slice(0, 2);

  // Collapsible Section Component
  const CollapsibleSection = ({ id, icon: Icon, title, children }) => (
    <div className={`detail-section collapsible ${expandedSections[id] ? 'expanded' : 'collapsed'}`}>
      <button
        type="button"
        className="section-header-btn"
        onClick={() => toggleSection(id)}
        aria-expanded={expandedSections[id]}
      >
        <div className="section-title">
          <Icon size={16} />
          <h4>{title}</h4>
        </div>
        <ChevronDown
          size={16}
          className={`section-chevron ${expandedSections[id] ? 'open' : ''}`}
        />
      </button>
      {expandedSections[id] && (
        <div className="section-body">
          {children}
        </div>
      )}
    </div>
  );

  if (!lead) return null;

  return (
    <div className="lead-detail" role="region" aria-label={`Details für Lead ${lead.leadId}`}>
      {/* Header */}
      <div className="detail-header">
        <div className="header-info">
          <h3>Lead {lead.leadId} Details</h3>
          <span className={`score-badge ${lead.leadScore >= 80 ? 'high' : lead.leadScore >= 50 ? 'medium' : 'low'}`}>
            Score: {lead.leadScore}
          </span>
        </div>
        <button 
          type="button" 
          className="btn btn-link" 
          onClick={onClose} 
          aria-label={`Details für ${lead.leadId} schließen`}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Status Buttons */}
      <div className="status-buttons">
        <button
          type="button"
          className={`btn ${activeStatus === 'kontakt' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusChange('kontakt')}
          aria-pressed={activeStatus === 'kontakt'}
        >
          <Phone size={16} />
          Kontakt
        </button>
        <button
          type="button"
          className={`btn ${activeStatus === 'priorisieren' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusChange('priorisieren')}
          aria-pressed={activeStatus === 'priorisieren'}
        >
          <ThumbsUp size={16} />
          Priorisieren
        </button>
        <button
          type="button"
          className={`btn ${activeStatus === 'abgelehnt' ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => handleStatusChange('abgelehnt')}
          aria-pressed={activeStatus === 'abgelehnt'}
        >
          <ThumbsDown size={16} />
          Abgelehnt
        </button>
      </div>

      {/* Content Sections */}
      <div className="detail-content">
        {/* Persönliche Daten */}
        <CollapsibleSection id="personal" icon={User} title="Persönliche Daten">
          <div className="section-content">
            <div className="data-grid">
              <div className="data-row">
                <span className="label">Name:</span>
                <span className="value">{personalData.name}</span>
              </div>
              <div className="data-row">
                <span className="label">Telefon:</span>
                <span className="value">{personalData.phone}</span>
              </div>
              <div className="data-row">
                <span className="label">E-Mail:</span>
                <span className="value">{personalData.email}</span>
              </div>
              <div className="data-row">
                <span className="label">Geburtsdatum:</span>
                <span className="value">{personalData.birthdate}</span>
              </div>
              <div className="data-row full-width">
                <span className="label">Adresse:</span>
                <span className="value">{personalData.address}</span>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Produktdaten / Sales Daten */}
        <CollapsibleSection id="product" icon={Package} title="Produktdaten, Sales Daten">
          <div className="section-content">
            <div className="data-grid">
              <div className="data-row">
                <span className="label">Produktinteresse:</span>
                <span className="value">{productData.interest}</span>
              </div>
              <div className="data-row">
                <span className="label">Dachfläche:</span>
                <span className="value">{productData.dachflaeche}</span>
              </div>
              <div className="data-row">
                <span className="label">Ausrichtung:</span>
                <span className="value">{productData.ausrichtung}</span>
              </div>
              <div className="data-row">
                <span className="label">Stromverbrauch:</span>
                <span className="value">{productData.stromverbrauch}</span>
              </div>
              <div className="data-row">
                <span className="label">Eigentümer:</span>
                <span className="value">{productData.eigentuemer}</span>
              </div>
              <div className="data-row">
                <span className="label">Budget:</span>
                <span className="value">{productData.budget}</span>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Score-Historie */}
        <CollapsibleSection id="scoreHistory" icon={History} title="Score-Historie">
          <div className="table-wrapper">
            <table className="data-table score-table">
              <thead>
                <tr>
                  <th>Schritt</th>
                  <th>Vorher</th>
                  <th>Nachher</th>
                  <th>Grund</th>
                </tr>
              </thead>
              <tbody>
                {scoreHistory.map((item) => (
                  <tr key={item.step}>
                    <td>{item.step}</td>
                    <td>{item.scoreAlt}</td>
                    <td>{item.scoreNeu}</td>
                    <td>{item.grund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* Aktivitäten Timeline */}
        <CollapsibleSection id="activities" icon={Clock} title={`Aktivitäten (${activities.length})`}>
          <div className="activity-timeline">
            {displayedActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="timeline-item">
                  <div className="timeline-icon" style={{ backgroundColor: activity.color }}>
                    <Icon size={14} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-title">{activity.title}</span>
                      <span className="timeline-time">{activity.timestamp}</span>
                    </div>
                    {activity.description && (
                      <p className="timeline-description">{activity.description}</p>
                    )}
                    <span className="timeline-user">{activity.user}</span>
                  </div>
                </div>
              );
            })}
            {activities.length > 2 && !showAllActivities && (
              <button
                type="button"
                className="btn btn-link show-more-btn"
                onClick={() => setShowAllActivities(true)}
              >
                +{activities.length - 2} weitere anzeigen
              </button>
            )}
            {showAllActivities && activities.length > 2 && (
              <button
                type="button"
                className="btn btn-link show-more-btn"
                onClick={() => setShowAllActivities(false)}
              >
                Weniger anzeigen
              </button>
            )}
          </div>
        </CollapsibleSection>

        {/* Einwilligungen */}
        <CollapsibleSection id="consents" icon={FileCheck} title="Einwilligungen">
          <div className="section-content consent-section">
            <div className="consent-item">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked disabled readOnly />
                <span>Marketing</span>
              </label>
            </div>
            <div className="consent-item">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked disabled readOnly />
                <span>Datenschutz</span>
              </label>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default LeadDetail;
