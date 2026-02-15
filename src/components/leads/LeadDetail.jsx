import { useState, useMemo } from 'react';
import {
  X,
  Phone,
  ThumbsUp,
  ThumbsDown,
  History,
  User,
  Package,
  FileCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  GitBranch,
  MapPin
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Avatar, Tooltip } from '../ui';
import { theme } from '../../theme/colors';
import {
  getCombinedAvailabilityForAddress
} from '../produkt-mapping/availabilityLogic';
import { parseCustomerAddress } from '../../utils/addressParser';
import { getProduktName } from '../../utils/leadUtils';
import {
  LeadSourceSection,
  PersonalDataSection,
  ProductDataSection,
  AvailabilitySection,
  ScoreHistorySection,
  ActivitiesSection,
  ConsentsSection
} from './lead-detail';

const LeadDetail = ({ lead, showToast, onClose, onNavigateToCampaign, onNavigateToProduktMapping }) => {
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
      interest: getProduktName(interest?.type) || lead?.produkt || 'Unbekannt',
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
    const customer = lead?.originalData?.customer;
    const addressObj = parseCustomerAddress(customer);
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
        <div className="header-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar name={lead.name} size="lg" usePlaceholder type={lead.customerType === 'business' ? 'company' : 'person'} />
          <div>
            <h3 style={{ margin: 0 }}>{lead.name}</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lead.leadId}</span>
          </div>
          {/* Score Radial Gauge - replaces simple badge (Tufte: maximize data-ink) */}
          {/* Uses SWK brand colors: Blue (high), Slate (medium), Red (low) */}
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                data={[{ value: lead.leadScore, fill: lead.leadScore >= 80 ? theme.colors.secondary : lead.leadScore >= 50 ? theme.colors.slate500 : theme.colors.primary }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  background={{ fill: theme.colors.slate100 }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center Score Label */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: lead.leadScore >= 80 ? theme.colors.secondary : lead.leadScore >= 50 ? theme.colors.slate600 : theme.colors.primary
              }}>
                {lead.leadScore}
              </span>
            </div>
          </div>
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
        <Tooltip content="Lead als kontaktiert markieren">
          <button
            type="button"
            className={`btn ${activeStatus === 'kontakt' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleStatusChange('kontakt')}
            aria-pressed={activeStatus === 'kontakt'}
          >
            <Phone size={16} />
            Kontakt
          </button>
        </Tooltip>
        <Tooltip content="Lead für Vertrieb priorisieren">
          <button
            type="button"
            className={`btn ${activeStatus === 'priorisieren' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleStatusChange('priorisieren')}
            aria-pressed={activeStatus === 'priorisieren'}
          >
            <ThumbsUp size={16} />
            Priorisieren
          </button>
        </Tooltip>
        <Tooltip content="Lead als nicht qualifiziert markieren">
          <button
            type="button"
            className={`btn ${activeStatus === 'abgelehnt' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => handleStatusChange('abgelehnt')}
            aria-pressed={activeStatus === 'abgelehnt'}
          >
            <ThumbsDown size={16} />
            Abgelehnt
          </button>
        </Tooltip>
      </div>

      {/* Content Sections */}
      <div className="detail-content">
        {/* Lead-Herkunft - nur wenn flowId vorhanden */}
        {hasFlowData && (
          <CollapsibleSection id="source" icon={GitBranch} title="Lead-Herkunft">
            <LeadSourceSection
              lead={lead}
              flowAnswers={flowAnswers}
              onNavigateToCampaign={onNavigateToCampaign}
            />
          </CollapsibleSection>
        )}

        {/* Persönliche Daten */}
        <CollapsibleSection id="personal" icon={User} title="Persönliche Daten">
          <PersonalDataSection personalData={personalData} />
        </CollapsibleSection>

        {/* Produktdaten / Sales Daten */}
        <CollapsibleSection id="product" icon={Package} title="Produktdaten, Sales Daten">
          <ProductDataSection productData={productData} />
        </CollapsibleSection>

        {/* Produktverfügbarkeit an Adresse */}
        <CollapsibleSection id="availability" icon={MapPin} title="Verfügbarkeit an Adresse">
          <AvailabilitySection
            personalData={personalData}
            productAvailability={productAvailability}
            onNavigateToProduktMapping={onNavigateToProduktMapping}
          />
        </CollapsibleSection>

        {/* Score-Historie */}
        <CollapsibleSection id="scoreHistory" icon={History} title="Score-Historie">
          <ScoreHistorySection scoreHistory={scoreHistory} />
        </CollapsibleSection>

        {/* Aktivitäten Timeline */}
        <CollapsibleSection id="activities" icon={Clock} title={`Aktivitäten (${activities.length})`}>
          <ActivitiesSection
            displayedActivities={displayedActivities}
            activities={activities}
            showAllActivities={showAllActivities}
            setShowAllActivities={setShowAllActivities}
          />
        </CollapsibleSection>

        {/* Einwilligungen */}
        <CollapsibleSection id="consents" icon={FileCheck} title="Einwilligungen">
          <ConsentsSection />
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default LeadDetail;
