import { useState, useMemo } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { theme } from '../../../theme/colors';
import leadsData from '../../../data/leads.json';
import defaultProducts from '../../../data/productCatalog.json';
import defaultRules from '../../../data/availabilityRules.json';
import defaultIntegrations from '../../../data/defaultIntegrations.json';
import { getProduktName } from '../../../utils/leadUtils';

import PriorityLeadsTable from './start-tab/PriorityLeadsTable';
import CampaignPerformanceTable from './start-tab/CampaignPerformanceTable';
import ProductCoverageCard from './start-tab/ProductCoverageCard';
import IntegrationStatusBanner from './start-tab/IntegrationStatusBanner';
import LeadIntakeChart from './start-tab/LeadIntakeChart';
import ConversionFunnelCard from './start-tab/ConversionFunnelCard';

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

    // Calculate coverage percentage (simplified: rules exist = covered)
    const totalPlzGermany = 8000; // Approximate number of PLZ areas in Germany
    const coveragePercent = Math.min(100, Math.round((coveredPlzs.size / totalPlzGermany) * 100 * 10)); // Scale up for visibility

    return {
      totalProducts: activeProducts.length,
      totalRules: activeRules.length,
      coveredPlzCount: coveredPlzs.size,
      addressCount: addresses.length,
      topProducts,
      coveragePercent
    };
  }, [products, rules, addresses]);

  // Data for availability distribution chart
  const availabilityChartData = useMemo(() => {
    const totalRules = rules.filter(r => r.active).length;
    const totalProducts = products.filter(p => p.config?.active !== false).length;

    return [
      { name: 'Produkte', value: totalProducts, color: theme.colors.secondary },
      { name: 'Regeln', value: totalRules, color: theme.colors.primary },
      { name: 'PLZ', value: productStats.coveredPlzCount, color: theme.colors.success }
    ];
  }, [rules, products, productStats.coveredPlzCount]);

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
          product: getProduktName(lead.interest?.type),
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
    const prevValue = index > 0 ? array[index - 1].value : step.value;
    const total = array[0].value;

    return {
      ...step,
      conversionRate: index === 0 ? 100 : ((step.value / prevValue) * 100).toFixed(1),
      percentageOfTotal: ((step.value / total) * 100).toFixed(1),
      dropOff: index === 0 ? 0 : (prevValue - step.value)
    };
  });

<<<<<<< HEAD
=======
  const CustomFunnelTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ 
          backgroundColor: theme.colors.surface, 
          padding: '12px', 
          border: `1px solid ${theme.colors.borderColor}`, 
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <p style={{ fontWeight: 600, color: theme.colors.slate800, marginBottom: '4px' }}>{data.label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            <span style={{ color: theme.colors.primary, fontWeight: 700, fontSize: '14px' }}>
              {data.value.toLocaleString()} Leads
            </span>
            <div style={{ display: 'flex', gap: '12px', color: theme.colors.slate500 }}>
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

>>>>>>> 607846a (Refactor: Implement design tokens system and update UI components)
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

  // Calculate average total leads per day (Tufte: provide context)
  const avgTotalLeads = Math.round(
    chartData.reduce((sum, d) => sum + d.qualified + d.unqualified + d.rejected, 0) / chartData.length
  );

  return (
    <div className="start-tab">
      <h2 className="sr-only">Start Übersicht</h2>
      <div className="start-grid">
        {/* Left Column */}
        <div className="start-left">
<<<<<<< HEAD
          <PriorityLeadsTable
            priorityLeads={priorityLeads}
            onNavigate={onNavigate}
            showToast={showToast}
          />
          <CampaignPerformanceTable
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
          />
          <ProductCoverageCard
            productStats={productStats}
            availabilityChartData={availabilityChartData}
            onNavigate={onNavigate}
          />
=======
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
                        <ScoreBadge
                          score={lead.score}
                          breakdown={lead.scoreBreakdown}
                        />
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
                              <span style={{ fontSize: '0.75rem', color: theme.colors.slate500 }}>{lead.contactPerson}</span>
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
                        <td className="text-sm">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ minWidth: '28px' }}>{camp.leads30d}</span>
                            {/* Inline bar - Few's principle of embedded graphics */}
                            <div style={{
                              width: '40px',
                              height: '6px',
                              backgroundColor: 'var(--slate-100)',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${Math.min(100, (camp.leads30d / 250) * 100)}%`,
                                height: '100%',
                                backgroundColor: theme.colors.secondary,
                                borderRadius: '3px',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          </div>
                        </td>
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
            <div style={{ padding: '0.5rem 0' }}>
              {/* Quick Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.secondary }}>
                    {productStats.totalProducts}
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>Produkte</div>
                </div>
                <UiTooltip content="Postleitzahlen mit aktiven Verfügbarkeitsregeln">
                  <div style={{ textAlign: 'center', flex: 1, minWidth: 0, cursor: 'help' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.primary }}>
                      {productStats.coveredPlzCount}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>PLZ</div>
                  </div>
                </UiTooltip>
                <UiTooltip content="Aktive Regeln die Produktverfügbarkeit definieren">
                  <div style={{ textAlign: 'center', flex: 1, minWidth: 0, cursor: 'help' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.slate500 }}>
                      {productStats.totalRules}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>Regeln</div>
                  </div>
                </UiTooltip>
                <UiTooltip content="Verhältnis zu ~8000 deutschen PLZ-Bereichen">
                  <div style={{ textAlign: 'center', flex: 1, minWidth: 0, cursor: 'help' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.success }}>
                      {productStats.coveragePercent}%
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>Abdeckung</div>
                  </div>
                </UiTooltip>
              </div>

              {/* Top Products */}
              {productStats.topProducts.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: '0.375rem'
                  }}>
                    Top Produkte
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {productStats.topProducts.map((prod, idx) => (
                      <div
                        key={prod.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.375rem 0.5rem',
                          backgroundColor: 'var(--slate-50)',
                          borderRadius: '4px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                          <span style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: idx === 0 ? theme.colors.secondary : idx === 1 ? theme.colors.slate400 : theme.colors.slate300,
                            color: theme.colors.white,
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            flexShrink: 0
                          }}>
                            {idx + 1}
                          </span>
                          <span style={{ fontWeight: 500, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.name}</span>
                        </div>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                          {prod.ruleCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stacked Bar - replaces Pie Chart (Tufte: maximize data-ink ratio) */}
              {(productStats.totalProducts > 0 || productStats.totalRules > 0) && (
                <div style={{ marginTop: '0.75rem' }}>
                  {/* 100% Stacked Bar */}
                  {(() => {
                    const total = availabilityChartData.reduce((sum, d) => sum + d.value, 0);
                    return (
                      <div style={{
                        display: 'flex',
                        height: 8,
                        borderRadius: 4,
                        overflow: 'hidden',
                        backgroundColor: 'var(--slate-100)'
                      }}>
                        {availabilityChartData.map((item, idx) => {
                          const width = total > 0 ? (item.value / total * 100) : 0;
                          return width > 0 ? (
                            <div
                              key={idx}
                              style={{
                                width: `${width}%`,
                                backgroundColor: item.color,
                                transition: 'width 0.3s ease'
                              }}
                              title={`${item.name}: ${item.value}`}
                            />
                          ) : null;
                        })}
                      </div>
                    );
                  })()}
                  {/* Legend with values */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    gap: '0.5rem'
                  }}>
                    {availabilityChartData.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.625rem'
                      }}>
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: item.color,
                          flexShrink: 0
                        }} />
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {item.value}
                        </span>
                        <span style={{ color: 'var(--text-tertiary)' }}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {productStats.topProducts.length === 0 && productStats.totalRules === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.75rem'
                }}>
                  <Package size={18} style={{ marginBottom: '0.25rem', opacity: 0.5 }} />
                  <p>Keine Regeln</p>
                </div>
              )}
            </div>
          </div>
>>>>>>> 607846a (Refactor: Implement design tokens system and update UI components)
        </div>

        {/* Right Column */}
        <div className="start-right">
<<<<<<< HEAD
          <IntegrationStatusBanner
            integrationStatus={integrationStatus}
            integrations={integrations}
            onNavigate={onNavigate}
            showToast={showToast}
          />
          <LeadIntakeChart
            chartData={chartData}
            avgTotalLeads={avgTotalLeads}
          />
          <ConversionFunnelCard
            funnelSteps={funnelSteps}
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
          />
=======
          {/* Integration Status Banner */}
          {integrations.length > 0 && (
            <div
              className="card"
              style={{
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: integrationStatus.hasError ? 'var(--danger-light)' : 'var(--success-light)',
                border: `1px solid ${integrationStatus.hasError ? 'var(--danger)' : 'var(--success)'}`,
                borderRadius: '6px',
                marginBottom: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {integrationStatus.hasError ? (
                  <AlertCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                ) : (
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                )}
                <span style={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: integrationStatus.hasError ? 'var(--danger)' : 'var(--success)'
                }}>
                  {integrationStatus.hasError
                    ? `${integrationStatus.errorCount} Fehler`
                    : `${integrationStatus.connectedCount}/${integrationStatus.total} verbunden`
                  }
                </span>
              </div>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: integrationStatus.hasError ? 'var(--danger)' : 'var(--success)',
                  cursor: 'pointer',
                  fontSize: '0.6875rem',
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
                {integrationStatus.hasError ? 'Beheben' : 'Details'}
              </button>
            </div>
          )}

          {/* Lead-Eingang Chart */}
          <div className="card">
            <div className="card-header">
              <h3>Lead-Eingang & Qualität</h3>
            </div>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--slate-200)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--slate-500)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--slate-500)' }} />
                  <Tooltip
                    cursor={{ fill: 'var(--slate-50)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  {/* Reference Line for Average - Tufte's context principle */}
                  <ReferenceLine
                    y={avgTotalLeads}
                    stroke={theme.colors.slate400}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Ø ${avgTotalLeads}`,
                      position: 'right',
                      fontSize: 11,
                      fill: theme.colors.slate500,
                      fontWeight: 500
                    }}
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
            {/* Legend - Following Tufte's principle of direct labeling */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--slate-100)',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: theme.colors.secondary }} />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Qualifiziert</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: theme.colors.slate400 }} />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Offen</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: theme.colors.primary }} />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Abgelehnt</span>
              </div>
            </div>
          </div>

          {/* Lead Journey Funnel */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3>Conversion Funnel</h3>
                <UiTooltip content="Gesamt-Conversion: Abschlüsse / gestartete Formulare">
                  <div style={{
                    background: 'var(--success-light)',
                    color: 'var(--success)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'help'
                  }}>
                    {((funnelSteps[4]?.value / funnelSteps[0]?.value) * 100 || 0).toFixed(1)}% Gesamt
                  </div>
                </UiTooltip>
              </div>

              {/* Campaign Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>Kampagne:</span>
                <select
                  value={selectedCampaignId || ''}
                  onChange={(e) => setSelectedCampaignId(e.target.value || null)}
                  style={{
                    flex: 1,
                    padding: '0.375rem 0.5rem',
                    fontSize: '0.75rem',
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
                  <option value="">Alle Kampagnen</option>
                  {campaigns.map(camp => (
                    <option key={camp.id} value={camp.id}>
                      {camp.name} • {camp.leads30d} Leads
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minHeight: '240px' }}>
              {/* Chart Side - Pure Shapes */}
              <div style={{ width: '30%', minWidth: '120px', height: 220 }}>
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
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
                {funnelSteps.map((step, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--slate-50)',
                    border: '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.surface;
                    e.currentTarget.style.borderColor = 'var(--slate-200)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--slate-50)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '3px',
                        backgroundColor: step.fill,
                        flexShrink: 0
                      }} />
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.label}</span>
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
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {step.value.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                        ({step.percentageOfTotal}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Minimalist Footer Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)',
              marginTop: '0.5rem'
            }}>
              <UiTooltip content="Qualifizierungsquote: (Qualifiziert / Kontaktdaten) × 100">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'help' }}>
                  <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Quali:</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.secondary }}>
                    {((funnelSteps[3].value / funnelSteps[1].value) * 100).toFixed(1)}%
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>+2.1%</span>
                </div>
              </UiTooltip>
              <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--slate-200)' }} />
              <UiTooltip content="Abschlussquote: (Anschluss / Qualifiziert) × 100">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'help' }}>
                  <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Abschluss:</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: theme.colors.primary }}>
                    {((funnelSteps[4].value / funnelSteps[3].value) * 100).toFixed(1)}%
                  </span>
                </div>
              </UiTooltip>
            </div>
          </div>
>>>>>>> 607846a (Refactor: Implement design tokens system and update UI components)
        </div>
      </div>
    </div>
  );
};

export default StartTab;
