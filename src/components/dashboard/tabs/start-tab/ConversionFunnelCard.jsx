import {
  FunnelChart,
  Funnel,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Tooltip as UiTooltip } from '../../../ui';

const CustomFunnelTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md">
        <p className="font-semibold mb-1 text-[var(--slate-800)]">{data.label}</p>
        <div className="flex flex-col gap-1 text-xs">
          <span className="text-[0.875rem] font-bold text-[var(--primary)]">
            {data.value.toLocaleString()} Leads
          </span>
          <div className="flex gap-3 text-[var(--text-secondary)]">
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
      <div className="card-header mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3>Conversion Funnel</h3>
          <UiTooltip content="Gesamt-Conversion: Abschlüsse / gestartete Formulare">
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--success-light)] text-[var(--success)] cursor-help">
              {((funnelSteps[4]?.value / funnelSteps[0]?.value) * 100 || 0).toFixed(1)}% Gesamt
            </div>
          </UiTooltip>
        </div>

        {/* Campaign Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase font-semibold text-[var(--text-tertiary)]">Kampagne:</span>
          <select
            value={selectedCampaignId || ''}
            onChange={(e) => setSelectedCampaignId(e.target.value || null)}
            className={`flex-1 px-2 py-1.5 text-xs font-medium border border-[var(--border-color)] rounded-md cursor-pointer outline-none transition-all ${selectedCampaignId ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'}`}
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

      <div className="flex gap-4 items-center min-h-[240px]">
        {/* Chart Side - Pure Shapes */}
        <div className="w-[30%] min-w-[120px] h-[220px]">
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
                    className="outline-none"
                  />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Data Side - Clean List */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {funnelSteps.map((step, index) => {
            const stepMarkerStyle = { '--conversion-funnel-step-color': step.fill };

            return (
            <div key={index} className="flex items-center justify-between px-3 py-2 rounded-md bg-[var(--slate-50)] border border-transparent transition-[var(--transition)] hover:bg-[var(--bg-surface)] hover:border-[var(--slate-200)] hover:shadow-sm">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className="conversion-funnel-step-dot w-2.5 h-2.5 rounded-[3px] shrink-0"
                  style={stepMarkerStyle}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[13px] text-[var(--text-primary)] whitespace-nowrap overflow-hidden text-ellipsis">{step.label}</span>
                  {index > 0 && (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {step.conversionRate}% Konversion
                    </span>
                  )}
                  {index === 0 && (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      Startpunkt
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-sm text-[var(--text-primary)]">
                  {step.value.toLocaleString()}
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)]">
                  ({step.percentageOfTotal}%)
                </span>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Minimalist Footer Stats */}
      <div className="flex justify-center gap-8 pt-3 mt-2 border-t border-[var(--border-color)]">
        <UiTooltip content="Qualifizierungsquote: (Qualifiziert / Kontaktdaten) × 100">
          <div className="flex items-center gap-2 cursor-help">
            <span className="text-[11px] uppercase font-semibold text-[var(--text-tertiary)]">Quali:</span>
            <span className="text-base font-bold text-[var(--secondary)]">
              {((funnelSteps[3].value / funnelSteps[1].value) * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-[var(--success)]">+2.1%</span>
          </div>
        </UiTooltip>
        <div className="w-px h-5 bg-[var(--slate-200)]" />
        <UiTooltip content="Abschlussquote: (Anschluss / Qualifiziert) × 100">
          <div className="flex items-center gap-2 cursor-help">
            <span className="text-[11px] uppercase font-semibold text-[var(--text-tertiary)]">Abschluss:</span>
            <span className="text-base font-bold text-[var(--primary)]">
              {((funnelSteps[4].value / funnelSteps[3].value) * 100).toFixed(1)}%
            </span>
          </div>
        </UiTooltip>
      </div>
    </div>
  );
};

export default ConversionFunnelCard;
