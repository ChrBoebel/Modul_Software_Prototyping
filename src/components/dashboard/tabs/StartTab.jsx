import { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Package,
  Cloud,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
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
  Cell
} from 'recharts';
import { theme } from '../../../theme/colors';
import leadsData from '../../../data/leads.json';
import defaultProducts from '../../../data/productCatalog.json';
import defaultRules from '../../../data/availabilityRules.json';
import { Avatar } from '../../ui/Avatar';

// Default integration data (same as IntegrationTab)
const defaultIntegrations = [
  {
    id: 'int-001',
    name: 'SAP CRM',
    type: 'CRM',
    description: 'Synchronisation von Kundendaten und Lead-Status',
    status: 'connected',
    lastSync: '2025-01-16 14:30',
    iconType: 'database'
  },
  {
    id: 'int-002',
    name: 'Microsoft Dynamics',
    type: 'ERP',
    description: 'Auftragsverwaltung und Rechnungsstellung',
    status: 'connected',
    lastSync: '2025-01-16 12:15',
    iconType: 'cloud'
  },
  {
    id: 'int-003',
    name: 'Mailchimp',
    type: 'Email',
    description: 'Newsletter-Marketing und Kampagnen-Sync',
    status: 'error',
    lastSync: '2025-01-15 08:00',
    error: 'API Key abgelaufen',
    iconType: 'link'
  }
];

const StartTab = ({ showToast, onTabChange, onNavigate, flowLeads = [] }) => {
  // State for selected campaign (null = show all campaigns combined)
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  // Load product mapping data from localStorage (with default demo data)
  const [products] = useLocalStorage('swk:productCatalog', defaultProducts);
  const [rules] = useLocalStorage('swk:availabilityRules', defaultRules);
  const [addresses] = useLocalStorage('swk:addresses', []);

  // Load integration status from localStorage (shared with Settings, with default demo data)
  const [integrations] = useLocalStorage('swk:integrations', defaultIntegrations);

  // Calculate integration status summary
  const integrationStatus = useMemo(() => {
    if (!integrations || integrations.length === 0) {
      return { hasError: false, connectedCount: 0, errorCount: 0, lastSync: null };
    }

    const connected = integrations.filter(i => i.status === 'connected');
    const errors = integrations.filter(i => i.status === 'error');

    // Find the most recent sync
    let latestSync = null;
    for (const int of integrations) {
      if (int.lastSync) {
        if (!latestSync || int.lastSync > latestSync) {
          latestSync = int.lastSync;
        }
      }
    }

    return {
      hasError: errors.length > 0,
      connectedCount: connected.length,
      errorCount: errors.length,
      total: integrations.length,
      lastSync: latestSync,
      errorIntegrations: errors.map(e => e.name)
    };
  }, [integrations]);

  // Calculate product coverage stats
  const productStats = useMemo(() => {
    const activeProducts = products.filter(p => p.active !== false);
    const activeRules = rules.filter(r => r.active);

    // Count unique PLZs covered by rules
    const coveredPlzs = new Set(activeRules.map(r => r.postalCode).filter(Boolean));

    // Count products per rule
    const productCounts = new Map();
    for (const rule of activeRules) {
      const productIds = Array.isArray(rule.productIds) ? rule.productIds : [];
      for (const pid of productIds) {
        productCounts.set(pid, (productCounts.get(pid) || 0) + 1);
      }
    }

    // Get top 3 products by rule coverage
    const topProducts = [...productCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => {
        const product = products.find(p => p.id === id);
        return {
          id,
          name: product?.name || id,
          ruleCount: count
        };
      });

    return {
      totalProducts: activeProducts.length,
      totalRules: activeRules.length,
      coveredPlzCount: coveredPlzs.size,
      addressCount: addresses.length,
      topProducts
    };
  }, [products, rules, addresses]);

  // Map interest type to German product name
  const produktMap = {
    'solar': 'Solar PV',
    'heatpump': 'Wärmepumpe',
    'charging_station': 'E-Mobilität',
    'energy_contract': 'Strom',
    'energy_storage': 'Speicher'
  };

  // Format timestamp for display
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Gestern';
    } else {
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    }
  };

  // Transform and sort leads by score for Priority-A display (merge with flow leads)
  const priorityLeads = useMemo(() => {
    const allLeads = [...flowLeads, ...leadsData.leads];
    return allLeads
      .map(lead => {
        const customer = lead.customer || {};
        const isBusiness = customer.customerType === 'business';
        const displayName = isBusiness && customer.companyName
          ? customer.companyName
          : `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Neuer Lead';

        return {
          id: lead.leadNumber,
          numericId: lead.id,
          name: displayName,
          contactPerson: isBusiness ? customer.contactPerson : null,
          customerType: customer.customerType || 'private',
          score: lead.qualification?.score || 0,
          scoreBreakdown: lead.qualification?.scoreBreakdown || [],
          product: produktMap[lead.interest?.type] || lead.interest?.type || 'Unbekannt',
          timestamp: formatTime(lead.timestamp),
          status: lead.status
        };
      })
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 5); // Top 5
  }, [flowLeads]);

  // Campaigns with funnel data for each campaign
  const campaigns = [
    {
      id: 'camp-001',
      name: 'Solar Frühling 2025',
      status: 'Aktiv',
      leads30d: 145,
      qualiQuote: '35%',
      trend: 'up',
      funnelData: { started: 1200, contact: 720, questionnaire: 540, qualified: 145, closed: 51 }
    },
    {
      id: 'camp-002',
      name: 'Wärmepumpen Aktion',
      status: 'Pausiert',
      leads30d: 89,
      qualiQuote: '42%',
      trend: 'down',
      funnelData: { started: 850, contact: 510, questionnaire: 380, qualified: 89, closed: 37 }
    },
    {
      id: 'camp-003',
      name: 'E-Auto Förderung',
      status: 'Aktiv',
      leads30d: 67,
      qualiQuote: '28%',
      trend: 'up',
      funnelData: { started: 620, contact: 350, questionnaire: 245, qualified: 67, closed: 19 }
    },
    {
      id: 'camp-004',
      name: 'Ökostrom Wechsel',
      status: 'Prüfung',
      leads30d: 234,
      qualiQuote: '18%',
      trend: 'stable',
      funnelData: { started: 2330, contact: 920, questionnaire: 685, qualified: 157, closed: 13 }
    }
  ];

  // Get selected campaign or null for "all"
  const selectedCampaign = selectedCampaignId
    ? campaigns.find(c => c.id === selectedCampaignId)
    : null;

  // Dynamic funnel data based on selected campaign
  const rawFunnelSteps = useMemo(() => {
    let data;

    if (selectedCampaign) {
      // Use funnel data from selected campaign
      data = selectedCampaign.funnelData;
    } else {
      // Combine all campaigns
      data = campaigns.reduce((acc, camp) => ({
        started: acc.started + camp.funnelData.started,
        contact: acc.contact + camp.funnelData.contact,
        questionnaire: acc.questionnaire + camp.funnelData.questionnaire,
        qualified: acc.qualified + camp.funnelData.qualified,
        closed: acc.closed + camp.funnelData.closed
      }), { started: 0, contact: 0, questionnaire: 0, qualified: 0, closed: 0 });
    }

    return [
      { label: 'Formulare gestartet', value: data.started, fill: theme.colors.primary },
      { label: 'Kontaktdaten', value: data.contact, fill: theme.colors.primaryDark },
      { label: 'Fragebogen', value: data.questionnaire, fill: theme.colors.secondary },
      { label: 'System-Qualifiziert', value: data.qualified, fill: theme.colors.secondaryDark },
      { label: 'Erfolgreicher Anschluss', value: data.closed, fill: theme.colors.slate500 }
    ];
  }, [selectedCampaign]);

  // Calculate percentages and enrichment
  const funnelSteps = rawFunnelSteps.map((step, index, array) => {
    const prevValue = index > 0 ? array[index - 1].value : step.value; // For first item, use self to get 100% or use array[0].value
    const total = array[0].value;
    
    return {
      ...step,
      conversionRate: index === 0 ? 100 : ((step.value / prevValue) * 100).toFixed(1),
      percentageOfTotal: ((step.value / total) * 100).toFixed(1),
      dropOff: index === 0 ? 0 : (prevValue - step.value)
    };
  });

  const CustomFunnelTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '12px', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>{data.label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            <span style={{ color: theme.colors.primary, fontWeight: 700, fontSize: '14px' }}>
              {data.value.toLocaleString()} Leads
            </span>
            <div style={{ display: 'flex', gap: '12px', color: '#64748b' }}>
              <span>Gesamt: <strong>{data.percentageOfTotal}%</strong></span>
              {data.label !== 'Formulare gestartet' && (
                <span>Konversion: <strong>{data.conversionRate}%</strong></span>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Chart Data - Strict Brand Colors
  const chartData = [
    { name: 'Mo', qualified: 12, unqualified: 4, rejected: 2 },
    { name: 'Di', qualified: 19, unqualified: 6, rejected: 3 },
    { name: 'Mi', qualified: 15, unqualified: 8, rejected: 1 },
    { name: 'Do', qualified: 22, unqualified: 5, rejected: 4 },
    { name: 'Fr', qualified: 18, unqualified: 7, rejected: 2 },
    { name: 'Sa', qualified: 8, unqualified: 3, rejected: 1 },
    { name: 'So', qualified: 5, unqualified: 2, rejected: 0 },
  ];

  const getStatusBadge = (status) => {
    const map = {
      'Aktiv': 'success',
      'Pausiert': 'warning',
      'Prüfung': 'info'
    };
    return map[status] || 'neutral';
  };

  return (
    <div className="start-tab">
      <h2 className="sr-only">Start Übersicht</h2>
      <div className="start-grid">
        {/* Left Column */}
        <div className="start-left">
          {/* Priority-A Leads */}
          <div className="card">
            <div className="card-header">
              <h3>Neueste Priorität-A Leads</h3>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Score</th>
                    <th>Name</th>
                    <th>Produkt</th>
                    <th>Zeit</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('leads', { leadId: lead.numericId });
                        } else {
                          showToast(`Lead ${lead.id} öffnen`);
                        }
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      tabIndex="0"
                      role="button"
                      aria-label={`Lead ${lead.name} öffnen`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (onNavigate) {
                            onNavigate('leads', { leadId: lead.numericId });
                          } else {
                            showToast(`Lead ${lead.id} öffnen`);
                          }
                        }
                      }}
                    >
                      <td>
                        <span
                          className="score-badge high"
                          title={lead.scoreBreakdown?.length > 0
                            ? `Score-Zusammensetzung:\n${lead.scoreBreakdown.map(s => `${s.label}: ${s.points > 0 ? '+' : ''}${s.points}`).join('\n')}`
                            : `Score: ${lead.score}`
                          }
                          style={{ cursor: 'help' }}
                        >
                          {lead.score}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Avatar
                            name={lead.name}
                            size="sm"
                            usePlaceholder
                            type={lead.customerType === 'business' ? 'company' : 'person'}
                          />
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block' }}>{lead.name}</span>
                            {lead.contactPerson && (
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lead.contactPerson}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{lead.product}</td>
                      <td className="text-muted text-sm">{lead.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kampagnen-Übersicht */}
          <div className="card">
            <div className="card-header">
              <h3>Kampagnen Performance</h3>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Kampagne</th>
                    <th>Status</th>
                    <th>Leads</th>
                    <th>Quali</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((camp) => {
                    const isSelected = selectedCampaignId === camp.id;
                    return (
                      <tr
                        key={camp.id}
                        onClick={() => setSelectedCampaignId(isSelected ? null : camp.id)}
                        style={{
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                          borderLeft: isSelected ? `3px solid ${theme.colors.primary}` : '3px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--slate-50)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        aria-label={`Kampagne ${camp.name} ${isSelected ? 'abwählen' : 'auswählen'} für Funnel-Anzeige`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedCampaignId(isSelected ? null : camp.id);
                          }
                        }}
                      >
                        <td className="font-bold text-sm">
                          {camp.name}
                          {isSelected && (
                            <span style={{
                              marginLeft: '0.5rem',
                              fontSize: '0.625rem',
                              color: theme.colors.primary,
                              fontWeight: 600
                            }}>
                              ● AKTIV
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(camp.status)}`}>
                            {camp.status}
                          </span>
                        </td>
                        <td className="text-sm">{camp.leads30d}</td>
                        <td className="text-sm">{camp.qualiQuote}</td>
                        <td>
                          {camp.trend === 'up' && (
                            <>
                              <ArrowUpRight size={16} style={{ color: theme.colors.success }} aria-hidden="true" />
                              <span className="sr-only">Steigend</span>
                            </>
                          )}
                          {camp.trend === 'down' && (
                            <>
                              <ArrowDownRight size={16} style={{ color: theme.colors.danger }} aria-hidden="true" />
                              <span className="sr-only">Fallend</span>
                            </>
                          )}
                          {camp.trend === 'stable' && (
                            <>
                              <span className="text-muted" aria-hidden="true">→</span>
                              <span className="sr-only">Stabil</span>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Produkt-Abdeckung Card */}
          <div
            className="card"
            style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
            onClick={() => onNavigate && onNavigate('produkt-mapping')}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate && onNavigate('produkt-mapping');
              }
            }}
            aria-label="Produkt-Mapping öffnen"
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>
                <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Produkt-Abdeckung
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Details →</span>
            </div>
            <div style={{ padding: '1rem 0' }}>
              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.colors.secondary }}>
                    {productStats.totalProducts}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Produkte aktiv</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.colors.primary }}>
                    {productStats.coveredPlzCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>PLZ abgedeckt</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.colors.slate500 }}>
                    {productStats.totalRules}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Regeln aktiv</div>
                </div>
              </div>

              {/* Top Products */}
              {productStats.topProducts.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                  }}>
                    Top Produkte nach Abdeckung
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {productStats.topProducts.map((prod, idx) => (
                      <div
                        key={prod.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: 'var(--slate-50)',
                          borderRadius: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: idx === 0 ? theme.colors.secondary : idx === 1 ? theme.colors.slate400 : theme.colors.slate300,
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {idx + 1}
                          </span>
                          <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{prod.name}</span>
                        </div>
                        <span className="badge neutral" style={{ fontSize: '0.75rem' }}>
                          {prod.ruleCount} Regeln
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {productStats.topProducts.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.875rem'
                }}>
                  <Package size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                  <p>Keine Produkt-Regeln konfiguriert</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="start-right">
          {/* Integration Status Banner */}
          {integrations.length > 0 && (
            <div
              className="card"
              style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: integrationStatus.hasError ? 'var(--danger-light)' : 'var(--success-light)',
                border: `1px solid ${integrationStatus.hasError ? 'var(--danger)' : 'var(--success)'}`,
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {integrationStatus.hasError ? (
                  <AlertCircle size={20} style={{ color: 'var(--danger)' }} />
                ) : (
                  <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                )}
                <div>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: integrationStatus.hasError ? 'var(--danger)' : 'var(--success)'
                  }}>
                    {integrationStatus.hasError
                      ? `${integrationStatus.errorCount} Integration${integrationStatus.errorCount > 1 ? 'en' : ''} mit Fehler`
                      : `${integrationStatus.connectedCount}/${integrationStatus.total} Integrationen verbunden`
                    }
                  </div>
                  {integrationStatus.lastSync && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      Letzter Sync: {integrationStatus.lastSync}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: integrationStatus.hasError ? 'var(--danger)' : 'var(--success)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textDecoration: 'underline'
                }}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('einstellung');
                  } else {
                    showToast('Einstellungen öffnen');
                  }
                }}
              >
                {integrationStatus.hasError ? 'Fehler beheben' : 'Details'}
              </button>
            </div>
          )}

          {/* Lead-Eingang Chart */}
          <div className="card">
            <div className="card-header">
              <h3>Lead-Eingang & Qualität</h3>
            </div>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--slate-200)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--slate-500)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--slate-500)' }} />
                  <Tooltip
                    cursor={{ fill: 'var(--slate-50)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  {/* Blue for Qualified (Success) */}
                  <Bar dataKey="qualified" stackId="a" fill={theme.colors.secondary} radius={[0, 0, 4, 4]} barSize={32} name="Qualifiziert" />
                  {/* Slate for Unqualified (Neutral/Warning) instead of Orange */}
                  <Bar dataKey="unqualified" stackId="a" fill={theme.colors.slate400} radius={[0, 0, 0, 0]} barSize={32} name="Offen" />
                  {/* Red for Rejected (Danger) */}
                  <Bar dataKey="rejected" stackId="a" fill={theme.colors.primary} radius={[4, 4, 0, 0]} barSize={32} name="Abgelehnt" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Journey Funnel */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3>Conversion Funnel</h3>
                <div style={{
                  background: 'var(--success-light)',
                  color: 'var(--success)',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  {((funnelSteps[4]?.value / funnelSteps[0]?.value) * 100 || 0).toFixed(1)}% Gesamt
                </div>
              </div>

              {/* Campaign Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>Kampagne:</span>
                <select
                  value={selectedCampaignId || ''}
                  onChange={(e) => setSelectedCampaignId(e.target.value || null)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    backgroundColor: selectedCampaignId ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    color: selectedCampaignId ? theme.colors.primary : 'var(--text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  aria-label="Kampagne für Funnel auswählen"
                >
                  <option value="">Alle Kampagnen (Gesamt)</option>
                  {campaigns.map(camp => (
                    <option key={camp.id} value={camp.id}>
                      {camp.name} — {camp.status} • {camp.leads30d} Leads
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', minHeight: '320px', paddingBottom: '1rem' }}>
              {/* Chart Side - Pure Shapes */}
              <div style={{ width: '35%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip content={<CustomFunnelTooltip />} cursor={{ fill: 'transparent' }} />
                    <Funnel
                      data={funnelSteps}
                      dataKey="value"
                      isAnimationActive
                      gap={4}
                    >
                      {funnelSteps.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fill} 
                          stroke="none" 
                          style={{ outline: 'none' }}
                        />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>

              {/* Data Side - Clean List */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {funnelSteps.map((step, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--slate-50)',
                    border: '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.borderColor = 'var(--slate-200)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--slate-50)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '4px', 
                        backgroundColor: step.fill 
                      }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{step.label}</span>
                        {index > 0 && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {step.conversionRate}% Konversion
                          </span>
                        )}
                        {index === 0 && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            Startpunkt
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {step.value.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {step.percentageOfTotal}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Minimalist Footer Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1px 1fr', 
              gap: '1rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid var(--border-color)',
              marginTop: '0.5rem',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', fontWeight: 600 }}>Qualifizierung</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.colors.secondary }}>
                    {((funnelSteps[3].value / funnelSteps[1].value) * 100).toFixed(1)}%
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--success)' }}>
                    <ArrowUpRight size={14} style={{ display: 'inline' }} /> +2.1%
                  </span>
                </div>
              </div>
              
              {/* Vertical Divider */}
              <div style={{ height: '40px', backgroundColor: 'var(--slate-200)' }}></div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', fontWeight: 600 }}>Abschluss</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.colors.primary }}>
                    {((funnelSteps[4].value / funnelSteps[3].value) * 100).toFixed(1)}%
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>~</span> 0.0%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartTab;
