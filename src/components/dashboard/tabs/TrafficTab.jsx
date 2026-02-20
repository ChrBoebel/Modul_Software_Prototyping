import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { Users, Target, Percent, Award, Globe, Mail, MousePointer, Share2, Search, Link2, ExternalLink } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';
import { KPICard, KPIBar } from '../../ui/KPICard';

const TRAFFIC_LEGEND_STYLE = { fontSize: '12px', paddingBottom: '8px' };
const TRAFFIC_AXIS_LABEL_VISITORS = { fontSize: 10, fill: 'var(--primary)', fontWeight: 500 };
const TRAFFIC_AXIS_LABEL_LEADS = { fontSize: 10, fill: 'var(--secondary)', fontWeight: 500 };
const TRAFFIC_REF_LABEL_STYLE = { fontSize: 9, fill: 'var(--slate-400)' };

const TrafficTab = ({ onNavigate, onTabChange }) => {
  const [filterPeriod, setFilterPeriod] = useState('7d');

  // Mock traffic data by source
  const trafficBySource = [
    { source: 'Google Ads', besucher: 12500, leads: 340, icon: MousePointer },
    { source: 'Facebook', besucher: 8900, leads: 180, icon: Share2 },
    { source: 'Direkt', besucher: 6200, leads: 95, icon: Globe },
    { source: 'Email', besucher: 4100, leads: 220, icon: Mail },
    { source: 'Organic', besucher: 3500, leads: 85, icon: Search },
    { source: 'Referral', besucher: 1200, leads: 42, icon: Link2 }
  ];

  // Mock traffic timeline data
  const trafficTimeline = [
    { date: 'Mo', besucher: 4200, leads: 120 },
    { date: 'Di', besucher: 5100, leads: 145 },
    { date: 'Mi', besucher: 4800, leads: 132 },
    { date: 'Do', besucher: 5500, leads: 168 },
    { date: 'Fr', besucher: 6200, leads: 185 },
    { date: 'Sa', besucher: 3800, leads: 95 },
    { date: 'So', besucher: 3100, leads: 78 }
  ];

  // Calculate totals
  const totals = useMemo(() => {
    const totalBesucher = trafficBySource.reduce((sum, s) => sum + s.besucher, 0);
    const totalLeads = trafficBySource.reduce((sum, s) => sum + s.leads, 0);
    const conversionRate = ((totalLeads / totalBesucher) * 100).toFixed(2);
    const topSource = trafficBySource.reduce((max, s) => s.besucher > max.besucher ? s : max, trafficBySource[0]);
    const maxBesucher = Math.max(...trafficBySource.map(s => s.besucher));

    return { totalBesucher, totalLeads, conversionRate, topSource, maxBesucher };
  }, []);

  // Calculate averages for reference lines (Tufte's principle: show context)
  const averages = useMemo(() => {
    const avgBesucher = Math.round(trafficTimeline.reduce((sum, d) => sum + d.besucher, 0) / trafficTimeline.length);
    const avgLeads = Math.round(trafficTimeline.reduce((sum, d) => sum + d.leads, 0) / trafficTimeline.length);
    return { avgBesucher, avgLeads };
  }, []);

  // Handle source click - navigate to leads filtered by source
  const handleSourceClick = (sourceName) => {
    if (onNavigate) {
      onNavigate('leads', { sourceFilter: sourceName });
    }
  };

  // Handle campaign navigation
  const handleCampaignClick = () => {
    if (onTabChange) {
      onTabChange('kampagnen');
    }
  };

  // Improved tooltip with Conversion-Rate (Few's principle: contextual metrics)
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const besucher = payload.find(p => p.dataKey === 'besucher')?.value || 0;
    const leads = payload.find(p => p.dataKey === 'leads')?.value || 0;
    const conversionRate = besucher > 0 ? ((leads / besucher) * 100).toFixed(2) : '0.00';

    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--slate-200)] rounded-xl shadow-[0_8px_24px_rgb(0_0_0_/0.12)] py-3.5 px-4 min-w-[180px]">
        <p className="m-0 mb-2.5 text-xs font-bold text-[var(--slate-800)] uppercase tracking-[0.5px]">
          {label}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-[3px] rounded-[1px] shrink-0 bg-[var(--primary)]" />
          <span className="text-[11px] text-[var(--slate-500)] flex-1">Besucher:</span>
          <span className="text-xs font-semibold text-[var(--slate-700)]">
            {besucher.toLocaleString('de-DE')}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2.5 pb-2.5 border-b border-[var(--slate-100)]">
          <span className="traffic-tooltip-dashed-line w-3 h-[3px] rounded-[1px] shrink-0" />
          <span className="text-[11px] text-[var(--slate-500)] flex-1">Leads:</span>
          <span className="text-xs font-semibold text-[var(--slate-700)]">
            {leads.toLocaleString('de-DE')}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[11px] text-[var(--slate-500)] flex-1">Conversion:</span>
          <span className={`text-xs font-bold ${parseFloat(conversionRate) > 3 ? 'text-[var(--success)]' : 'text-[var(--slate-600)]'}`}>
            {conversionRate}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="sr-only">Traffic Analysen</h2>

      {/* Header with Filter */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h3 className="m-0 text-[18px] font-semibold text-[var(--slate-800)]">
          Traffic Übersicht
        </h3>
        <select
          id="traffic-period-filter"
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="text-[13px] font-medium py-2 px-3 pr-8 rounded-lg text-[var(--slate-700)] min-w-0"
        >
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
          <option value="90d">Letzte 90 Tage</option>
        </select>
      </div>

      {/* KPI Bar - same style as global dashboard */}
      <KPIBar>
        <KPICard
          icon={Users}
          value={totals.totalBesucher.toLocaleString('de-DE')}
          label="Besucher gesamt"
          variant="primary"
          trend={{ direction: 'up', value: '+12.5%' }}
          tooltip="Summe aller Website-Besucher aus allen Quellen"
        />
        <KPICard
          icon={Target}
          value={totals.totalLeads.toLocaleString('de-DE')}
          label="Leads gesamt"
          variant="secondary"
          trend={{ direction: 'up', value: '+8.2%' }}
          tooltip="Anzahl generierter Kontaktanfragen"
        />
        <KPICard
          icon={Percent}
          value={totals.conversionRate}
          label="Conversion-Rate"
          unit="%"
          tooltip="Berechnung: (Leads / Besucher) × 100"
        />
        <KPICard
          icon={Award}
          value={totals.topSource.source}
          label="Top Quelle"
          variant="primary"
          tooltip="Klicken um Kampagnen anzuzeigen"
          onClick={handleCampaignClick}
        />
      </KPIBar>

      {/* Main Content Grid */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Traffic Verlauf Chart */}
        <div className="bg-[var(--bg-surface)] border border-[var(--slate-100)] rounded-xl p-5 shadow-[0_1px_3px_rgb(0_0_0_/0.04)]">
          <h4 className="m-0 mb-4 text-sm font-semibold text-[var(--slate-700)]">
            Traffic Verlauf
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trafficTimeline} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="0"
                stroke="var(--slate-100)"
                vertical={false}
                opacity={0.7}
              />
              <XAxis
                dataKey="date"
                stroke="var(--slate-300)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              {/* Left Y-Axis for Besucher (Cleveland's dual-scale principle) */}
              <YAxis
                yAxisId="left"
                stroke="var(--primary)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                width={45}
                label={{
                  value: 'Besucher',
                  angle: -90,
                  position: 'insideLeft',
                  style: TRAFFIC_AXIS_LABEL_VISITORS,
                  offset: 5
                }}
              />
              {/* Right Y-Axis for Leads - separate scale for visibility */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--secondary)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={45}
                label={{
                  value: 'Leads',
                  angle: 90,
                  position: 'insideRight',
                  style: TRAFFIC_AXIS_LABEL_LEADS,
                  offset: 5
                }}
              />
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'var(--slate-200)', strokeWidth: 1 }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="line"
                wrapperStyle={TRAFFIC_LEGEND_STYLE}
              />

              {/* Reference Line for Average Besucher - Tufte's context principle */}
              <ReferenceLine
                yAxisId="left"
                y={averages.avgBesucher}
                stroke="var(--slate-300)"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{
                  value: `Ø ${(averages.avgBesucher / 1000).toFixed(1)}k`,
                  position: 'insideTopLeft',
                  ...TRAFFIC_REF_LABEL_STYLE
                }}
              />

              {/* Reference Line for Average Leads */}
              <ReferenceLine
                yAxisId="right"
                y={averages.avgLeads}
                stroke="var(--slate-300)"
                strokeDasharray="2 2"
                strokeWidth={1}
                label={{
                  value: `Ø ${averages.avgLeads}`,
                  position: 'insideTopRight',
                  ...TRAFFIC_REF_LABEL_STYLE
                }}
              />

              {/* Besucher Line - Solid, prominent (Cleveland's visual hierarchy) */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="besucher"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'white', strokeWidth: 2 }}
                name="Besucher"
                isAnimationActive={false}
              />

              {/* Leads Line - Dashed pattern for differentiation (Accessibility) */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="leads"
                stroke="var(--secondary)"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 5, fill: 'var(--secondary)', stroke: 'white', strokeWidth: 2 }}
                name="Leads"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources List */}
        <div className="bg-[var(--bg-surface)] border border-[var(--slate-100)] rounded-xl p-5 shadow-[0_1px_3px_rgb(0_0_0_/0.04)]">
          <h4 className="m-0 mb-4 text-sm font-semibold text-[var(--slate-700)]">
            Traffic nach Quelle
          </h4>
          <div className="flex flex-col gap-2.5">
            {trafficBySource.map((source, index) => {
              const Icon = source.icon;
              const percentage = ((source.besucher / totals.maxBesucher) * 100).toFixed(0);
              const barStyle = { width: `${percentage}%` };
              const convRate = ((source.leads / source.besucher) * 100).toFixed(1);
              const isHighConversion = parseFloat(convRate) > 3;

              return (
                <div
                  key={index}
                  onClick={() => handleSourceClick(source.source)}
                  className={`p-2.5 -m-2.5 mb-0 rounded-lg transition-colors ${onNavigate ? 'cursor-pointer hover:bg-[var(--slate-50)]' : ''}`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--slate-100)]">
                        <Icon size={14} className="text-[var(--slate-600)]" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--slate-700)]">
                        {source.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-[var(--slate-800)]">
                        {source.besucher.toLocaleString('de-DE')}
                      </span>
                      {onNavigate && (
                        <ExternalLink size={12} className="text-[var(--slate-400)]" />
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-[var(--slate-100)] rounded-[3px] overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-[3px] transition-[width] duration-300"
                      style={barStyle}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-[var(--slate-400)]">
                      {source.leads} Leads
                    </span>
                    <Tooltip content="Conversion-Rate dieser Quelle" position="left">
                      <span className={`text-[11px] cursor-help ${isHighConversion ? 'text-[var(--secondary)] font-semibold' : 'text-[var(--slate-400)]'}`}>
                        {convRate}% Conv.
                      </span>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficTab;
