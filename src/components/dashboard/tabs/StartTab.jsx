import { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
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

const StartTab = ({ showToast, onTabChange, onNavigate, flowLeads = [] }) => {
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
      .map(lead => ({
        id: lead.leadNumber,
        numericId: lead.id,
        name: `${lead.customer?.firstName || ''} ${lead.customer?.lastName || ''}`.trim() || 'Neuer Lead',
        score: lead.qualification?.score || 0,
        product: produktMap[lead.interest?.type] || lead.interest?.type || 'Unbekannt',
        timestamp: formatTime(lead.timestamp),
        status: lead.status
      }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 5); // Top 5
  }, [flowLeads]);

  // Mock data for Campaigns Overview
  const campaigns = [
    { id: 'camp-001', name: 'Solar Frühling 2025', status: 'Aktiv', leads30d: 145, qualiQuote: '35%', trend: 'up' },
    { id: 'camp-002', name: 'Wärmepumpen Aktion', status: 'Pausiert', leads30d: 89, qualiQuote: '42%', trend: 'down' },
    { id: 'camp-003', name: 'E-Auto Förderung', status: 'Aktiv', leads30d: 67, qualiQuote: '28%', trend: 'up' },
    { id: 'camp-004', name: 'Ökostrom Wechsel', status: 'Prüfung', leads30d: 234, qualiQuote: '18%', trend: 'stable' }
  ];

  // Funnel data - Strict Brand Colors
  const rawFunnelSteps = [
    { label: 'Formulare gestartet', value: 5000, fill: theme.colors.primary }, // Red
    { label: 'Kontaktdaten', value: 2500, fill: theme.colors.primaryDark }, // Dark Red
    { label: 'Fragebogen', value: 1850, fill: theme.colors.secondary }, // Blue
    { label: 'System-Qualifiziert', value: 458, fill: theme.colors.secondaryDark }, // Dark Blue
    { label: 'Erfolgreicher Anschluss', value: 120, fill: theme.colors.slate500 } // Slate
  ];

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
                        <span className="score-badge high">{lead.score}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="avatar-circle" aria-hidden="true">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{lead.name}</span>
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
                  {campaigns.map((camp) => (
                    <tr key={camp.id} style={{ transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td className="font-bold text-sm">{camp.name}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="start-right">
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
            <div className="card-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3>Conversion Funnel</h3>
                <p className="text-muted text-sm" style={{ marginTop: '4px' }}>Performance über alle Stufen</p>
              </div>
              <div style={{ 
                background: 'var(--success-light)', 
                color: 'var(--success)', 
                padding: '0.5rem 1rem', 
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                2.4% Gesamt
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
