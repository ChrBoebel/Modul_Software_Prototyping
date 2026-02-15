import {
  FunnelChart,
  Funnel,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Tooltip as UiTooltip } from '../../../ui';
import { theme } from '../../../../theme/colors';

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

const ConversionFunnelCard = ({ funnelSteps, campaigns, selectedCampaignId, setSelectedCampaignId }) => {
  return (
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
  );
};

export default ConversionFunnelCard;
