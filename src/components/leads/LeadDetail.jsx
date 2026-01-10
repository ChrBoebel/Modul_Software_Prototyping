import { useState, useMemo } from 'react';
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
  ChevronDown,
  GitBranch,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  getCombinedAvailabilityForAddress,
  getStatusBadgeVariant,
  getStatusLabel
} from '../produkt-mapping/availabilityLogic';

const LeadDetail = ({ lead, showToast, onClose, onNavigateToCampaign }) => {
  const [activeStatus, setActiveStatus] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    source: true,
    personal: true,
    product: true,
    availability: false,
    scoreHistory: false,
    activities: false,
    consents: false
  });
  const [showAllActivities, setShowAllActivities] = useState(false);

  // Load product mapping data from localStorage
  const [products] = useLocalStorage('swk:productCatalog', []);
  const [rules] = useLocalStorage('swk:availabilityRules', []);
  const [addresses] = useLocalStorage('swk:addresses', []);
  const [availability] = useLocalStorage('swk:availability', []);
  const [availabilityStatus] = useLocalStorage('swk:availabilityStatus', []);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Check if lead has flow data (generated from flow preview)
  const hasFlowData = Boolean(lead?.originalData?.flowId);
  const flowAnswers = lead?.originalData?.qualification?.flowAnswers || [];

  // Score history from flow answers or fallback to mock
  const scoreHistory = useMemo(() => {
    if (flowAnswers.length > 0) {
      let runningScore = 50; // Base score
      return flowAnswers.map((a, idx) => {
        const prevScore = runningScore;
        runningScore = Math.min(100, Math.max(0, runningScore + (a.score || 0) * 5));
        return {
          step: idx + 1,
          scoreAlt: prevScore,
          scoreNeu: runningScore,
          grund: a.question || 'Frage beantwortet',
          datum: lead?.timestamp || ''
        };
      });
    }
    // Fallback mock for static leads
    return [
      { step: 1, scoreAlt: 0, scoreNeu: 20, grund: 'Formular gestartet', datum: lead?.timestamp || '' },
      { step: 2, scoreAlt: 20, scoreNeu: 45, grund: 'Kontaktdaten eingegeben', datum: lead?.timestamp || '' },
      { step: 3, scoreAlt: 45, scoreNeu: 72, grund: 'Produktinteresse bestätigt', datum: lead?.timestamp || '' },
      { step: 4, scoreAlt: 72, scoreNeu: lead?.leadScore || 92, grund: 'Qualifizierung abgeschlossen', datum: lead?.timestamp || '' }
    ];
  }, [flowAnswers, lead?.timestamp, lead?.leadScore]);

  // Activity timeline - dynamic for flow leads
  const activities = useMemo(() => {
    const baseActivities = [
      {
        id: 1,
        type: 'created',
        icon: AlertCircle,
        color: 'var(--warning)',
        title: 'Lead erstellt',
        user: 'System',
        description: hasFlowData
          ? `Über Flow: ${lead?.originalData?.source || 'Unbekannt'}`
          : 'Über Webformular',
        timestamp: lead?.timestamp || ''
      }
    ];

    // Add flow completion activity if available
    if (hasFlowData && flowAnswers.length > 0) {
      baseActivities.unshift({
        id: 2,
        type: 'score',
        icon: CheckCircle,
        color: 'var(--success)',
        title: `Flow abgeschlossen mit Score ${lead?.leadScore || 0}`,
        user: 'System',
        description: `${flowAnswers.length} Fragen beantwortet`,
        timestamp: lead?.timestamp || ''
      });
    }

    return baseActivities;
  }, [hasFlowData, flowAnswers, lead?.originalData?.source, lead?.timestamp, lead?.leadScore]);

  // Personal data from lead object
  const personalData = useMemo(() => {
    const customer = lead?.originalData?.customer;
    return {
      name: customer
        ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || lead?.name || 'Unbekannt'
        : lead?.name || 'Unbekannt',
      email: customer?.email || lead?.email || '',
      phone: customer?.phone || lead?.phone || '',
      address: customer?.address || '',
      birthdate: ''
    };
  }, [lead]);

  // Product data from lead object
  const produktMap = {
    'solar': 'Solar PV',
    'heatpump': 'Wärmepumpe',
    'charging_station': 'E-Mobilität',
    'energy_contract': 'Stromtarif',
    'energy_storage': 'Speicher'
  };

  const productData = useMemo(() => {
    const interest = lead?.originalData?.interest;
    const answers = lead?.originalData?.qualification?.flowAnswers || [];

    // Extract values from flow answers if available
    const getAnswerValue = (keyword) => {
      const found = answers.find(a =>
        a.question?.toLowerCase().includes(keyword) ||
        a.nodeLabel?.toLowerCase().includes(keyword)
      );
      return found?.answer || '';
    };

    return {
      interest: produktMap[interest?.type] || lead?.produkt || 'Unbekannt',
      details: interest?.details || '',
      budgetRange: interest?.budgetRange || getAnswerValue('budget') || '',
      timeframe: interest?.timeframe || getAnswerValue('zeitraum') || '',
      // Solar-spezifische Felder aus Flow-Antworten
      dachflaeche: getAnswerValue('dach') || getAnswerValue('fläche') || '',
      ausrichtung: getAnswerValue('ausrichtung') || '',
      stromverbrauch: getAnswerValue('strom') || getAnswerValue('verbrauch') || '',
      eigentuemer: getAnswerValue('eigentümer') || getAnswerValue('besitzer') || '',
      budget: getAnswerValue('budget') || interest?.budgetRange || ''
    };
  }, [lead]);

  // Calculate product availability at lead's address
  const productAvailability = useMemo(() => {
    // Try to parse address from personalData or original lead data
    const customer = lead?.originalData?.customer;
    let addressObj = null;

    if (customer?.address) {
      // If address is a string, try to parse it (e.g., "Hauptstraße 5, 78462 Konstanz")
      if (typeof customer.address === 'string') {
        const parts = customer.address.split(',').map(s => s.trim());
        if (parts.length >= 2) {
          const streetMatch = parts[0].match(/^(.+?)\s+(\d+\w*)$/);
          const cityMatch = parts[1].match(/^(\d{5})\s+(.+)$/);
          if (streetMatch && cityMatch) {
            addressObj = {
              street: streetMatch[1],
              houseNumber: streetMatch[2],
              postalCode: cityMatch[1],
              city: cityMatch[2]
            };
          }
        }
      } else if (typeof customer.address === 'object') {
        addressObj = customer.address;
      }
    }

    // Also check for structured address fields
    if (!addressObj && (customer?.postalCode || customer?.street)) {
      addressObj = {
        street: customer?.street || '',
        houseNumber: customer?.houseNumber || '',
        postalCode: customer?.postalCode || '',
        city: customer?.city || ''
      };
    }

    if (!addressObj) return null;

    try {
      return getCombinedAvailabilityForAddress(addressObj, {
        products: products || [],
        rules: rules || [],
        addresses: addresses || [],
        availability: availability || [],
        availabilityStatus: availabilityStatus || []
      });
    } catch (e) {
      console.warn('Availability check failed:', e);
      return null;
    }
  }, [lead, products, rules, addresses, availability, availabilityStatus]);

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
        {/* Lead-Herkunft - nur wenn flowId vorhanden */}
        {hasFlowData && (
          <CollapsibleSection id="source" icon={GitBranch} title="Lead-Herkunft">
            <div className="section-content">
              <div className="data-grid">
                <div className="data-row">
                  <span className="label">Kampagne:</span>
                  <span className="value">{lead?.originalData?.source || 'Unbekannt'}</span>
                </div>
                <div className="data-row">
                  <span className="label">Flow-ID:</span>
                  <span className="value">{lead?.originalData?.flowId}</span>
                </div>
                <div className="data-row">
                  <span className="label">Erstellt am:</span>
                  <span className="value">{lead?.timestamp}</span>
                </div>
                {flowAnswers.length > 0 && (
                  <div className="data-row">
                    <span className="label">Beantwortete Fragen:</span>
                    <span className="value">{flowAnswers.length}</span>
                  </div>
                )}
              </div>
              {onNavigateToCampaign && lead?.originalData?.flowId && (
                <div style={{ marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onNavigateToCampaign(lead.originalData.flowId)}
                  >
                    <ExternalLink size={14} />
                    Kampagne bearbeiten
                  </button>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

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
                <span className="value">{productData.interest || '—'}</span>
              </div>
              {productData.dachflaeche && (
                <div className="data-row">
                  <span className="label">Dachfläche:</span>
                  <span className="value">{productData.dachflaeche}</span>
                </div>
              )}
              {productData.ausrichtung && (
                <div className="data-row">
                  <span className="label">Ausrichtung:</span>
                  <span className="value">{productData.ausrichtung}</span>
                </div>
              )}
              {productData.stromverbrauch && (
                <div className="data-row">
                  <span className="label">Stromverbrauch:</span>
                  <span className="value">{productData.stromverbrauch}</span>
                </div>
              )}
              {productData.eigentuemer && (
                <div className="data-row">
                  <span className="label">Eigentümer:</span>
                  <span className="value">{productData.eigentuemer}</span>
                </div>
              )}
              {productData.budget && (
                <div className="data-row">
                  <span className="label">Budget:</span>
                  <span className="value">{productData.budget}</span>
                </div>
              )}
              {productData.timeframe && (
                <div className="data-row">
                  <span className="label">Zeitrahmen:</span>
                  <span className="value">{productData.timeframe}</span>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Produktverfügbarkeit an Adresse */}
        <CollapsibleSection id="availability" icon={MapPin} title="Verfügbarkeit an Adresse">
          <div className="section-content">
            {!personalData.address ? (
              <p className="text-muted" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Keine Adresse bekannt
              </p>
            ) : productAvailability === null ? (
              <p className="text-muted" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Verfügbarkeit konnte nicht geprüft werden
              </p>
            ) : productAvailability.availableProducts?.length > 0 ? (
              <div className="availability-list">
                <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  Verfügbare Produkte an dieser Adresse:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {productAvailability.availableProducts.map(item => (
                    <span
                      key={item.product?.id || item.id}
                      className={`score-badge ${item.isPlanned ? 'medium' : 'high'}`}
                      title={item.isPlanned ? 'Geplant' : 'Verfügbar'}
                    >
                      {item.product?.name || item.name || item.product?.id || item.id}
                    </span>
                  ))}
                </div>
                {productAvailability.matchedAddress && (
                  <p style={{ fontSize: '0.75rem', marginTop: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Adresse gefunden: {productAvailability.matchedAddress.street} {productAvailability.matchedAddress.housenumber}, {productAvailability.matchedAddress.zip} {productAvailability.matchedAddress.city}
                  </p>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--warning)' }}>
                Keine Produkte an dieser Adresse verfügbar
              </p>
            )}
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
